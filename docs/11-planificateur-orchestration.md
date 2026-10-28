# Bonus 11 — Planificateur et orchestration agentique

## À quoi ça sert
Le bonus [09-orchestration.md](09-orchestration.md) montre un orchestrateur qui enchaîne des agents. Ce bonus ajoute ce qui le rend fiable :

| Ajout | Question à laquelle il répond |
|---|---|
| Un **planificateur** séparé | Qui décide *quoi faire*, avant que quiconque *agisse* ? |
| Un **plan approuvé** | À partir de quand un agent a-t-il le droit d'écrire ? |
| Un **journal d'exécution** | Où en est-on ? Que reprendre après une interruption ? |
| Des règles d'**isolation** | Comment faire travailler plusieurs agents en parallèle sans conflit ? |
| Un **retour arrière** | Comment annuler proprement une étape ratée ? |
| Un **cycle de vie** des agents | Comment ajouter, remplacer ou retirer un agent sans casser le reste ? |

Principe directeur : **planifier, faire approuver, agir, tracer**. Aucune action avant l'approbation du plan.

---

## 1. Séparer planification, raisonnement et action

| Phase | Qui | Produit | Droits |
|---|---|---|---|
| Planifier | `planificateur-backlog` | `sprintdesk/resultats/plan-lot<N>.md` (statut PROPOSÉ) | Lecture + un seul fichier |
| Valider | **Humain** | Statut APPROUVÉ, signé et daté | — |
| Raisonner et agir | Reviewer, Rédacteur, Contrôleur (directement ou via l'orchestrateur) | Livrables du plan | Ceux de chaque agent |
| Tracer | Orchestrateur ou humain | `sprintdesk/resultats/journal-lot<N>.md` | Un seul fichier |

Pourquoi un fichier plutôt qu'un plan dans le chat ?
- Il est **inspectable** : on le relit, on le compare, on le versionne.
- Il est **durable** : il survit à la fermeture du chat et au résumé automatique du contexte.
- Il est **partageable** : un autre agent ou un collègue peut reprendre le travail.

---

## 2. Pas à pas

### Étape 1 — Lancer le planificateur
L'agent est fourni : `.github/agents/planificateur-backlog.agent.md`.

Nouveau chat, agent `planificateur-backlog` :
```
Planifie le traitement du lot <N>. Ne lance aucune étape.
```
Attendu : le fichier `sprintdesk/resultats/plan-lot<N>.md` au statut `PROPOSÉ`, puis le bloc `PLAN PRÊT`. Aucun autre fichier n'est modifié.

### Étape 2 — Relire le plan avec une grille
| Contrôle | Bon signe | Mauvais signe |
|---|---|---|
| Une étape = un agent, un livrable | « 2. Réécrire — redacteur-backlog — sortie/lot<N>/ » | « 2. Réécrire et contrôler » |
| Critère de fin vérifiable | « `verifier-us.cjs` sans KO » | « US de bonne qualité » |
| Autonomie classée | Fusion et publication en « validation humaine » | Aucune étape en validation humaine |
| ND-xx listées sans valeur | « ND-02 : à trancher par le référent » | « ND-02 : 5 Mo maximum » |
| Retour arrière décrit | « revert du commit de l'étape 2 par PR » | Rien, ou « supprimer les fichiers » |

### Étape 3 — Approuver ou faire réviser
- Réviser : `RÉVISER : l'étape 3 doit citer le contrôle automatique`. Le planificateur crée la version suivante, toujours `PROPOSÉ`.
- Approuver : remplacer **vous-même** la ligne de statut par `Statut : APPROUVÉ par <nom> le <date>`.

Le planificateur n'a pas le droit d'écrire « APPROUVÉ ». C'est la porte entre le raisonnement et l'action.

### Étape 4 — Exécuter le plan approuvé
Deux options :
- **Manuel guidé** : bouton de transfert (handoff) « Plan approuvé : lancer le diagnostic » en bas de la réponse du planificateur. Il ouvre `reviewer-backlog` avec un prompt prérempli, sans l'envoyer.
- **Orchestré** : l'orchestrateur du bonus 09. Ajouter cette ligne à sa section « Déroulé », étape 0 :
  ```
  Lire sprintdesk/resultats/plan-lot<N>.md. Si la ligne Statut ne commence pas par « APPROUVÉ », s'arrêter et demander l'approbation.
  ```

### Étape 5 — Tenir un journal d'exécution
Créer `sprintdesk/resultats/journal-lot<N>.md`, mis à jour à la fin de chaque étape :
```markdown
# Journal — lot <N> (plan version <n>)
| Horodatage | Étape | Agent | Résultat | Livrable | Commit | Décision humaine |
|---|---|---|---|---|---|---|
| 2026-05-12 10:02 | 1 Diagnostiquer | reviewer-backlog | fait | resultats/revue.md | 3f2a9c1 | VALIDER (C. Martin) |
| 2026-05-12 10:20 | 2 Réécrire | redacteur-backlog | partiel : US-<N>04 bloquée (ND-02) | sortie/lot<N>/ | 8b41d07 | CORRIGER |
```

Le journal sert à trois choses :
| Usage | Exemple |
|---|---|
| Reprendre sans répéter | Après une interruption, on repart de la première étape non « fait ». |
| Détecter une dérive | Un fichier modifié qui n'apparaît dans aucune étape = action hors plan, arrêt. |
| Revenir en arrière | La colonne « Commit » donne le SHA à annuler (voir étape 7). |

Committez après chaque étape validée : un commit par étape, c'est un point de retour par étape.

### Étape 6 — Détecter et corriger une dérive
Une **dérive** est un écart entre le plan et ce qui se passe réellement.

| Signal | Cause probable | Réaction |
|---|---|---|
| Un agent modifie un fichier hors de son livrable | Consigne de délégation trop vague | Arrêt, annulation du fichier, consigne précisée |
| Le rédacteur tranche une ND-xx | Instruction ignorée | Le hook `postToolUse` et le check CI le signalent ; correction |
| L'orchestrateur saute un point de validation | Interdit mal formulé | Corriger l'agent, rejouer depuis le dernier point validé |
| Le contexte de session contient une ancienne version du plan | Session trop longue, résumé automatique | Nouvelle session, relire plan + journal (le hook `sessionStart` le rappelle à la reprise) |

### Étape 7 — Revenir en arrière proprement
| Situation | Action | À éviter |
|---|---|---|
| Étape locale ratée, pas encore committée | `git restore` sur les fichiers de l'étape | Effacer tout `sortie/` |
| Étape committée sur une branche de travail | `git revert <sha>` puis nouveau commit | `git reset --hard` sur une branche partagée |
| Étape déjà fusionnée dans `main` | Workflow « Rollback backlog (revert par SHA) » : ouvre une PR de revert | Push direct sur `main` |
| Publication déjà faite | Workflow « Publication backlog » relancé avec le SHA d'une version saine | Supprimer la release sans trace |

Après un retour arrière : noter la ligne dans le journal, passer l'étape à « à faire », replanifier si nécessaire (nouvelle version du plan).

---

## 3. Orchestration agentique : les schémas

| Schéma | Principe | Quand l'utiliser | Risque principal |
|---|---|---|---|
| Séquentiel (pipeline) | A puis B puis C | Chaque étape dépend de la précédente | Erreur en cascade |
| Superviseur | Un agent décide qui appeler | Déroulé variable selon les résultats | Superviseur qui fait le travail lui-même |
| Producteur-critique | Un agent produit, un autre critique, on boucle | Qualité difficile à atteindre du premier coup | Boucle sans fin : borner à 2 tours |
| Parallèle (fan-out / fan-in) | Plusieurs agents sur des parties indépendantes, puis fusion | Gros volume, parties disjointes | Conflits à la fusion |
| Transfert (handoff) | La conversation passe d'un agent à l'autre | Enchaînement guidé par un humain | Contexte perdu si le transfert est mal rédigé |

### Travailler en parallèle sans se marcher dessus
Exemple : traiter les lots 1 à 4 en même temps.

| Règle d'isolation | Mise en œuvre SprintDesk |
|---|---|
| Un périmètre de fichiers par agent | Agent A : `sortie/lot1/` ; agent B : `sortie/lot2/`. Jamais deux agents sur le même lot. |
| Un espace de travail par agent | Une branche par lot. Avec Copilot cloud agent : une issue par lot, chaque tâche a sa branche `copilot/...` et sa PR. En local : un worktree Git par agent. |
| Un fichier partagé = un seul écrivain | `synthese-actions.md` : chaque agent écrit `synthese-lot<N>.md`, la fusion est faite par une étape dédiée. |
| Fusion explicite | Étape « fan-in » finale : contrôle global, puis une PR par lot ou une PR de consolidation. |

### Les trois conflits à reconnaître
| Conflit | Exemple | Prévention | Résolution |
|---|---|---|---|
| Modifications qui se chevauchent | Deux agents réécrivent US-204 | Périmètres disjoints dans le plan | Garder une version, l'autre agent rejoue sur la base à jour |
| Travail en double | Deux agents découpent la même US | Une étape = un propriétaire | Supprimer le doublon, noter dans le journal |
| Résultats contradictoires | Le reviewer dit « conforme », le contrôleur dit « KO » | Critères communs (même script de contrôle) | Escalade humaine : on ne laisse pas un agent trancher |

### Orchestrer avec Copilot cloud agent
Pour un traitement en arrière-plan sur GitHub :
1. Le planificateur prépare une **prévisualisation** des issues (un fichier, pas de publication).
2. Un humain crée les issues et les assigne à Copilot.
3. Chaque tâche travaille sur sa branche `copilot/...`, ouvre une **PR brouillon** et ne peut ni l'approuver ni la fusionner.
4. Les workflows de la PR ne tournent qu'après « Approve and run workflows » par un humain (réglage par défaut).
5. Les checks requis (« Format des US de sortie », « Politique - sources protégées ») et la revue humaine décident de la fusion.

---

## 4. Échecs et reprise
| Type d'exécution | Symptôme | Diagnostic | Reprise |
|---|---|---|---|
| Échouée | Erreur, aucun livrable | Journal de session, dernière étape du journal | Corriger la cause, relancer l'étape |
| Partielle | 3 US sur 5 | Comparer le plan, le journal et `sortie/` | Relancer uniquement les US manquantes |
| Bloquée | L'agent tourne en rond, ou attend une réponse | Boucle producteur-critique, `agentStop` qui bloque | Arrêter, escalader à l'humain, borner la boucle |
| Hors plan | Fichier inattendu modifié | Différence entre `git status` et les livrables du plan | Annuler le fichier, préciser la consigne |

Classer la cause avant de corriger (méthode du bonus [07-evaluation.md](07-evaluation.md)) : **erreur de raisonnement** (mauvaise conclusion), **mauvais usage d'un outil** (mauvais fichier, mauvaise commande), **problème de contexte ou d'environnement** (règle absente, fichier manquant, outil non installé).

---

## 5. Cycle de vie des agents
| Opération | Bonne pratique | Pourquoi |
|---|---|---|
| Ajouter | Nouvel agent dans une PR, revue Code Owners, ajout à la liste `agents:` de l'orchestrateur | La liste fermée empêche un appel imprévu |
| Modifier | PR + rejeu du jeu d'évaluation (bonus 07) avant fusion | Un agent est identifié par la version du fichier au commit utilisé |
| Remplacer | Créer `redacteur-backlog-v2`, comparer sur le même lot, puis basculer l'orchestrateur | Pas d'interruption : l'ancien reste disponible jusqu'à la bascule |
| Retirer | Retirer de `agents:`, supprimer le fichier dans une PR qui explique pourquoi | L'historique Git garde la version retirée : l'audit reste possible |

---

## Checklist
- [ ] Le plan existe en fichier, avec un statut et une version.
- [ ] Aucune étape d'écriture n'a démarré avant `APPROUVÉ`.
- [ ] Chaque étape a un critère de fin vérifiable et un retour arrière.
- [ ] Le journal contient un commit par étape validée.
- [ ] En parallèle : périmètres disjoints, un écrivain par fichier.
- [ ] Les contradictions entre agents ont été tranchées par un humain.

## Pièges
- **Plan dans le chat seulement** : il disparaît au résumé automatique et ne se relit pas.
- **Planificateur qui exécute** : il « avance un peu » le diagnostic. C'est un défaut d'agent à corriger.
- **Approbation implicite** : « ok » dans le chat n'est pas une approbation tracée.
- **Parallèle sur un fichier commun** : deux agents écrivent `synthese-actions.md`.
- **Reset au lieu de revert** : l'historique partagé est réécrit, l'audit est perdu.
- **Reprise depuis zéro** : refaire une étape validée gaspille du temps et peut changer un résultat déjà accepté.

> Références : [sous-agents VS Code](https://code.visualstudio.com/docs/agents/run/subagents), [Copilot cloud agent](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent).
