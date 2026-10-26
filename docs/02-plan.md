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

## Checklist : mon plan est-il bon ?
- [ ] Je sais dire ce que chaque agent **fera**, et ce qu'il **ne décidera pas**.
- [ ] Chaque décision non prise (`ND-xx`) apparaît en question ouverte, pas en hypothèse cachée.
- [ ] Les critères de réussite sont **vérifiables** (on peut répondre oui/non).
- [ ] Les points de validation humaine sont placés avant toute décision métier et toute publication.
- [ ] Une condition d'arrêt est définie (quand l'agent doit s'arrêter et demander).

## Pièges
- Plan trop long et trop détaillé : personne ne le relit. Viser ce que le groupe peut valider en 10 minutes.
- Critères flous (« US de qualité ») : impossibles à évaluer dans le bonus.
- Plan qui répond lui-même aux questions métier : à faire trancher par le référent produit.
