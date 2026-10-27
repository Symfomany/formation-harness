# Analyse — lots 1 à 4

## Critères de succès (fixés avant l'analyse, tirés de PLAN.md §11)
| # | Critère | Signal | Type |
|---|---|---|---|
| C1 | 20 US traitées | Chaque US d'origine a une action dans `synthese-actions.md` | Quantitatif |
| C2 | Identifiant tracé | Titre `US-XXX` ; « US d'origine » si découpage | Quantitatif |
| C3 | Aucune valeur pour un ND-xx | Aucun seuil/taille/canal/tri dans les sorties | Qualitatif |
| C4 | ND-xx visibles | ND concernée présente en « Questions ouvertes » | Qualitatif |
| C5 | ≥ 1 critère vérifiable | Au moins un « Étant donné… » par fichier | Quantitatif |
| C6 | US correctes inchangées | `cmp` entrée/sortie | Quantitatif |
| C7 | Contradiction RM résolue par la RM | 103, 202-b, 203, 303 | Qualitatif |
| C8 | Aucune règle implicite écrite comme un fait | Relecture des « Règles métier » | Qualitatif |

## Résultats
| Critère | Résultat | Preuve |
|---|---|---|
| C1 | Oui (20/20) | `synthese-actions.md` |
| C2 | Oui (37/37) | contrôle scripté |
| C3 | Oui | seule occurrence chiffrée : US-403, citation des seuils contradictoires non retenus |
| C4 | Oui | ND-01 (202-d, 402-d, 403) · ND-02 (102-d) · ND-03 (102-e, 104, 202-d, 302-c/d, 402-f) · ND-04 (302-b) · ND-05 (204) · ND-06 (302-b) |
| C5 | Oui (37/37) | contrôle scripté |
| C6 | Oui (4/4) | `cmp` |
| C7 | Oui | 103, 203, 303 ; 202-b livrée bloquée |
| C8 | **Non au 1er passage** | voir constat 2 |

## Grille avant / après (extraits représentatifs)
| US | Besoin compréhensible | CA vérifiables | Règles cohérentes | Questions visibles | Traçabilité |
|---|---|---|---|---|---|
| 101 | Partiel → Oui | Non → Oui | Partiel → Oui | Non → Oui | Oui → Oui |
| 103 | Oui → Oui | Partiel → Oui | **Non → Oui** | Non → Oui | Oui → Oui |
| 104 | Oui → Oui | Non → Oui | Oui → Oui | Non → Oui | Oui → Oui |
| 202 | Partiel → Oui (6 US) | Non → Partiel (provisoires) | **Non → Oui** | Non → Oui | Oui → Oui |
| 204 | Oui → Oui | Non → Oui | Oui → Oui (après correction) | Non → Oui | Oui → Oui |
| 403 | Oui → Oui | Partiel → Partiel (bloquée ND-01) | **Non → Oui** | Non → Oui | Oui → Oui |
| 105/205/305/405 | Oui → Oui | Oui → Oui | Oui → Oui | Oui → Oui | Oui → Oui |

Contrôle séparé — décision métier inventée : **non** (aucune valeur retenue pour ND-01 à ND-06). Réserve : voir constat 2.

## Constats
| US | Défaut observé | Preuve | Cause |
|---|---|---|---|
| US-204 | « P1 étant la plus élevée » écrit comme règle métier alors que RM-04 ne fixe pas d'ordre entre priorités | Ligne « Règles métier » du 1er jet | **Raisonnement** : sources lues, mais déduction implicite promue au rang de règle |
| `revue.md` (US-302) | La revue annonçait 5 US après découpage ; 4 produites (affectation, statut, historique déjà couverts par 303/305/304) | Écart revue / sortie relevé par le contrôle de cohérence | **Raisonnement** : nombre annoncé avant le découpage détaillé |

## Modification testée
- **Levier :** skill `formater-us`.
- **Modification :** ajout de la règle 8 : « aucun ordre, hiérarchie ou équivalence implicite entre valeurs n'est écrit comme un fait ; sinon proposition en Questions ouvertes ».
- **Résultat après rejeu (US-204) :** la ligne est retirée de « Règles métier » ; la proposition apparaît en « Questions ouvertes ». Rejeu **manuel** (relecture et correction par l'auteur de ce dépôt) : il n'a pas été relancé dans Copilot.
- **Régression :** non constatée sur le contrôle scripté (37/37) ni sur les 4 US correctes (inchangées).

## Reste à faire
- Rejouer le Rédacteur dans Copilot avec la skill modifiée pour confirmer l'effet hors relecture manuelle.
- Constat 2 non traité par une modification (une seule modification par tour) : proposer au prochain cycle de lister les titres des sous-US dans la revue plutôt qu'un nombre.
- Faire valider par le référent produit les propositions et critères provisoires, puis lever les ND-xx.
