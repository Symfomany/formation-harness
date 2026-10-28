#!/usr/bin/env node
'use strict';
// Hook sessionStart — injecte un rappel de contexte au démarrage (ou à la reprise) d'une session.
// La liste des décisions non prises est lue dans sprintdesk/contexte/regles-metier.md :
// une seule source de vérité, pas de copie à maintenir dans le hook.
// Échec ou délai dépassé : la session démarre sans rappel (fail-open, sans risque).

const fs = require('node:fs');
const path = require('node:path');
const { lireEvenement, champ, repondre } = require('./commun.cjs');

const evenement = lireEvenement() || {};
const racine = evenement.cwd || process.cwd();
const source = champ(evenement, 'source', 'source') || 'startup';

let decisions = [];
try {
  const regles = fs.readFileSync(path.join(racine, 'sprintdesk', 'contexte', 'regles-metier.md'), 'utf8');
  decisions = regles.split(/\r?\n/)
    .map((l) => /^\|\s*(ND-\d{2})\s*\|\s*(.+?)\s*\|\s*$/.exec(l))
    .filter(Boolean)
    .map((m) => `${m[1]} (${m[2]})`);
} catch {
  // Fichier absent : on n'invente rien, on le signale.
  decisions = ['regles-metier.md introuvable : demander le contexte avant toute rédaction'];
}

const lignes = [
  `Rappel SprintDesk (hook sessionStart, source : ${source}).`,
  '- Zones en lecture seule : sprintdesk/backlog/entree/ et sprintdesk/contexte/.',
  `- Décisions non prises, à laisser en « Questions ouvertes » : ${decisions.join(' ; ')}.`,
  '- Contrôle de format disponible : node .github/scripts/verifier-us.cjs',
];
if (source === 'resume') {
  lignes.push("- Reprise de session : relire le plan et le journal d'exécution (sprintdesk/resultats/) avant d'agir, ne pas refaire une étape déjà validée.");
}

repondre({ additionalContext: lignes.join('\n') });
