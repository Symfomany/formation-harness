# Correction — Atelier 1 : Planifier (🔒 animateur)

## Ce que l'atelier fait apprendre
Avant d'agir, on fixe le **contrat** : ce que les agents feront, ne décideront pas, et comment on les jugera. Deux livrables : des **instructions** claires, puis un **`PLAN.md`** obtenu en mode Plan.

## Livrable 1 — Instructions : [`.github/copilot-instructions.md`](../.github/copilot-instructions.md)
| Bloc du fichier | Pourquoi il est là | Question du guide 01 couverte |
|---|---|---|
| Contexte | Dit où l'on travaille et l'objectif (« sans inventer de décision métier ») | Quel projet, quel but ? |
| Stratégie Planifier → Acter → Analyser | Fait de la méthode une règle permanente : une phase ne démarre qu'après validation humaine | Cadre commun |
| Documentation (tableau) | Sources de vérité et *quand* les consulter ; `entree/` en lecture seule | Quelles sources ? |
| Règles | Les 6 `TODO` du squelette, rendus impératifs et vérifiables, plus : RM prime en cas de contradiction, condition d'arrêt | Qu'est-ce qui est interdit ? |
| Exemple de réponse | Un exemple vaut trois règles (Faits / Proposition / Questions / Contrôles), pris sur US-403 | Quelle forme de réponse ? |
| Où trouver les détails | Renvoi vers les skills au lieu de recopier | Instructions courtes |

Choix à expliquer : le fichier reste sous une page ; le format d'une US et la méthode de revue **ne sont pas** dedans (skills).

## Livrable 2 — [`PLAN.md`](../PLAN.md) (12 sections)
| § | Contenu | Point clé à relever |
|---|---|---|
| 1 | Objectif, périmètre, hors-périmètre | Pas de code, pas de publication, `entree/` intouchable |
| 2 | Sources | Les 3 sources de vérité |
| 3 | Résultats attendus | Chemins exacts des livrables |
| 4 | RM utilisées, avec les US concernées | Aide à repérer les contradictions |
| 5 | Questions ouvertes ND-01…06 + « hors liste » | **Aucune n'est tranchée** ; SLA, IA, matrice paramétrable sont des décisions non documentées |
| 6 | Format cible | Renvoie à `formater-us`, exemples US-105/205/305/405 |
| 7 | Étapes | Diagnostic → validation → décisions → réécriture → contrôle |
| 8 | Rôles agents | Colonne « Ne décide pas » = ce qui fait un bon harness |
| 9 | Skills | Qui porte quelle méthode |
| 10 | Validations humaines | Avant réécriture, avant toute ND, avant publication |
| 11 | Critères oui/non | 7 cases cochables (utilisées en phase Analyser) |
| 12 | Limites / arrêt | Quand l'agent s'arrête et demande |

Étiquettes **[Fait] / [Proposition] / [À décider]** : l'exigence « distingue faits, propositions, décisions » du prompt de départ.

## Le prompt de planification
Il vit dans [`planifier-lot.prompt.md`](../.github/prompts/planifier-lot.prompt.md) (`/planifier-lot`). Il suit l'anatomie du guide 02 : contexte, sources, interdits, tâche, exigences, format.

Techniques démontrées dans le plan : **décomposition** (diagnostic / décisions / réécriture / contrôle = étapes 2 à 5), **few-shot** (US correctes comme modèles), **itération** (critères rendus oui/non).

## Grille de relecture croisée (animateur)
- [ ] 12 sections remplies ? · [ ] chaque ND rencontrée est une **question**, pas une hypothèse ? · [ ] rôles et skills transcriptibles en fichiers ? · [ ] critères jugeables oui/non ? · [ ] validations humaines avant toute décision métier ?

## Erreurs fréquentes des groupes
- Plan qui répond aux questions métier (« seuil = 3 jours »).
- Critères flous (« US de qualité »).
- Plan trop long, jamais relu.
- Mélange diagnostic + réécriture dans la même étape.
