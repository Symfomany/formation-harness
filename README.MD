# Atelier — Du besoin métier au backlog avec GitHub Copilot

Fil rouge : **SprintDesk chez HabiOuest** (cas fictif, voir `sprintdesk/contexte/produit.md`). Cycle **Planifier → Acter → Analyser**.
20 participants (PO/PM, Scrum, Dev, DevOps), 4 groupes mélangés de 5, un lot par groupe.

## Contexte
HabiOuest, bailleur social régional (12 agences, 450 collaborateurs), reçoit les demandes métier de ses équipes par e-mail et tableur partagé : demandes perdues, priorités contestées, aucun suivi. La DSI lance **SprintDesk** pour centraliser, qualifier, prioriser et suivre ces demandes.

## Problématique
Le backlog initial est inexploitable en l'état : US vagues, trop volumineuses, contradictoires ou sans critères d'acceptation. Certaines règles sont validées (`RM-xx`), d'autres décisions **n'ont pas été prises** (`ND-xx`) et ne doivent pas être inventées.

## Le défi avec Copilot
Un agent générique « améliore » volontiers une US… en inventant des règles, en réécrivant ce qui était correct et sans dire ce qu'il a vérifié. Le défi : transformer Copilot en **assistant métier encadré** (un *harness*) :
- **Instructions** pour les règles communes (ne pas inventer, tracer, distinguer faits / propositions / questions) ;
- **Agents** aux rôles séparés (un Reviewer qui diagnostique, un Rédacteur qui réécrit) ;
- **Skills** pour les savoir-faire réutilisables (format d'US, revue agile) ;
- **Hook** pour un contrôle automatique et déterministe de la structure ;
- **Validation humaine** sur les décisions métier et avant toute publication.

Résultat attendu : un backlog exploitable, traçable, et des questions ouvertes visibles plutôt que des réponses inventées.

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
sprintdesk/resultats/         revue, synthèse, ANALYSE, rapport de structure
.github/                      squelettes : instructions, 2 agents, 2 skills, hook
scripts/verifier_backlog.py   contrôle de structure (sections, IDs uniques, ≥1 critère)
animateur/                    fiches-groupes.md, corrige.md (à ne pas distribuer)
docs/                         guides : instructions, agents, skills, prompts, hooks + aide-mémoire PDF
```
`PLAN.md` est produit par chaque groupe à la racine.

## Avant la formation
1. Tester le hook sur le poste cible (préversion) ; repli : `python scripts/verifier_backlog.py`.
2. Distribuer une copie du dépôt par groupe, avec son seul lot dans `entree/`, sans `animateur/`.
3. Préparer les présentations 1 et 2 (contexte/instructions/outils ; agents vs skills vs hooks).

## Guides pratiques
Voir [`docs/README.md`](docs/README.md) : comment créer des instructions, un agent, une skill, un prompt réutilisable et un hook.

## Socle de réussite
Un `PLAN.md`, deux agents, deux skills, un hook, cinq US traitées avec traçabilité.
Extensions : agent expert agilité, skill `preparer-publication`, superviseur et sous-agents, publication GitHub Issues (avec prévisualisation et validation humaine), boucle d'analyse.
