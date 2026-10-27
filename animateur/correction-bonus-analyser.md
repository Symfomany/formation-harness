# Correction — Bonus : Analyser (🔒 animateur)

## Ce que le bonus fait apprendre
Mesurer, comprendre l'origine d'un défaut, corriger **une seule** chose, rejouer, vérifier l'absence de régression. Livrable : [`ANALYSE.md`](../sprintdesk/resultats/ANALYSE.md).

## La boucle
```
1 défaut → 1 cause → 1 modification → rejeu → absence de régression
```

## Comment le corrigé la déroule
1. **Critères fixés avant** (C1…C8), reliés aux critères oui/non de `PLAN.md` §11. Mélange quantitatif (20/20, 37/37, `cmp`) et qualitatif (ND-xx visibles, règles implicites).
2. **Mesure** : contrôle de structure scripté + `cmp` des 4 US correctes + recherche de valeurs chiffrées.
3. **Grille avant/après** par US ; contrôle séparé « décision métier inventée ? ».
4. **Constats** avec preuve et cause.

### Deux constats réels de cette correction
| Défaut | Cause | Pourquoi cette cause |
|---|---|---|
| US-204 : « P1 est la plus élevée » écrit comme règle | **Raisonnement** | `regles-metier.md` était lu ; la déduction a été promue en fait |
| `revue.md` annonçait 5 US pour US-302, 4 produites | **Raisonnement** | Nombre annoncé avant le découpage détaillé |

Les deux sont des erreurs de raisonnement : ni outil, ni source manquante, ni mauvais emplacement. Le tableau de causes de `docs/07-evaluation.md` sert à l'écarter une à une.

### La modification testée
Levier **skill** : règle 8 de `formater-us` (pas d'ordre ou d'équivalence implicite écrit comme fait). Une seule modification, donc on sait ce qui a corrigé US-204. Le second constat est volontairement laissé au cycle suivant.

## Limite à dire aux participants
Le rejeu de cette correction est **manuel**. En atelier, il faut relancer le Rédacteur dans Copilot avec la skill modifiée, puis comparer. `ANALYSE.md` le dit explicitement : on ne déclare pas un résultat qu'on n'a pas observé.

## Grille de lecture pour l'animateur
- Critères écrits **avant** de regarder les sorties ?
- Chaque défaut est-il appuyé par une preuve (fichier / étape) ?
- La cause est-elle l'une des quatre (raisonnement, outil, contexte, environnement) ?
- Une seule modification ? Régression vérifiée sur l'US correcte ?

## Erreurs fréquentes
- Juger « à l'impression ».
- Corriger la skill alors qu'un fichier n'a pas été lu.
- Deux modifications à la fois.
- Oublier de rejouer l'US correcte.
