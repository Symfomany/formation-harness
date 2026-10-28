# PLAN — SprintDesk, lots 1 à 4

> Plan validé servant de contrat aux agents. Légende : **[Fait]** fourni par les sources · **[Proposition]** à valider · **[À décider]** décision humaine.

## 1. Objectif et périmètre
- **[Fait]** Rendre exploitables les 20 US du backlog initial (4 lots × 5) : claires, testables, de taille adaptée, tracées.
- **[Fait]** Aucune décision métier inventée (`regles-metier.md`, « Décisions non prises »).
- **Hors périmètre** : code de l'application, publication vers un outil externe (GitHub Issues…), modification de `backlog/entree/`.

## 2. Sources
| Source | Usage |
|---|---|
| `sprintdesk/contexte/produit.md` | Acteurs, périmètre, hors-périmètre |
| `sprintdesk/contexte/regles-metier.md` | RM-01 à RM-08, ND-01 à ND-06 |
| `sprintdesk/backlog/entree/lot1..lot4/` | 20 US d'origine, lecture seule |

## 3. Résultats attendus
- `sprintdesk/resultats/revue.md` : un constat par US.
- `sprintdesk/backlog/sortie/lot<N>/` : une US par fichier (plusieurs si découpage).
- `sprintdesk/resultats/synthese-actions.md` : créé / modifié / inchangé / bloqué.
- Bonus : `sprintdesk/resultats/ANALYSE.md`.

## 4. Règles métier validées utilisées
| Règle | Utilisée par |
|---|---|
| RM-01 titre, description, service obligatoires ; demandeur et date automatiques | 101, 102, 103, 105 |
| RM-02 six statuts | 304, 305, 401, 404, 405 |
| RM-03 impact / urgence | 201, 202, 205 |
| RM-04 priorité = impact × urgence (figée) | 201, 202, 203, 204, 205, 404 |
| RM-05 seul le Qualificateur fixe impact/urgence | 201, 202, 203, 205 |
| RM-06 historique des changements de statut | 302, 304, 305 |
| RM-07 un seul Traitant à la fois | 302, 303 |
| RM-08 création au statut « Nouvelle » | 101, 102, 104, 105 |

## 5. Questions ouvertes (aucune n'est tranchée par ce plan)
| ID | Question | Lots concernés | Qui tranche |
|---|---|---|---|
| ND-01 | Seuil d'alerte : jours calendaires ou ouvrés ? | 202, 402, 403 | Référent produit / métier |
| ND-02 | Pièces jointes : autorisées, formats, taille ? | 102 | idem |
| ND-03 | Notifications : lesquelles, à qui, par quel canal ? | 102, 104, 302, 402 | idem |
| ND-04 | Réouverture d'une demande Terminée/Refusée ? | 302, 305 | idem |
| ND-05 | Tri par défaut de la liste ? | 204 | idem |
| ND-06 | Motif obligatoire lors d'un refus ? | 302 (statut Refusée) | idem |
| Hors liste | SLA, escalade, IA, matrice paramétrable, indicateurs du tableau de bord, définitions de « simple », « bien », « rapidement », « utile » | 101, 201, 202, 301, 401, 402 | idem — à documenter si retenu |

## 6. Format cible d'une US
Modèle de la skill `formater-us` : `# US-XXX — Titre` · Besoin (En tant que / Je souhaite / Afin de) · Règles métier (RM-xx) · Critères d'acceptation (Étant donné / quand / alors, un comportement par critère) · Dépendances (dont « US d'origine ») · Questions ouvertes.
Exemples de référence : US-105, US-205, US-305, US-405 (US correctes).

## 7. Étapes
1. **Planifier** (ce document) — validation humaine.
2. **Reviewer** + `revue-agilite` → `revue.md` — validation du diagnostic.
3. **Décisions du groupe** : le référent produit tranche ce qui relève de lui ; tout le reste demeure ND-xx.
4. **Rédacteur** + `formater-us` → `backlog/sortie/lot<N>/` + `synthese-actions.md`.
5. **Contrôle de structure** (section 10) puis relecture humaine.
6. **Analyser** (bonus) → `ANALYSE.md`, une seule modification, rejeu.

## 8. Rôles des agents
| Agent | Fait | Ne décide pas |
|---|---|---|
| Reviewer | Diagnostique, cite preuve et règle, formule les questions | Ne réécrit pas ; ne tranche aucun ND-xx |
| Rédacteur | Réécrit au format cible, découpe, trace | Ne tranche aucun ND-xx ; ne touche pas une US correcte |
| Humain (référent produit) | Tranche les décisions, valide | — |

## 9. Skills
- `revue-agilite` (+ `checklist.md`) : méthode de diagnostic.
- `formater-us` (+ `modele-us.md`) : format cible.
- `analyser-ecarts` : méthode de la phase Analyser.

## 10. Contrôles et validations humaines
- Validation du plan avant tout agent.
- Validation du diagnostic (`revue.md`) avant réécriture.
- Toute décision ND-xx : humaine, sinon elle reste en question ouverte.
- Contrôle de structure sur chaque sortie : titre/identifiant · 5 sections · ≥ 1 critère · aucune règle hors `regles-metier.md` · chaque ND-xx en question ouverte · US correcte inchangée.
- Aucune publication externe sans accord humain explicite.

## 11. Critères de réussite (oui/non)
- [ ] Les 20 US sont traitées (créée / modifiée / inchangée / bloquée).
- [ ] Chaque fichier de sortie contient l'identifiant d'origine ; tout découpage cite l'US d'origine.
- [ ] Aucune valeur n'est donnée pour un ND-xx (seuil, taille, canal, tri, réouverture, motif).
- [ ] Chaque ND-xx rencontrée figure en question ouverte.
- [ ] Chaque US de sortie a ≥ 1 critère Given/When/Then vérifiable.
- [ ] US-105, 205, 305, 405 sont identiques à l'entrée (octet pour octet).
- [ ] Toute contradiction avec une RM est résolue par la RM et signalée.

## 12. Limites et conditions d'arrêt
Un agent s'arrête et demande si : une règle manque · deux sources se contredisent · une décision métier est requise · une publication serait nécessaire.
Limites connues : les critères ne sont pas exécutés (aucun test), les propositions restent à valider par le métier.
