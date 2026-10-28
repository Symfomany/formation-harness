# Correction — Atelier 2 : Acter (🔒 animateur)

## Ce que l'atelier fait apprendre
Transformer `PLAN.md` en dispositif réutilisable : **instructions** (cadre), **agents** (qui), **skills** (comment), puis l'exécuter avec validation humaine entre les étapes.

## Architecture
```
PLAN.md ──► Reviewer + revue-agilite ──► revue.md
                  │ (humain valide le diagnostic)
                  ▼
        Décisions du groupe (référent produit)
                  ▼
        Rédacteur + formater-us ──► backlog/sortie/lot<N>/ + synthese-actions.md
                  ▼
        Contrôle de structure ──► relecture humaine
```
Principes : un rôle = un livrable · producteur ≠ critique · l'humain décide · tout passe par des fichiers · outils minimaux.

## Les deux agents
| | [Reviewer](../.github/agents/reviewer-backlog.agent.md) | [Rédacteur](../.github/agents/redacteur-backlog.agent.md) |
|---|---|---|
| Mission | Diagnostiquer, écrire `revue.md` | Réécrire, découper, écrire sorties + synthèse |
| Skill | `revue-agilite` | `formater-us` |
| Interdits | Ne réécrit pas, ne tranche aucune ND | Ne tranche aucune ND, ne touche pas l'US correcte |
| Handoff | Vers le Rédacteur, **après** décisions du groupe | — |
| Outils | `read, search, edit` | `read, search, edit` |

Points à expliquer :
- Les squelettes avaient 4 `TODO` par agent : tous convertis en mission/méthode/interdits, avec **entrées** et **sorties** explicites.
- Le handoff matérialise le point de validation humaine « entre deux agents, pas dedans ».
- Limite honnête : `edit` est nécessaire pour écrire les fichiers, mais autorise techniquement à modifier `entree/`. Seule la **consigne** l'interdit : d'où le contrôle `cmp` des US correctes et la vigilance en phase Analyser (cause « mauvais outil »).

## Les skills
| Skill | Rôle | Contenu notable |
|---|---|---|
| [`formater-us`](../.github/skills/formater-us/SKILL.md) | Format cible | 10 étapes, contrôle de structure, exemple US-105, contre-exemple US-104 (canal et délai inventés) |
| [`revue-agilite`](../.github/skills/revue-agilite/SKILL.md) | Diagnostic | Bloquant vs recommandation, tableau des signaux de défaut, règle « la RM prime », repérage des doublons |
| [`analyser-ecarts`](../.github/skills/analyser-ecarts/SKILL.md) | Phase 3 | Grille, 4 causes, une modification |

`name` = nom du dossier ; `description` rédigée avec les mots que l'utilisateur emploie (clé du déclenchement).

## Les prompts de lancement
`/planifier-lot`, `/acter-reviewer`, `/acter-redacteur`, `/analyser-lot` dans [`.github/prompts/`](../.github/prompts/) : un prompt par phase, avec le numéro de lot en variable.

## Choix de correction pour les 20 US
| Défaut | Traitement | US |
|---|---|---|
| Vague | Reformuler sur les RM, question sur le terme flou, aucun critère d'ergonomie inventé | 101, 201, 301, 401 |
| Trop volumineuse | Découpage en US-xxx-a…, chacune citant l'US d'origine ; doublons renvoyés vers les US existantes | 102 (5), 202 (6), 302 (4), 402 (6) |
| Contradictoire | La **RM prime**, l'écart est visible en question ouverte | 103 (RM-01), 203 (RM-05), 303 (RM-07), 403 (ND-01) |
| Sans critères | Critères tirés des RM, ce qui manque en question ouverte | 104, 204, 304, 404 |
| Correcte | Copie identique | 105, 205, 305, 405 |

### Les cas délicats
- **US-102-a** : « brouillon » n'est pas dans les six statuts de RM-02 → question, on n'ajoute pas de statut.
- **US-202-b** : la matrice paramétrable contredit RM-04 → livrée bloquée, critère provisoire « suit RM-04 ».
- **US-203** : trois contradictions (demandeur vs RM-05, non modifiable vs ajustable, calculée vs choisie).
- **US-403** : aucun des deux seuils n'est retenu ; l'alerte immédiate P1 n'est pas reprise.
- **US bloquées** (ND-02, ND-03, ND-04, ND-01, SLA, IA) : critères *provisoires* sans valeur, marqués « Bloquée ».

## Contrôle de structure appliqué
Titre `# US-XXX — …` · 5 sections · ≥ 1 critère « Étant donné » · aucune valeur chiffrée pour une ND · les 4 US correctes comparées à l'entrée par `cmp`. Résultat : 37/37 conformes ([synthese-actions.md](../sprintdesk/resultats/synthese-actions.md)).

## Erreurs fréquentes des groupes
- Compléter ND-01 à 3 jours ou ND-02 à 5 Mo.
- Reformuler US-105 « pour l'améliorer ».
- Découper en perdant l'identifiant d'origine.
- Recopier le format dans les agents au lieu de citer la skill.
