# Atelier — Du besoin métier au backlog avec GitHub Copilot

Fil rouge : **SprintDesk chez HabiOuest** (cas fictif, voir `sprintdesk/contexte/produit.md`). Cycle **Planifier → Acter → Analyser**.
20 participants (PO/PM, Scrum, Dev, DevOps), 4 groupes mélangés de 5, un lot par groupe.

## Contexte
HabiOuest, bailleur social régional (12 agences, 450 collaborateurs), reçoit les demandes métier de ses équipes par e-mail et tableur partagé : demandes perdues, priorités contestées, aucun suivi. La DSI lance **SprintDesk** pour centraliser, qualifier, prioriser et suivre ces demandes.

## Problématique
Le backlog initial est inexploitable en l'état : US vagues, trop volumineuses, contradictoires ou sans critères d'acceptation. Certaines règles sont validées (`RM-xx`), d'autres décisions **n'ont pas été prises** (`ND-xx`) et ne doivent pas être inventées.

## Le défi avec Copilot
Un agent générique « améliore » volontiers une US… en inventant des règles, en réécrivant ce qui était correct et sans dire ce qu'il a vérifié. Le défi : transformer Copilot en **assistant métier encadré** (un *harness*) :
- **Instructions** pour le contexte du projet et les règles communes (ne pas inventer, tracer, distinguer faits / propositions / questions) ;
- **Agents** aux rôles séparés (un Reviewer qui diagnostique, un Rédacteur qui réécrit) ;
- **Skills** pour les savoir-faire réutilisables (format d'US, revue agile) ;
- **Validation humaine** sur les décisions métier et avant toute publication.

Résultat attendu : un backlog exploitable, traçable, et des questions ouvertes visibles plutôt que des réponses inventées.

## Le parcours
| Temps | Ce que les groupes pratiquent |
|---|---|
| **Atelier 1 — Planifier** | Rédiger des **instructions claires** du contexte du projet, puis **prompter** pour obtenir un plan clair et bien construit (`PLAN.md`) |
| **Atelier 2 — Acter** | Définir l'**architecture des agents** et leur rôle dans le cycle de développement (SDLC), puis créer les **agents** et les **skills** qui exécutent le plan |
| **Bonus — Analyser** | **Évaluer et ajuster** : critères de succès, signaux qualitatifs et quantitatifs, analyse des traces et des sorties, distinction entre erreur de raisonnement, mauvais outil, mauvais contexte et environnement, puis ajustement des instructions, outils, contraintes et mémoire |

## Lots
| Groupe | Lot | US |
|---|---|---|
| 1 | Dépôt des demandes | 101–105 |
| 2 | Qualification et priorisation | 201–205 |
| 3 | Traitement des demandes | 301–305 |
| 4 | Pilotage du backlog | 401–405 |

Chaque lot : une US vague, une trop volumineuse, une contradictoire, une sans critères, une déjà correcte.

## Contenu du dépôt
```
sprintdesk/contexte/          produit.md, regles-metier.md (règles validées + décisions non prises)
sprintdesk/backlog/entree/    20 US par lot (lot1..lot4)
sprintdesk/backlog/sortie/    production des groupes
sprintdesk/resultats/         revue, synthèse, ANALYSE
.github/                      squelettes : instructions, 2 agents, 2 skills
animateur/                    fiches-groupes.md, corrige.md (à ne pas distribuer)
docs/                         guides pas à pas par atelier + aide-mémoire PDF
```
`PLAN.md` est produit par chaque groupe à la racine.

## Avant la formation
1. Distribuer une copie du dépôt par groupe, avec son seul lot dans `entree/`, sans `animateur/`.
2. Préparer les présentations 1 et 2 (contexte/instructions/outils ; agents vs skills).

## Guides pratiques
Voir [`docs/README.md`](docs/README.md) : instructions, plan, architecture des agents, agents, skills, prompts et évaluation.

## Socle de réussite
Un `PLAN.md`, deux agents, deux skills, cinq US traitées avec traçabilité.
Bonus : `ANALYSE.md` (critères de succès, constats, une modification testée).
Extensions : agent expert agilité, skill `preparer-publication`, superviseur et sous-agents, publication GitHub Issues (avec prévisualisation et validation humaine), boucle d'analyse.
