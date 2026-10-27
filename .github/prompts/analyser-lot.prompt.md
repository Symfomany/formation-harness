---
description: "Phase 3 — Compare les sorties d'un lot aux critères du plan et prépare ANALYSE.md."
agent: agent
tools: ['read', 'search', 'edit']
---
Applique la skill analyser-ecarts au lot ${input:lot:numéro du lot}.
Compare sprintdesk/backlog/sortie/lot${input:lot}/ aux critères de [PLAN.md](../../PLAN.md), remplis la grille par US, identifie la cause de chaque défaut et propose UNE seule modification.
Écris sprintdesk/resultats/ANALYSE.md. Ne modifie ni les sources ni les sorties.
