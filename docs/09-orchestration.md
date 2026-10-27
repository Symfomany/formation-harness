# Bonus — Orchestrer les agents

## À quoi ça sert
Dans l'Atelier 2, c'est **vous** qui passez la main d'un agent à l'autre : vous lancez le Reviewer, vous relisez, vous lancez le Rédacteur, puis le Contrôleur. Ce bonus confie cette coordination à un **agent orchestrateur** : un « Planificateur-Contrôleur » qui déroule `PLAN.md`, délègue chaque étape au bon agent, s'arrête à chaque validation humaine et produit un **compte rendu HTML** du lot.

Ce que vous gardez : toutes les décisions. Ce que vous déléguez : l'enchaînement, la vérification des livrables et la mise en forme du bilan.

Prérequis : avoir terminé l'Atelier 2 (agents `reviewer-backlog`, `redacteur-backlog`, `controleur-backlog`) et l'Atelier 3 (skills `revue-agilite`, `formater-us`, `verifier-regles-metier`).

---

## 1. Le concept : l'orchestration agentique

### Définition
L'**orchestration agentique** consiste à faire piloter plusieurs agents spécialisés par un agent coordinateur. Cet **orchestrateur** reçoit un objectif, le découpe en étapes, confie chaque étape à un **sous-agent**, vérifie chaque livrable, puis rend compte.

L'orchestrateur ne fait pas le travail lui-même. Comme un chef d'orchestre, il ne joue d'aucun instrument : il donne le départ, tient le tempo et s'assure que chaque musicien joue sa partition.

### Les cinq verbes de l'orchestrateur
| Verbe | Ce que fait l'orchestrateur | Exemple SprintDesk |
|---|---|---|
| **Planifier** | Traduit l'objectif en étapes ordonnées | Lit `PLAN.md`, annonce : diagnostic, réécriture, contrôle, compte rendu |
| **Déléguer** | Confie une étape à l'agent compétent, avec une consigne complète | Demande au Reviewer de produire `revue.md` pour le lot |
| **Contrôler** | Vérifie que le livrable existe et respecte le contrat | `revue.md` couvre-t-il les 5 US ? |
| **S'arrêter** | Rend la main à l'humain aux points de validation | « Validez-vous le diagnostic ? » |
| **Rendre compte** | Produit un bilan lisible et traçable | Tableau de bord HTML du lot |

### Les notions clés
| Notion | Explication simple |
|---|---|
| **Orchestrateur** | L'agent qui coordonne. Il connaît l'équipe, l'ordre des étapes et les règles d'arrêt. |
| **Sous-agent** | Un agent appelé par l'orchestrateur pour une tâche précise. Il rend un résultat, puis s'arrête. |
| **Contexte isolé** | Un sous-agent **ne voit pas** votre conversation. Il ne connaît que la consigne que l'orchestrateur lui transmet. |
| **Consigne de délégation** | Le message envoyé au sous-agent. Il doit être autonome : lot, fichiers à lire, fichier à écrire, décisions validées, interdits. |
| **Point de validation** | Un arrêt obligatoire où l'humain décide : valider, corriger ou arrêter. |
| **Boucle bornée** | Une correction (Rédacteur puis Contrôleur) répétée au plus deux fois, puis remontée à l'humain. |
| **Traçabilité par fichiers** | Chaque étape écrit un fichier. On peut relire, comparer et rejouer. |

### Manuel ou orchestré : ce qui change
| | Atelier 2 (passage manuel) | Bonus (orchestration) |
|---|---|---|
| Qui enchaîne les agents ? | Vous, en changeant d'agent et en recollant un prompt | L'orchestrateur |
| Qui transmet le contexte ? | Vous, à chaque prompt | L'orchestrateur, dans chaque consigne de délégation |
| Qui vérifie que le livrable existe ? | Vous | L'orchestrateur, puis vous au point de validation |
| Qui décide (ND-xx, acceptation) ? | **Vous** | **Vous** : rien ne change |
| Bilan final | À rédiger | Compte rendu HTML généré |
| Risque principal | Oubli d'une étape, prompts différents d'une fois à l'autre | Effet « boîte noire » si on ne lit pas les points de validation |

### Sous-agent ou handoff ?
VS Code propose deux façons de relier des agents.

| | Handoff (bouton) | Sous-agent (délégation) |
|---|---|---|
| Fonctionnement | La conversation **change** d'agent, avec un prompt pré-rempli | L'orchestrateur **reste** l'agent principal et appelle un autre agent |
| Qui déclenche ? | Vous, en cliquant | L'orchestrateur |
| Contexte | Le nouvel agent voit la conversation | Le sous-agent ne voit que sa consigne |
| Usage typique | Enchaînement manuel guidé (Atelier 2) | Orchestration (ce bonus) |

### Les principaux schémas d'orchestration
| Schéma | Principe | Utilisé ici ? |
|---|---|---|
| **Séquentiel** (pipeline) | Les agents travaillent l'un après l'autre, chacun sur la sortie du précédent | Oui : diagnostic, réécriture, contrôle |
| **Superviseur** | Un agent central décide quel agent appeler et quand | Oui : l'orchestrateur |
| **Producteur-critique** | Un agent produit, un autre critique, on boucle jusqu'à satisfaction | Oui, borné à 2 boucles : Rédacteur puis Contrôleur |
| **Parallèle** | Plusieurs agents travaillent en même temps sur des parties indépendantes | Non : le lot est petit et l'ordre compte |

### Risques et garde-fous
| Risque | Ce qui peut arriver | Garde-fou dans ce bonus |
|---|---|---|
| Boîte noire | Tout s'enchaîne, personne ne relit | Points de validation obligatoires, état affiché à chaque réponse |
| Erreur en cascade | Un diagnostic faux produit 5 US fausses | Validation du diagnostic **avant** toute réécriture |
| Orchestrateur qui « fait tout » | Il réécrit lui-même une US au lieu de déléguer | Interdit explicite ; il n'écrit qu'un seul fichier (le compte rendu) |
| Perte de contexte | Le sous-agent ignore une décision prise avec vous | Consigne de délégation autonome, décisions recopiées |
| Boucle sans fin | Rédacteur et Contrôleur se renvoient la balle | Deux boucles maximum, puis escalade |
| Dérive d'outils | Un agent appelle un agent non prévu | Liste fermée `agents:` dans l'en-tête |
| Coût | Chaque sous-agent consomme des requêtes | Un sous-agent par étape, pas de délégation inutile |

L'orchestration n'ajoute pas d'intelligence : elle ajoute de la **discipline**. Elle n'est utile que si le plan, les agents et les skills sont déjà bons.

---

## 2. L'architecture cible
```
                        Vous (humain)
                 valider / corriger / arrêter
                            ▲   │
          points de validation   │ décisions
                            │   ▼
                ┌───────────────────────────┐
                │   orchestrateur-us         │  lit PLAN.md
                │   (Planificateur-Contrôleur)│  écrit le compte rendu HTML
                └───────────────────────────┘
                   │           │           │
         délègue   ▼           ▼           ▼
          reviewer-backlog  redacteur-backlog  controleur-backlog
          skill revue-agilite skill formater-us skill verifier-regles-metier
                   │           │           │
                   ▼           ▼           ▼
             revue.md     sortie/lot<N>/   tableau de contrôle
                          synthese-actions.md
                            │
                            ▼
          skill compte-rendu-html → resultats/compte-rendu-lot<N>.html
```

### Le déroulé et ses points de validation
| Étape | Qui agit | Skill | Livrable | Arrêt humain |
|---|---|---|---|---|
| 0. Préparer | Orchestrateur | — | Plan d'exécution dans le chat | **Validation 0** : lancer ? |
| 1. Diagnostiquer | `reviewer-backlog` | `revue-agilite` | `sprintdesk/resultats/revue.md` | **Validation 1** : diagnostic juste ? ND-xx laissées ouvertes ? |
| 2. Réécrire | `redacteur-backlog` | `formater-us` | `sprintdesk/backlog/sortie/lot<N>/`, `synthese-actions.md` | — (enchaîné avec le contrôle, en lecture seule) |
| 3. Contrôler | `controleur-backlog` | `verifier-regles-metier` | Tableau OK / KO | **Validation 2** : accepter, corriger les KO, ou arrêter |
| 4. Corriger (optionnel) | Rédacteur puis Contrôleur | — | US corrigées | Retour à la validation 2 (2 boucles max) |
| 5. Rendre compte | Orchestrateur | `compte-rendu-html` | `sprintdesk/resultats/compte-rendu-lot<N>.html` | Relecture finale |

---

## 3. Pas à pas

### Étape 1 — Vérifier les prérequis
Dans l'explorateur, vérifier la présence de :
- `PLAN.md` à la racine ;
- `.github/agents/reviewer-backlog.agent.md`, `redacteur-backlog.agent.md`, `controleur-backlog.agent.md` ;
- `.github/skills/revue-agilite/`, `formater-us/`, `verifier-regles-metier/` ;
- `.github/skills/compte-rendu-html/gabarit-dashboard.html` (fourni).

Ouvrir `gabarit-dashboard.html` dans un navigateur (clic droit > *Reveal in File Explorer*, puis double-clic) : vous voyez un tableau de bord rempli de **données fictives**. C'est ce que l'orchestrateur produira pour votre lot.

### Étape 2 — Remplir la fiche d'identité de l'orchestrateur
| Question | Orchestrateur |
|---|---|
| Mission en une phrase | Dérouler `PLAN.md` en déléguant chaque étape au bon agent, puis rendre compte |
| Entrées | `PLAN.md`, contexte, US du lot |
| Sorties | Points de validation dans le chat, compte rendu HTML |
| Skill utilisée | `compte-rendu-html` |
| Outils | `agent` (appeler un sous-agent), `read`, `search`, `edit` (un seul fichier) |
| Ne décide pas | Les ND-xx, l'acceptation d'un livrable, la publication |
| Arrêt / escalade | Prérequis manquant, contradiction, décision métier, 2 boucles sans succès |

### Étape 3 — Créer la skill `compte-rendu-html`
Créer `.github/skills/compte-rendu-html/SKILL.md` (le dossier existe déjà, avec le gabarit).

```markdown
---
name: compte-rendu-html
description: "Produit le compte rendu HTML (tableau de bord) du traitement d'un lot SprintDesk : ce qui a été fait, ce qui n'allait pas, US nettoyées, contrôles, questions ouvertes, validations humaines. Utiliser en fin d'orchestration d'un lot."
---
# Skill compte-rendu-html

## Quand l'utiliser
En fin d'orchestration, ou pour faire le bilan d'un lot déjà traité.

## Sources (lire, ne rien inventer)
- sprintdesk/resultats/revue.md : défauts (ce qui n'allait pas).
- sprintdesk/resultats/synthese-actions.md : statut de chaque US.
- sprintdesk/backlog/sortie/lot<N>/*.md : US nettoyées (besoin, critères, règles, questions).
- Tableau du Contrôleur : contrôles.
- Décisions prises aux points de validation : journal des validations.

## Procédure
1. Copier `gabarit-dashboard.html` (même dossier que cette skill) vers sprintdesk/resultats/compte-rendu-lot<N>.html.
2. Remplacer uniquement le JSON situé entre les marqueurs DONNEES:DEBUT et DONNEES:FIN. Ne pas toucher au style ni au script.
3. Garder exactement les clés du JSON du gabarit. Mettre "exemple": false.
4. Valeurs autorisées. Statut d'une US d'entrée : modifiée, découpée, inchangée, bloquée, créée. Statut d'une étape : ok, ko, attente, bloque. Gravité : bloquant, recommandation. Contrôle : OK, KO. Décision : Validé, Corrigé, Rejeté.
5. Une US inchangée a "defauts" vide et un seul résultat identique à l'entrée. Une US bloquée a "resultats" vide.
6. Chaque ND-xx encore ouverte apparaît dans "questions", avec qui tranche (référent produit sauf mention contraire dans PLAN.md).
7. Les chemins sont écrits depuis la racine du dépôt (ex. sprintdesk/backlog/sortie/lot1/US-101.md).

## Règles
- Chaque valeur vient d'un fichier source ou d'une décision humaine notée. Rien n'est inventé ni embelli.
- Texte brut uniquement : aucune balise HTML dans les valeurs.
- Ne pas écrire de compteurs : le gabarit les calcule.
- "controlesExecutes" ne liste que les contrôles réellement faits.

## Vérification avant de rendre la main
- Le JSON est valide (guillemets doubles, aucune virgule finale).
- Le nombre d'US dans "us" est égal au nombre d'US d'entrée du lot.
- Chaque US a un chemin "source".
```

Pourquoi un gabarit avec un bloc de données ? L'agent n'écrit **que des données**, jamais de mise en page. Le rendu est identique d'un lot à l'autre, et une erreur de l'agent ne peut pas casser le style ni injecter de code : le script affiche toutes les valeurs comme du texte.

### Étape 4 — Créer l'agent `orchestrateur-us`
Palette de commandes > `Chat: New Custom Agent` > `.github/agents` > nom `orchestrateur-us`. Remplacer le contenu par :

````markdown
---
description: "Orchestre le traitement d'un lot de user stories SprintDesk : planifie, délègue au Reviewer, au Rédacteur et au Contrôleur, s'arrête à chaque validation humaine, puis produit un compte rendu HTML. Utiliser pour dérouler PLAN.md de bout en bout."
tools: ['agent', 'read', 'search', 'edit']
agents: ['reviewer-backlog', 'redacteur-backlog', 'controleur-backlog']
---
# Orchestrateur US (Planificateur-Contrôleur)

## Rôle
Chef d'orchestre du traitement d'un lot : tu planifies, tu délègues, tu contrôles, tu rends compte.
Tu ne fais jamais toi-même le travail d'un autre agent : tu ne diagnostiques pas, tu ne réécris pas, tu ne corriges aucune US.

## Entrées
- PLAN.md : le contrat. Il prime sur toute improvisation.
- sprintdesk/contexte/produit.md et sprintdesk/contexte/regles-metier.md.
- Les US du lot dans sprintdesk/backlog/entree/lot<N>/.

## Équipe
| Sous-agent | Skill | Livrable |
|---|---|---|
| reviewer-backlog | revue-agilite | sprintdesk/resultats/revue.md |
| redacteur-backlog | formater-us | sprintdesk/backlog/sortie/lot<N>/ et sprintdesk/resultats/synthese-actions.md |
| controleur-backlog | verifier-regles-metier | Tableau de contrôle dans sa réponse |
| toi | compte-rendu-html | sprintdesk/resultats/compte-rendu-lot<N>.html |

## Déroulé (une étape à la fois)
0. Préparer : vérifier PLAN.md, les trois agents et les US du lot. Présenter le plan d'exécution (étape, agent, skill, livrable, arrêt). Puis POINT DE VALIDATION 0.
1. Diagnostiquer : déléguer à reviewer-backlog. Vérifier que revue.md existe et couvre toutes les US. Résumer les constats et lister les ND-xx rencontrées. Puis POINT DE VALIDATION 1.
2. Réécrire : déléguer à redacteur-backlog en recopiant les décisions validées au point 1. Vérifier que chaque US d'entrée a au moins un fichier de sortie ou le statut « bloquée ».
3. Contrôler : déléguer à controleur-backlog (lecture seule). Récupérer son tableau. Puis POINT DE VALIDATION 2.
4. Corriger, seulement si l'humain le demande : renvoyer au Rédacteur uniquement les lignes KO, puis recontrôler. Deux boucles maximum, ensuite escalader à l'humain.
5. Rendre compte : appliquer la skill compte-rendu-html. Donner le chemin du fichier.

## Points de validation humaine
À chaque point, arrête-toi. Termine ta réponse par ce bloc, puis attends :
```
POINT DE VALIDATION n — <nom>
Fait : ...
À vérifier par vous : ...
Décisions à prendre (ND-xx) : ...
Répondez : VALIDER | CORRIGER : <précision> | ARRÊTER
```
- Sans « VALIDER » explicite, ne passe pas à l'étape suivante.
- « CORRIGER » : refais seulement l'étape concernée, avec la précision donnée.
- « ARRÊTER » : produis le compte rendu de ce qui a été fait, étapes restantes au statut « attente ».
- Note chaque décision (étape, décision, par qui, commentaire) : elle alimente le journal du compte rendu.

## Règles de délégation
- Un sous-agent ne voit pas cette conversation. Chaque consigne est autonome : lot, fichiers à lire, fichier à écrire, décisions validées, interdits.
- Rappelle toujours au sous-agent : ne trancher aucune ND-xx, ne pas modifier sprintdesk/backlog/entree/, ne rien publier.
- Si un sous-agent échoue ou sort de son rôle, signale-le à l'humain. Ne compense jamais en faisant le travail toi-même.

## Interdits
- Ne trancher aucune décision non prise (ND-01 à ND-06).
- N'écrire toi-même qu'un seul fichier : le compte rendu HTML.
- Ne jamais lancer une étape d'écriture sans validation humaine de l'étape précédente.
- Ne rien publier vers un service externe.

## État d'avancement
Commence chaque réponse par une ligne d'état : Étape x/5 · Agent en cours · Dernier livrable · Prochain point de validation.

## Conditions d'arrêt
Arrête-toi et demande si : PLAN.md ou un agent manque, deux sources se contredisent, une décision métier est requise, deux boucles de correction n'ont pas suffi.

## Fin de réponse
Indiquer les contrôles réellement exécutés.
````

Lecture de l'en-tête :
| Champ | Rôle ici |
|---|---|
| `tools: ['agent', ...]` | L'outil `agent` permet d'appeler un sous-agent. Sans lui, pas d'orchestration. |
| `agents: [...]` | **Liste fermée** des sous-agents autorisés. L'orchestrateur ne peut appeler aucun autre agent. |
| `edit` | Nécessaire pour écrire le compte rendu. L'interdit limite son usage à ce seul fichier. |

### Étape 5 — Vérifier que tout est visible
1. Nouveau chat, sélecteur d'agent : `orchestrateur-us` doit apparaître.
2. Clic droit dans le chat > *Diagnostics* : l'agent et la skill `compte-rendu-html` sont chargés sans erreur.

### Étape 6 — Lancer l'orchestration
Nouveau chat, agent `orchestrateur-us` :
```
Orchestre le traitement du lot <N> en suivant PLAN.md.
Commence par l'étape 0 et arrête-toi à chaque point de validation.
```
Attendu : une ligne d'état, un plan d'exécution en tableau, puis le bloc **POINT DE VALIDATION 0**. Aucun fichier n'est encore écrit.

### Étape 7 — Tenir son rôle aux points de validation
| Point | Ce que vous vérifiez | Exemple de réponse |
|---|---|---|
| 0 — Lancement | Les étapes suivent `PLAN.md` ; les bons agents et skills sont annoncés | `VALIDER` |
| 1 — Diagnostic | Ouvrir `revue.md` : chaque constat cite une RM-xx ou ND-xx ; l'US correcte est en « Aucune action » | `CORRIGER : le constat sur US-<N>03 cite une règle absente, à retirer` |
| 2 — Résultat | Ouvrir les US de `sortie/lot<N>/` ; lire le tableau du Contrôleur ; aucune ND-xx tranchée | `CORRIGER : relancer le Rédacteur sur les lignes KO` ou `VALIDER` |

Pendant l'exécution, chaque sous-agent apparaît dans le chat comme un appel d'outil repliable : cliquez dessus pour lire la consigne reçue et le résultat rendu. C'est là que vous vérifiez la qualité de la délégation.

Ne répondez jamais `VALIDER` sans avoir ouvert le livrable. Le point de validation n'a de valeur que si vous l'exercez.

### Étape 8 — Ouvrir le compte rendu
Ouvrir `sprintdesk/resultats/compte-rendu-lot<N>.html` dans un navigateur.

| Section | Ce qu'elle montre |
|---|---|
| En-tête et indicateurs | Synthèse, nombre d'US modifiées, découpées, inchangées, bloquées, défauts, questions ouvertes, KO restants |
| Déroulé de l'orchestration | Chaque étape, son agent, sa skill, son statut ; les validations humaines sont hachurées |
| Ce qui n'allait pas | Les constats du diagnostic, avec règle et gravité |
| US nettoyées | Pour chaque US d'origine : avant (défauts) et après (besoin, critères, règles, questions), avec filtres par statut |
| Contrôles, questions ouvertes | Le tableau du Contrôleur et les ND-xx à trancher |
| Journal des validations | Qui a décidé quoi, à quelle étape |
| Contrôles réellement exécutés | Ce qui a été vérifié, et seulement cela |

Vérifier que le bandeau « EXEMPLE FICTIF » a disparu et que le nombre d'US correspond à votre lot.

### Étape 9 — Comparer avec le passage manuel
| Question | Manuel (Atelier 2) | Orchestré |
|---|---|---|
| Combien de prompts avez-vous écrits ? | | |
| Les mêmes défauts ont-ils été trouvés ? | | |
| L'US correcte est-elle restée inchangée ? | | |
| Une ND-xx a-t-elle été tranchée ? | | |
| Avez-vous relu autant qu'en manuel ? | | |

Si l'orchestré est moins bon, appliquer la méthode du bonus [07-evaluation.md](07-evaluation.md) : un défaut, une cause (orchestrateur, sous-agent, skill, consigne de délégation), une seule modification.

---

## Checklist
- [ ] L'orchestrateur ne liste que trois sous-agents autorisés (`agents:`).
- [ ] Il s'arrête aux trois points de validation et n'avance pas sans `VALIDER`.
- [ ] Il n'a écrit lui-même que le compte rendu HTML.
- [ ] Les consignes de délégation (visibles dans le chat) contiennent le lot, les fichiers, les décisions et les interdits.
- [ ] Aucune ND-xx n'est tranchée dans les US ni dans le compte rendu.
- [ ] Le compte rendu affiche toutes les US du lot, sans bandeau « EXEMPLE FICTIF ».
- [ ] Le journal des validations reflète vos décisions réelles.

## Pièges
- **Orchestrer trop tôt** : si le Reviewer ou le Rédacteur fonctionne mal seul, l'orchestration ne fera qu'enchaîner les erreurs plus vite.
- **Valider par réflexe** : `VALIDER` sans ouvrir le fichier transforme l'orchestrateur en boîte noire.
- **Consigne de délégation trop courte** : « fais la revue » sans lot ni fichiers ; le sous-agent improvise.
- **Orchestrateur qui « dépanne »** : il réécrit lui-même une US quand le Rédacteur échoue. C'est un défaut à corriger dans ses interdits.
- **Agent introuvable** : le nom dans `agents:` doit être identique au nom de l'agent (nom du fichier sans `.agent.md`, sensible à la casse).
- **Compte rendu enjolivé** : un compteur ou un statut qui ne correspond à aucun fichier. Vérifier contre `synthese-actions.md`.

## Aller plus loin
- **Hiérarchiser les validations** : remplacer le point de validation 2 par une validation US par US.
- **Ajouter un sous-agent** : `expert-agilite` entre le diagnostic et la réécriture, pour proposer les découpages.
- **Paralléliser** : sur un gros lot, déléguer le diagnostic par groupes d'US, puis fusionner les revues.
- **Préparer la publication** : un sous-agent qui prépare, sans l'envoyer, la prévisualisation des tickets ; publication uniquement par un humain.

> Les noms d'outils et les champs d'en-tête évoluent. En cas de doute, vérifier la documentation VS Code : [sous-agents](https://code.visualstudio.com/docs/agents/run/subagents) et [référence des fichiers d'agent](https://code.visualstudio.com/docs/agents/reference/custom-agent-file-reference).
