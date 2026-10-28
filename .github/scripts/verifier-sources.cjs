#!/usr/bin/env node
'use strict';
// Politique « sources protégées » (policy check) de SprintDesk.
// Échoue si une modification touche une zone que ni un agent ni un contributeur ne doit modifier :
//   - sprintdesk/backlog/entree/ : US d'origine, immuables (traçabilité) ;
//   - sprintdesk/contexte/       : règles métier validées, modifiables seulement sur décision du référent.
// Usage :
//   node .github/scripts/verifier-sources.cjs --base <sha> [--autoriser-contexte]
//   node .github/scripts/verifier-sources.cjs fichier1 fichier2 ...

const { execFileSync } = require('node:child_process');

const ZONES = [
  { prefixe: 'sprintdesk/backlog/entree/', motif: "US d'origine immuables : produire une nouvelle version dans sprintdesk/backlog/sortie/" },
  { prefixe: 'sprintdesk/contexte/', motif: 'règles métier validées : modification réservée au référent produit (label decision-referent + revue Code Owners)', derogeable: true },
];

function normaliser(chemin) {
  return chemin.trim().replace(/\\/g, '/').replace(/^\.\//, '');
}

function violations(fichiers, { autoriserContexte = false } = {}) {
  const resultat = [];
  for (const f of fichiers.map(normaliser).filter(Boolean)) {
    const zone = ZONES.find((z) => f.startsWith(z.prefixe));
    if (zone && !(zone.derogeable && autoriserContexte)) resultat.push({ fichier: f, motif: zone.motif });
  }
  return resultat;
}

function fichiersModifies(base) {
  if (!/^[0-9a-f]{7,40}$/i.test(base)) throw new Error(`SHA de base invalide : ${base}`);
  // execFileSync sans shell : aucun risque d'injection via le SHA.
  const sortie = execFileSync('git', ['diff', '--name-only', `${base}...HEAD`], { encoding: 'utf8' });
  return sortie.split('\n').filter(Boolean);
}

function principal(argv) {
  const autoriserContexte = argv.includes('--autoriser-contexte');
  const iBase = argv.indexOf('--base');
  const fichiers = iBase >= 0
    ? fichiersModifies(argv[iBase + 1] || '')
    : argv.filter((a) => !a.startsWith('--'));

  const ko = violations(fichiers, { autoriserContexte });
  const ci = process.env.GITHUB_ACTIONS === 'true';
  for (const v of ko) {
    console.log(`INTERDIT  ${v.fichier} — ${v.motif}`);
    if (ci) console.log(`::error file=${v.fichier}::Zone protégée : ${v.motif}`);
  }
  console.log(`${fichiers.length} fichier(s) examiné(s), ${ko.length} violation(s).`);
  return ko.length ? 1 : 0;
}

module.exports = { violations, ZONES };

if (require.main === module) process.exitCode = principal(process.argv.slice(2));
