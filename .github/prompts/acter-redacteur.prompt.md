---
description: "Phase 2b — Réécrit les US d'un lot (Rédacteur) après revue et décisions validées."
agent: redacteur-backlog
tools: ['read', 'search', 'edit']
---
Décisions du groupe pour le lot ${input:lot:numéro du lot} : ${input:decisions:décisions tranchées, ou « aucune »}.
À partir de sprintdesk/resultats/revue.md, écris les US dans sprintdesk/backlog/sortie/lot${input:lot}/ avec la skill formater-us, puis sprintdesk/resultats/synthese-actions.md.
Les ND-xx non tranchées restent en questions ouvertes. Recopie à l'identique l'US jugée correcte.
