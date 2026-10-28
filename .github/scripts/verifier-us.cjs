#!/usr/bin/env node
'use strict';
// Contrôle déterministe du format des user stories de sortie SprintDesk.
// Une seule source de vérité, utilisée par :
//   - la CI (.github/workflows/controle-backlog.yml) ;
//   - les hooks d'exemple (.github/hooks-exemples/) : postToolUse et agentStop.
// Usage : node .github/scripts/verifier-us.cjs [--json] [fichier.md ...]
// Sans fichier : contrôle tout sprintdesk/backlog/sortie/.

const fs = require('node:fs');
const path = require('node:path');

const SECTIONS = ['Besoin', 'Règles métier', "Critères d'acceptation", 'Dépendances', 'Questions ouvertes'];
const RACINE_SORTIE = path.join('sprintdesk', 'backlog', 'sortie');
// US-104.md, US-104a.md (découpage), US-104-1.md (découpage numéroté)
const NOM_FICHIER = /^(US-\d{3})([a-z]|-\d+)?\.md$/;

function normaliser(texte) {
  return texte.replace(/\u2019/g, "'");
}

function decouperSections(texte) {
  const sections = {};
  let courante = null;
  for (const ligne of texte.split(/\r?\n/)) {
    const titre = /^##\s+(.+?)\s*$/.exec(ligne);
    if (titre) {
      courante = normaliser(titre[1]);
      sections[courante] = [];
    } else if (courante) {
      sections[courante].push(ligne);
    }
  }
  return Object.fromEntries(Object.entries(sections).map(([k, v]) => [k, v.join('\n').trim()]));
}

// Regroupe les puces et leurs lignes de continuation.
function puces(section) {
  const resultat = [];
  for (const ligne of section.split(/\r?\n/)) {
    if (/^\s*[-*]\s+/.test(ligne)) resultat.push(ligne.replace(/^\s*[-*]\s+/, ''));
    else if (resultat.length && ligne.trim()) resultat[resultat.length - 1] += ' ' + ligne.trim();
  }
  return resultat;
}

function verifierUS(chemin, texteBrut) {
  const erreurs = [];
  const texte = normaliser(texteBrut);
  const nom = path.basename(chemin);
  const nomOk = NOM_FICHIER.exec(nom);
  if (!nomOk) {
    erreurs.push('nom de fichier non conforme (attendu US-XXX.md, US-XXXa.md ou US-XXX-1.md)');
    return erreurs;
  }
  const idFichier = nom.replace(/\.md$/, '');
  const idOrigine = nomOk[1];
  const estDerivee = Boolean(nomOk[2]);

  const titre = /^#\s+(US-[\w-]+)\s+[\u2014\u2013-]\s+\S.*$/m.exec(texte);
  if (!titre) erreurs.push('titre absent ou non conforme (attendu « # US-XXX — Titre »)');
  else if (titre[1] !== idFichier) erreurs.push(`identifiant du titre (${titre[1]}) différent du nom de fichier (${idFichier})`);

  const sections = decouperSections(texte);
  for (const s of SECTIONS) {
    if (!(s in sections)) erreurs.push(`section manquante : « ## ${s} »`);
    else if (!sections[s]) erreurs.push(`section vide : « ## ${s} » (écrire « Aucune. » s'il n'y a rien à signaler)`);
  }

  const besoin = sections['Besoin'] || '';
  if (besoin && !(/en tant qu/i.test(besoin) && /je souhaite/i.test(besoin) && /afin d/i.test(besoin))) {
    erreurs.push('besoin incomplet : forme « En tant que … je souhaite … afin de … » attendue');
  }

  const sectionCriteres = sections["Critères d'acceptation"] || '';
  const criteres = puces(sectionCriteres);
  if (sectionCriteres && criteres.length === 0) erreurs.push("aucun critère d'acceptation sous forme de liste à puces");
  criteres.forEach((c, i) => {
    const gwt = /([ée]tant donn[ée]|given)/i.test(c) && /\b(quand|lorsque|when)\b/i.test(c) && /\b(alors|then)\b/i.test(c);
    if (!gwt) erreurs.push(`critère ${i + 1} non vérifiable : forme « Étant donné … quand … alors … » attendue`);
  });

  // Décisions non prises (ND-xx) : jamais dans un critère, toujours reprises en question ouverte.
  const questions = sections['Questions ouvertes'] || '';
  for (const nd of new Set(sectionCriteres.match(/ND-\d{2}/g) || [])) {
    erreurs.push(`${nd} citée dans un critère d'acceptation : une décision non prise ne peut pas fonder un critère`);
  }
  for (const nd of new Set(texte.match(/ND-\d{2}/g) || [])) {
    if (!questions.includes(nd)) erreurs.push(`${nd} citée sans être reprise dans « Questions ouvertes »`);
  }

  // Traçabilité : une US issue d'un découpage cite son US d'origine.
  if (estDerivee) {
    const corps = titre ? texte.replace(titre[0], '') : texte;
    if (!new RegExp(`\\b${idOrigine}\\b(?![a-z])`).test(corps)) erreurs.push(`US dérivée : lien vers l'US d'origine ${idOrigine} absent`);
  }
  return erreurs;
}

function listerUS(dossier) {
  if (!fs.existsSync(dossier)) return [];
  const fichiers = [];
  for (const entree of fs.readdirSync(dossier, { withFileTypes: true })) {
    const complet = path.join(dossier, entree.name);
    if (entree.isDirectory()) fichiers.push(...listerUS(complet));
    else if (/^US-.*\.md$/.test(entree.name)) fichiers.push(complet);
  }
  return fichiers.sort();
}

function verifierFichiers(fichiers) {
  return fichiers.map((f) => ({
    fichier: f.split(path.sep).join('/'),
    erreurs: verifierUS(f, fs.readFileSync(f, 'utf8')),
  }));
}

function principal(argv) {
  const json = argv.includes('--json');
  const cibles = argv.filter((a) => a !== '--json');
  const fichiers = cibles.length ? cibles : listerUS(RACINE_SORTIE);
  const resultats = verifierFichiers(fichiers);
  const enErreur = resultats.filter((r) => r.erreurs.length);

  if (json) {
    process.stdout.write(JSON.stringify({ controles: resultats.length, enErreur: enErreur.length, resultats }));
  } else {
    const ci = process.env.GITHUB_ACTIONS === 'true';
    for (const r of resultats) {
      if (!r.erreurs.length) { console.log(`OK  ${r.fichier}`); continue; }
      console.log(`KO  ${r.fichier}`);
      for (const e of r.erreurs) {
        console.log(`    - ${e}`);
        if (ci) console.log(`::error file=${r.fichier}::${e}`);
      }
    }
    console.log(`\n${resultats.length} US contrôlée(s), ${enErreur.length} non conforme(s).`);
  }
  return enErreur.length ? 1 : 0;
}

module.exports = { verifierUS, verifierFichiers, listerUS, RACINE_SORTIE };

if (require.main === module) process.exitCode = principal(process.argv.slice(2));
