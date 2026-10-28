#!/usr/bin/env node
'use strict';
// Hook agentStop — « pas de fin de tour avec une US non conforme ».
// Contrôle les US de sortie modifiées ou nouvelles (git status). En cas d'écart, renvoie
// decision: "block" : l'agent reçoit « reason » comme consigne et repart pour un tour.
// Anti-boucle : si stop_hook_active vaut true, ce tour a déjà été forcé une fois -> on laisse finir
// et on rend la main à l'humain (le runtime coupe de toute façon après 8 blocages consécutifs).

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { lireEvenement, repondre } = require('./commun.cjs');
const { verifierFichiers, listerUS, RACINE_SORTIE } = require(path.join(__dirname, '..', '..', 'scripts', 'verifier-us.cjs'));

const evenement = lireEvenement() || {};
if (evenement.stop_hook_active === true) { repondre({}); process.exit(0); }

const racine = evenement.cwd || process.cwd();

function usModifiees() {
  try {
    const sortie = execFileSync('git', ['status', '--porcelain', '--untracked-files=all', '--', RACINE_SORTIE], { cwd: racine, encoding: 'utf8' });
    return sortie.split('\n')
      .map((l) => l.slice(3).trim().split(' -> ').pop()) // renommage : garder le nouveau nom
      .filter((f) => /US-[^/]*\.md$/.test(f))
      .map((f) => path.join(racine, f))
      .filter((f) => fs.existsSync(f)); // fichiers supprimés ignorés
  } catch {
    return listerUS(path.join(racine, RACINE_SORTIE)); // pas de git : on contrôle tout
  }
}

const enErreur = verifierFichiers(usModifiees()).filter((r) => r.erreurs.length);
if (!enErreur.length) { repondre({}); process.exit(0); }

const detail = enErreur.slice(0, 5)
  .map((r) => `${path.relative(racine, r.fichier).split(path.sep).join('/')} : ${r.erreurs.slice(0, 4).join(' ; ')}`)
  .join('\n');

repondre({
  decision: 'block',
  reason: `Avant de terminer, corrige les US non conformes (contrôle node .github/scripts/verifier-us.cjs) :\n${detail}\nNe tranche aucune ND-xx : ajoute une question ouverte si une décision manque. Si tu ne peux pas corriger, explique pourquoi et rends la main.`,
});
