#!/usr/bin/env node
'use strict';
// Hook subagentStart — préfixe la consigne de chaque sous-agent avec les interdits du projet.
// Un sous-agent ne voit pas la conversation de l'orchestrateur : sans ce rappel, il peut ignorer
// une règle que l'orchestrateur connaissait. Ce hook ne peut pas bloquer la création du sous-agent.

const { lireEvenement, champ, repondre } = require('./commun.cjs');

const evenement = lireEvenement() || {};
const agent = String(champ(evenement, 'agentName', 'agent_name') || 'inconnu');

const commun = [
  `Consigne transmise par le hook subagentStart (sous-agent : ${agent}).`,
  '- Ne tranche aucune décision non prise (ND-01 à ND-06) : écris une question ouverte.',
  '- Ne modifie ni sprintdesk/backlog/entree/ ni sprintdesk/contexte/.',
  '- Ne publie rien vers un service externe.',
  "- Termine en listant le livrable produit et les contrôles réellement exécutés.",
];

const specifique = {
  'reviewer-backlog': '- Livrable unique : sprintdesk/resultats/revue.md. Tu ne réécris aucune US.',
  'redacteur-backlog': "- Après chaque US écrite, lance : node .github/scripts/verifier-us.cjs <fichier>. Une US conforme à l'entrée reste inchangée.",
  'planificateur-backlog': "- Tu planifies seulement : aucun livrable métier, statut du plan « PROPOSÉ » tant qu'un humain ne l'a pas approuvé.",
};

if (specifique[agent]) commun.push(specifique[agent]);
repondre({ additionalContext: commun.join('\n') });
