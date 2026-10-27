# Architecture des agents et cycle de développement (SDLC)

## À quoi ça sert
Une fois le plan validé, on passe à l'**Acter** : on répartit le travail entre des agents, chacun avec un rôle précis dans le cycle de développement. Ce guide aide à décider *combien d'agents*, *lesquels*, et *où placer l'humain*.

## Le cycle de développement et les agents
| Étape du cycle | Rôle | Qui s'en charge | Livrable |
|---|---|---|---|
| Cadrer / planifier | Définir le périmètre et le plan | Humain + mode Plan | `PLAN.md` |
| Analyser le besoin | Diagnostiquer les US (défauts, contradictions, dépendances) | Agent **Reviewer** | `sprintdesk/resultats/revue.md` |
| Décider | Trancher les questions métier | **Humain** (référent produit) | Décisions du groupe |
| Spécifier | Réécrire les US au format cible | Agent **Rédacteur** | `sprintdesk/backlog/sortie/lot<N>/` |
| Vérifier | Relire la pertinence métier, détecter les règles inventées | **Humain** (+ Reviewer en second passage) | Validation |
| Publier | Diffuser vers un outil externe | **Humain** uniquement | Hors périmètre sans validation |

## Le workflow cible
```
PLAN.md (validé par le groupe)
   │
   ▼
Agent Reviewer ── skill revue-agilite ──► resultats/revue.md
   │
   ▼
Décisions du groupe (humain) : ce qui est tranché / ce qui reste ND-xx
   │
   ▼
Agent Rédacteur ── skill formater-us ──► backlog/sortie/lot<N>/US-xxx.md
   │                                     resultats/synthese-actions.md
   ▼
Relecture humaine (pertinence métier, aucune décision inventée)
```
Les **instructions communes** s'appliquent à chaque étape.

## Principes d'architecture
1. **Un rôle = un livrable.** Un agent qui diagnostique et réécrit à la fois s'auto-valide.
2. **Séparer producteur et critique.** Le Reviewer constate, le Rédacteur applique : ils ne sont jamais le même agent.
3. **L'humain décide, l'agent propose.** Une décision `ND-xx` reste une question ouverte jusqu'à ce que le métier tranche.
4. **Passer par des fichiers.** Chaque étape lit un fichier et en écrit un : le résultat est traçable, relisible et rejouable.
5. **Outils minimaux.** Un agent n'a que les outils dont son rôle a besoin.
6. **Savoir-faire dans les skills.** Les agents définissent *qui*, les skills définissent *comment* : plusieurs agents peuvent partager une skill.

## Répartition des briques
| Brique | Répond à | Exemple |
|---|---|---|
| Instructions | Quelles règles valent partout ? | Ne pas inventer de décision métier |
| Agent | Qui fait quoi ? | Reviewer, Rédacteur |
| Skill | Comment le faire ? | `revue-agilite`, `formater-us` |
| Plan | Dans quel ordre, avec quelles validations ? | `PLAN.md` |

## Fiche d'identité d'un agent (à remplir avant de l'écrire)
| Question | Reviewer | Rédacteur |
|---|---|---|
| Mission en une phrase | Diagnostiquer les US sans les réécrire | Réécrire les US à partir de la revue et des décisions |
| Entrées | US d'origine, contexte, règles | `revue.md`, décisions du groupe |
| Sorties | `revue.md` | US en sortie, `synthese-actions.md` |
| Skill utilisée | `revue-agilite` | `formater-us` |
| Ne décide pas | Les règles métier | Les décisions non prises |
| Arrêt / escalade | Question métier posée | Information manquante → question ouverte |

## Aller plus loin (extensions)
- **Agent expert agilité** : challenge le découpage et les critères d'acceptation.
- **Superviseur et sous-agents** : un agent coordonne, les autres exécutent chacun leur étape. Mise en pratique : [09-orchestration.md](09-orchestration.md).
- **Skill `preparer-publication`** : prépare les tickets, avec prévisualisation et validation humaine avant toute publication.

Ensuite : [04-agents.md](04-agents.md) et [05-skills.md](05-skills.md) pour les créer.
