# Bonus — Évaluer, analyser les erreurs et ajuster

## À quoi ça sert
Un harness n'est jamais bon du premier coup. Ce bonus apprend à **mesurer** ce que les agents ont produit, **comprendre pourquoi** ça a échoué, et **corriger la bonne chose** : le plan, les instructions, l'agent, la skill ou l'environnement.

## 1. Définir les critères de succès
On les fixe **avant** de rejouer, en s'appuyant sur le plan. Un critère est utile s'il se tranche par oui ou non.

| Critère | Signal | Type |
|---|---|---|
| Aucune décision métier inventée | Aucune valeur pour un `ND-xx` dans les US de sortie | Qualitatif (relecture) |
| Une US correcte reste inchangée | Fichier identique à l'entrée | Quantitatif (oui/non) |
| Critères d'acceptation vérifiables | Format Given / When / Then, un comportement par critère | Qualitatif |
| Questions ouvertes visibles | Section « Questions ouvertes » renseignée quand une décision manque | Qualitatif |
| Traçabilité conservée | Identifiant d'origine présent, lien vers l'US source en cas de découpage | Quantitatif |
| Complétude du lot | 5 US sur 5 traitées (créée / modifiée / inchangée / bloquée) | Quantitatif |

## 2. Signaux à observer
**Quantitatifs** : nombre d'US traitées, nombre de sections manquantes, nombre de règles inventées, nombre de questions ouvertes, nombre de relances nécessaires.

**Qualitatifs** : clarté des critères, pertinence des questions, cohérence avec `regles-metier.md`, ton et lisibilité des US.

## 3. Où chercher les preuves
| Source | Ce qu'on y lit |
|---|---|
| Fichiers de sortie | Le résultat final, US par US |
| `revue.md`, `synthese-actions.md` | Le raisonnement et le bilan de l'agent |
| `PLAN.md` | Ce qui était attendu |
| Panneau Chat de VS Code | Les **références** (fichiers réellement lus), les **outils appelés**, les étapes de raisonnement affichées |
| Instructions, agents, skills | Ce qui était demandé à l'agent |

Question de base : *qu'a-t-on donné à l'agent, qu'a-t-il fait, qu'attendait-on ?*

## 4. Diagnostiquer : quelle est la cause ?
Un même mauvais résultat peut avoir quatre origines très différentes.

| Cause | Symptôme typique | Comment le vérifier | Correction |
|---|---|---|---|
| **Erreur de raisonnement** | L'agent avait toutes les informations mais conclut mal (ex. juge correcte une US contradictoire) | Le bon fichier est dans les références, la règle est claire, la conclusion est fausse | Préciser la procédure d'une skill, ajouter un exemple et un contre-exemple |
| **Mauvais outil** | L'agent ne peut pas faire l'action, ou modifie ce qu'il ne devait pas | Regarder les outils appelés et la liste `tools` de l'agent | Retirer ou ajouter l'outil, ajuster la consigne d'usage |
| **Mauvais contexte** | Règle inventée, `ND-xx` « complété », fichier ignoré | `regles-metier.md` absent des références, instruction ambiguë ou contradictoire | Citer les sources dans les instructions, rendre explicite l'interdit |
| **Environnement** | Fichier écrit au mauvais endroit, agent ou skill non pris en compte | Nom de dossier ou de fichier incorrect, mauvais emplacement, mauvais lot ouvert | Corriger l'emplacement, le nom, le périmètre ouvert dans VS Code |

Exemple : un agent fixe le seuil d'alerte à 3 jours.
- La source `regles-metier.md` était-elle lue ? Non → **contexte**.
- Lue, mais l'instruction ne dit pas « ne jamais compléter une ND » → **instruction** (contexte).
- Lue, interdit clair, et il invente quand même → **raisonnement** : ajouter un contre-exemple dans la skill.

## 5. Ajuster, une chose à la fois
| Levier | Quand l'ajuster |
|---|---|
| **Instructions** | Règle transverse manquante ou ambiguë |
| **Agent** (mission, interdits) | Mauvais rôle, dérive de périmètre |
| **Outils** | Action impossible ou non souhaitée |
| **Contraintes** (interdits, conditions d'arrêt) | L'agent va trop loin ou s'arrête trop tard |
| **Skill** | La procédure ou l'exemple est insuffisant |
| **Mémoire** (fichiers de contexte persistants : `PLAN.md`, `synthese-actions.md`) | L'information doit survivre d'une session à l'autre |

### La boucle
```
1 défaut → 1 cause → 1 seule modification → rejouer → vérifier l'absence de régression
```
Pourquoi une seule modification ? Avec deux, on ne sait plus laquelle a corrigé… ou cassé.
Rejouer aussi une US qui marchait : l'US correcte doit toujours rester inchangée.

## 6. Grille d'analyse par US
| Critère | Avant | Après |
|---|---|---|
| Besoin et valeur compréhensibles | Oui / Partiel / Non | Oui / Partiel / Non |
| Critères d'acceptation vérifiables | | |
| Règles cohérentes avec les sources | | |
| Questions ouvertes visibles | | |
| Traçabilité conservée | | |

Contrôle séparé : **une décision métier a-t-elle été inventée ?** (oui/non, et laquelle)

## 7. Livrable : `sprintdesk/resultats/ANALYSE.md`
```markdown
# Analyse — lot <N>

## Critères de succès
...

## Constats
| US | Défaut observé | Preuve (fichier / étape) | Cause (raisonnement, outil, contexte, environnement) |
|---|---|---|---|

## Modification testée
- Levier : (instructions / agent / skill / outil)
- Modification :
- Résultat après rejeu :
- Régression : oui / non

## Reste à faire
```

## Pièges
- Juger « à l'impression » : écrire les critères avant de regarder les résultats.
- Corriger la skill alors que le problème vient d'un fichier non lu.
- Confondre un agent qui se trompe et un agent à qui l'on a demandé la mauvaise chose.
