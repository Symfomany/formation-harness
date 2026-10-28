#!/usr/bin/env node
'use strict';
// Hook preToolUse — garde-fou « sources protégées et actions irréversibles ».
// Refuse :
//   1. toute écriture dans sprintdesk/backlog/entree/ ou sprintdesk/contexte/ (RM : sources immuables) ;
//   2. les commandes irréversibles ou qui publient : git push, git reset --hard, gh pr merge, gh release.
// Ne renvoie jamais « allow » : sans objection, il rend {} et la demande suit le circuit normal d'approbation.
// Échec du script (exception, code non nul) = refus (fail-closed). Dépassement du délai = autorisé (fail-open).

const { lireEvenement, champ, argumentsOutil, repondre } = require('./commun.cjs');

const ZONES = ['sprintdesk/backlog/entree', 'sprintdesk/contexte'];
const OUTIL_ECRITURE = /(edit|create|write|replace|patch|delete|rename|move)/i;
const OUTIL_SHELL = /(bash|powershell|shell|terminal)/i;
const VERBE_ECRITURE = /(>|\brm\b|\bmv\b|\bcp\b|sed\s+-i|set-content|add-content|out-file|remove-item|move-item|copy-item|new-item|tee\b)/i;
const COMMANDES_INTERDITES = [
  { motif: /\bgit\s+push\b/i, raison: 'git push est réservé à un humain : la publication passe par une revue de PR.' },
  { motif: /\bgit\s+reset\s+--hard\b/i, raison: "git reset --hard détruit l'historique local : utiliser git revert <sha> dans une PR." },
  { motif: /\bgh\s+pr\s+merge\b/i, raison: 'La fusion de PR est une décision humaine (revue + contrôles requis).' },
  { motif: /\bgh\s+release\b/i, raison: "Une publication passe par l'environnement « publication » et son approbation." },
];

function refuser(raison) {
  repondre({ permissionDecision: 'deny', permissionDecisionReason: raison });
}

const evenement = lireEvenement();
if (evenement === null) {
  refuser('Événement de hook illisible : refus par prudence (fail-closed).');
} else {
  const outil = String(champ(evenement, 'toolName', 'tool_name') || '');
  const args = argumentsOutil(evenement);
  const texte = JSON.stringify(args).replace(/\\\\/g, '/').toLowerCase();
  const zone = ZONES.find((z) => texte.includes(z));

  if (OUTIL_SHELL.test(outil)) {
    const commande = String(args.command || args.brut || '');
    const interdite = COMMANDES_INTERDITES.find((c) => c.motif.test(commande));
    if (interdite) refuser(interdite.raison);
    else if (zone && VERBE_ECRITURE.test(commande)) refuser(`Zone protégée (${zone}) : aucune commande ne doit la modifier.`);
    else repondre({});
  } else if (OUTIL_ECRITURE.test(outil) && zone) {
    refuser(`Zone protégée (${zone}) : écrire la nouvelle version dans sprintdesk/backlog/sortie/ et poser la question au référent.`);
  } else {
    repondre({});
  }
}
