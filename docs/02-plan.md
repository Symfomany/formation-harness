# Prompter pour obtenir un plan clair

## À quoi ça sert
Avant de créer le moindre agent, on demande à Copilot, en **mode Plan**, de préparer le traitement du backlog. Le résultat, `PLAN.md`, devient le **contrat** du groupe : ce que les agents feront, ce qu'ils ne décideront pas, et comment on jugera le résultat.

Un plan vague produit des agents vagues. C'est donc l'étape où le groupe gagne le plus.

## Anatomie d'un bon prompt
| Bloc | Question | Exemple SprintDesk |
|---|---|---|
| Contexte | Sur quoi travaille-t-on ? | Lot 1, projet SprintDesk |
| Sources | Quoi lire ? | `produit.md`, `regles-metier.md`, les 5 US du lot |
| Interdits | Que ne pas faire ? | Ne pas réécrire, ne pas toucher au code, ne pas publier |
| Tâche | Que produire ? | Un plan de traitement du backlog |
| Exigences | Avec quelles garanties ? | Questions avant de finaliser, critères vérifiables |
| Format | Sous quelle forme ? | Distinguer faits, propositions, décisions à prendre |

## Le prompt de départ
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

## Techniques pour l'améliorer
- **Itérer** : critiquer la première version (« ce critère n'est pas vérifiable », « cette étape décide à la place du métier ») plutôt que tout relancer.
- **Donner un exemple (few-shot)** : « voici US-105, une US correcte : le format cible ressemble à ça ».
- **Décomposer** : diagnostic → décisions → réécriture → contrôle. Un plan qui mélange les quatre est un mauvais plan.
- **Laisser Copilot poser des questions** : répondre aux questions du plan est déjà le travail de cadrage.

## Structure de `PLAN.md`
1. Objectif et périmètre
2. Sources
3. Résultats attendus
4. Règles métier validées
5. Questions ouvertes
6. Format cible d'une US
7. Étapes
8. Rôles des agents
9. Skills
10. Contrôles et validations humaines
11. Critères de réussite
12. Limites et conditions d'arrêt

## Exemple de `PLAN.md` (illustratif)
> ⚠️ Exemple volontairement générique : il montre la **forme** attendue, pas le contenu de votre lot. Votre plan doit venir de **vos** US et de **vos** échanges avec Copilot.

```markdown
# PLAN — SprintDesk, lot <N>

## 1. Objectif et périmètre
Rendre les 5 US du lot exploitables (claires, testables, de taille adaptée) sans inventer de règle.
Hors périmètre : code de l'application, publication externe.

## 2. Sources
produit.md · regles-metier.md · sprintdesk/backlog/entree/lot<N>/

## 3. Résultats attendus
- 5 US traitées dans backlog/sortie/ · une revue (revue.md) · une synthèse.

## 4. Règles métier validées
RM-01 à RM-08 (rappel des seules règles utilisées par le lot).

## 5. Questions ouvertes
| ID | Question | Qui tranche |
|---|---|---|
| ND-xx | <décision non prise rencontrée dans le lot> | Référent produit |

## 6. Format cible d'une US
Titre · En tant que / Je veux / Afin de · Critères d'acceptation (Given/When/Then) · Règles liées · Questions ouvertes.

## 7. Étapes
1. Diagnostic de chaque US (Reviewer) → 2. Validation humaine des constats → 3. Réécriture (Rédacteur) → 4. Contrôle contre RM-xx → 5. Synthèse.

## 8. Rôles des agents
| Agent | Fait | Ne décide pas |
|---|---|---|
| Reviewer | Diagnostique, cite la preuve | Ne réécrit pas |
| Rédacteur | Réécrit selon le format cible | Ne tranche aucun ND-xx |

## 9. Skills
`revue-agilite` (méthode de diagnostic) · `formater-us` (format cible).

## 10. Contrôles et validations humaines
- Validation du diagnostic avant réécriture.
- Validation de chaque US réécrite avant dépôt dans sortie/.
- Aucune publication sans accord humain.

## 11. Critères de réussite (oui/non)
- [ ] Chaque US conserve son identifiant et cite sa source.
- [ ] Aucune règle inventée : tout point non décidé est une question ouverte.
- [ ] Chaque US a au moins 2 critères d'acceptation vérifiables.
- [ ] Une US déjà correcte est restée inchangée.

## 12. Limites et conditions d'arrêt
L'agent s'arrête et demande si une règle manque, si deux sources se contredisent, ou si une décision métier est requise.
```

## L'humain dans la boucle : valider avant d'exécuter
Le mode Plan ne modifie aucun fichier : il **propose**. `PLAN.md` n'est qu'un brouillon tant qu'un humain n'a pas décidé de le valider. Passer à l'exécution (mode Agent) est un choix explicite du groupe, jamais une suite automatique du plan.

### Pourquoi c'est important
- Une décision non prise (`ND-xx`) ne doit jamais être tranchée silencieusement par l'IA : si le plan contient une hypothèse déguisée en fait, c'est à l'humain de la repérer et de la refuser avant exécution.
- Une erreur dans le plan se propage à toutes les US traitées ensuite. La corriger avant l'exécution prend quelques minutes ; la corriger après, c'est tout reprendre.
- Valider rend le travail traçable : on sait qui a accepté le plan, et sur quelle base (quelles règles, quelles questions tranchées).

### Trois choix possibles face à un plan proposé
| Choix | Quand l'utiliser | Ce que fait le groupe |
|---|---|---|
| **Valider tel quel** | Le plan couvre les 7 points demandés, aucune règle n'est inventée | Sauvegarder `PLAN.md`, puis passer en mode Agent |
| **Corriger** | Un critère est flou, une question métier manque, une étape tranche à la place du métier | Répondre dans le chat Plan (« ce critère n'est pas vérifiable », « qui tranche ND-03 ? ») et régénérer |
| **Rejeter et recadrer** | Le plan part hors périmètre ou invente des règles métier | Reformuler le prompt de départ plutôt que corriger un plan déjà hors sujet |

Ce choix appartient au groupe, pas à Copilot : lui seul propose, l'humain décide.

### La validation ne s'arrête pas au plan
Chaque **handoff** entre agents (Reviewer → Rédacteur, Rédacteur → Contrôle) est un nouveau point où l'humain peut valider, corriger ou arrêter l'exécution. Passer en mode Agent ne veut pas dire laisser tourner sans regarder : les points de validation listés en section 10 du plan (ex. « validation de chaque US réécrite avant dépôt dans sortie/ ») s'appliquent **pendant** l'exécution, pas seulement avant qu'elle démarre.

### Dans SprintDesk, concrètement
- Avant toute écriture dans `sprintdesk/backlog/sortie/` : un humain relit la user story reformulée.
- Avant toute réponse à une question `ND-xx` : la décision revient au référent produit, jamais à l'agent.
- Avant toute publication externe (ticketing, messagerie) : accord humain explicite, sans exception.

## Checklist : mon plan est-il bon ?
- [ ] Je sais dire ce que chaque agent **fera**, et ce qu'il **ne décidera pas**.
- [ ] Chaque décision non prise (`ND-xx`) apparaît en question ouverte, pas en hypothèse cachée.
- [ ] Les critères de réussite sont **vérifiables** (on peut répondre oui/non).
- [ ] Les points de validation humaine sont placés avant toute décision métier et toute publication.
- [ ] Une condition d'arrêt est définie (quand l'agent doit s'arrêter et demander).
- [ ] Le groupe sait, face à un plan proposé, lequel des trois choix il applique (valider / corriger / rejeter).

## Pièges
- Plan trop long et trop détaillé : personne ne le relit. Viser ce que le groupe peut valider en 10 minutes.
- Critères flous (« US de qualité ») : impossibles à évaluer dans le bonus.
- Plan qui répond lui-même aux questions métier : à faire trancher par le référent produit.
