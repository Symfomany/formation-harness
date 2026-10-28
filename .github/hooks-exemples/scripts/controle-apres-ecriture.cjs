#!/usr/bin/env node
'use strict';
// Hook postToolUse — contrôle immédiat d'une US écrite dans sprintdesk/backlog/sortie/.
// Le hook ne peut pas annuler l'écriture (l'outil a déjà agi) : il ajoute un retour au modèle
// (additionalContext) pour qu'il corrige dans le même tour. Même script que la CI : même verdict.

const fs = require('node:fs');
const path = require('node:path');
const { lireEvenement, champ, argumentsOutil, repondre } = require('./commun.cjs');
const { verifierUS } = require(path.join(__dirname, '..', '..', 'scripts', 'verifier-us.cjs'));

const OUTIL_ECRITURE = /(edit|create|write|replace|patch)/i;
const CHEMIN_US = /sprintdesk\/backlog\/sortie\/[^"'\s]*US-[^"'\s/]*\.md/gi;

const evenement = lireEvenement();
if (!evenement) { repondre({}); process.exit(0); }

const outil = String(champ(evenement, 'toolName', 'tool_name') || '');
if (!OUTIL_ECRITURE.test(outil)) { repondre({}); process.exit(0); }

const racine = evenement.cwd || process.cwd();
const texte = JSON.stringify(argumentsOutil(evenement)).replace(/\\\\/g, '/');
const chemins = [...new Set((texte.match(CHEMIN_US) || []).map((c) => c.replace(/^.*?(sprintdesk\/)/i, '$1')))];

const retours = [];
for (const relatif of chemins) {
  const absolu = path.join(racine, relatif);
  if (!fs.existsSync(absolu)) continue;
  const erreurs = verifierUS(absolu, fs.readFileSync(absolu, 'utf8'));
  if (erreurs.length) retours.push(`${relatif} n'est pas conforme au modèle :\n- ${erreurs.join('\n- ')}`);
}

repondre(retours.length
  ? { additionalContext: `Contrôle automatique (hook postToolUse).\n${retours.join('\n')}\nCorrige ces points avant de passer à l'US suivante. Si la correction exige une décision métier, ajoute une question ouverte au lieu de trancher.` }
  : {});
