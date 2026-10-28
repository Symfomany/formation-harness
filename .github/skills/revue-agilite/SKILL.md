---
name: revue-agilite
description: "Revue agile d'une user story SprintDesk : valeur, périmètre, testabilité, règles inventées, dépendances, découpage. Utiliser pour diagnostiquer une US avant réécriture."
---
# Skill revue-agilite

## Procédure
Appliquer [checklist.md](checklist.md) à chaque US, puis produire des observations argumentées (pas seulement une note).
1. Lire l'US puis `regles-metier.md` ; ne rien déduire d'une règle non écrite.
2. Parcourir la checklist ligne par ligne, noter oui/non avec la preuve (citation de l'US).
3. Classer le défaut dominant : vague · trop volumineuse · contradictoire · sans critères · correcte.
4. Écrire une entrée au gabarit de l'agent Reviewer.

## Règles
- Distinguer **bloquant** (impossible à réaliser/tester sans décision) et **recommandation** (amélioration).
- Citer la règle ou le critère concerné (RM-xx, ND-xx) pour chaque constat.
- Une contradiction avec une RM validée est toujours bloquante ; la RM prime.
- Une règle présente dans l'US mais absente de `regles-metier.md` est signalée « non validée », pas « fausse ».
- Une décision manquante devient une question métier, jamais une hypothèse.
- Repérer les doublons entre US du lot (même besoin dans deux US) et le dire.
- Une US correcte reçoit « aucune action » : ne pas chercher à la rendre meilleure.

## Signaux de défaut
| Défaut | Indices |
|---|---|
| Vague | adjectif non mesurable (simple, bien, rapidement, utile), pas de critère |
| Trop volumineuse | plusieurs besoins reliés par « et », critères génériques (« fonctionne ») |
| Contradictoire | deux règles incompatibles, ou règle de l'US vs RM-xx |
| Sans critères | aucune section de critères d'acceptation |
| Correcte | 5 sections, critères Given/When/Then, RM citées, questions explicites |

## Exemple
- US-403 : « 5 jours calendaires » et « 3 jours ouvrés » → Bloquant, contradictoire, ND-01 ; question : seuil et mode de décompte ?
- US-105 : aucune action.
