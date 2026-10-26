# Fiches de groupe

## Rôles (rotation entre partie 1 et partie 2)
| Rôle | Mission |
|---|---|
| Référent produit | Explicite le besoin et tranche les arbitrages |
| Référent agilité | Challenge découpage et critères d'acceptation |
| Pilote | Manipule Copilot dans VS Code |
| Référent technique | Configure fichiers, hook, outils |
| Responsable qualité | Garde les preuves, prépare la restitution |

Composition conseillée : chaque groupe mélange PO/PM, Scrum, Dev, DevOps.

## Partie 1 — Planifier (11h00–12h00)
Mission : préparer un plan de traitement de vos 5 US, sans les réécrire, sans toucher au code, sans publier.
Utiliser Copilot en mode Plan avec le prompt suivant, puis enregistrer le plan validé dans `PLAN.md`.

```
Nous préparons le backlog du projet SprintDesk, lot <N>.

Lis :
- sprintdesk/contexte/produit.md ;
- sprintdesk/contexte/regles-metier.md ;
- les cinq user stories de sprintdesk/backlog/entree/lot<N>/.

Ne réécris pas encore les user stories.
Ne modifie pas le code de l'application.
Ne publie rien.

Prépare un plan de traitement du backlog.

Avant de finaliser ce plan :
1. Identifie les ambiguïtés, contradictions et informations manquantes.
2. Pose les questions nécessaires aux décisions métier.
3. Propose le format des user stories attendues.
4. Définis des critères de qualité vérifiables.
5. Propose les étapes, les rôles des agents et leurs livrables.
6. Identifie les points de validation humaine.
7. Prévois comment comparer les résultats aux attentes.

Distingue les faits fournis, les propositions et les décisions à prendre.
```

Minutage : 10 min contexte · 20 min dialogue avec Plan · 15 min `PLAN.md` · 10 min relecture croisée · 5 min validation.
Techniques : itération (critiquer la 1re version), few-shot (US-105 en exemple), décomposition (diagnostic / décisions / réécriture / contrôle).

Structure de `PLAN.md` : 1 Objectif et périmètre · 2 Sources · 3 Résultats attendus · 4 Règles métier validées · 5 Questions ouvertes · 6 Format cible d'une US · 7 Étapes · 8 Rôles des agents · 9 Skills · 10 Contrôles et validations humaines · 11 Critères de réussite · 12 Limites et conditions d'arrêt.

Critère de réussite : vous savez dire ce que les agents feront, ne décideront pas, et comment ils seront évalués.

## Partie 2 — Acter (14h30–16h10)
Compléter les `TODO` des squelettes fournis :
1. 14h30 `.github/copilot-instructions.md`
2. 14h40 deux agents dans `.github/agents/`
3. 15h00 deux skills dans `.github/skills/`
4. 15h35 vérifier le hook `.github/hooks/verifier-backlog.json` (script fourni)
5. 15h45 exécuter : Reviewer → décisions du groupe → Rédacteur → contrôle → relecture humaine

Sorties : `sprintdesk/backlog/sortie/lot<N>/`, `sprintdesk/resultats/revue.md`, `synthese-actions.md`.

## Partie 3 (option) — Analyser (16h10–16h30)
Remplir la grille pour chaque US, puis la boucle : 1 défaut → 1 cause → 1 seule modification (plan, instructions, agent ou skill) → rejouer → vérifier l'absence de régression. Livrable : `sprintdesk/resultats/ANALYSE.md`.

| Critère | Avant | Après |
|---|---|---|
| Besoin et valeur compréhensibles | Oui / Partiel / Non | Oui / Partiel / Non |
| Critères d'acceptation vérifiables | | |
| Règles cohérentes avec les sources | | |
| Questions ouvertes visibles | | |
| Traçabilité conservée | | |

Contrôle séparé : une décision métier a-t-elle été inventée ? (oui/non + laquelle)

## Restitution (5 min/groupe)
1 min problème du lot et décisions du plan · 1 min rôles agents et skills · 2 min une US avant/après, revue et contrôle · 1 min une limite ou amélioration.
