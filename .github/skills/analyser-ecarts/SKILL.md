---
name: analyser-ecarts
description: "Analyse les écarts entre les sorties SprintDesk et les critères du plan : grille avant/après, cause (raisonnement, outil, contexte, environnement), une seule modification. Utiliser pour la phase Analyser et produire ANALYSE.md."
---
# Skill analyser-ecarts

## Procédure
1. Relire les critères de réussite de `PLAN.md` (section 11) **avant** de regarder les sorties.
2. Pour chaque US, remplir la grille : besoin compréhensible · CA vérifiables · règles cohérentes · questions visibles · traçabilité (Oui / Partiel / Non).
3. Contrôle séparé : une décision métier a-t-elle été inventée ? (oui/non + laquelle)
4. Pour chaque défaut, trouver la **cause** avec une preuve :
   - raisonnement : les bonnes sources étaient lues, la conclusion est fausse ;
   - outil : action impossible ou outil en trop ;
   - contexte : source non lue, instruction ambiguë ;
   - environnement : mauvais fichier, mauvais emplacement, mauvais lot.
5. Choisir **une seule** modification (instructions, agent, skill, outil, contrainte ou mémoire).
6. Rejouer, puis vérifier l'absence de régression (l'US correcte reste identique).
7. Écrire `sprintdesk/resultats/ANALYSE.md` (gabarit dans `docs/07-evaluation.md`).

## Règles
- Écrire les critères avant de juger ; ne pas juger « à l'impression ».
- 1 défaut → 1 cause → 1 modification.
- Ne pas corriger la skill si le problème est un fichier non lu.
- Ne rien modifier dans `backlog/entree/`.
