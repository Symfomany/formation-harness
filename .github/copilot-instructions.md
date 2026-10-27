# Instructions communes — SprintDesk

## Contexte
SprintDesk centralise, qualifie, priorise et suit les demandes métier de HabiOuest (bailleur social, 12 agences).
Nous transformons un backlog d'user stories imparfaites en backlog exploitable, **sans inventer de décision métier**.
Rôles produit : Demandeur, Qualificateur, Traitant, Manager.

## Stratégie de travail : Planifier → Acter → Analyser
| Phase | Ce qu'on fait | Livrable | Qui décide |
|---|---|---|---|
| 1. Planifier | Clarifier besoin, règles, questions ouvertes (mode Plan) ; rien n'est réécrit | `PLAN.md` | Humain |
| 2. Acter | Reviewer → décisions du groupe → Rédacteur → contrôle de structure | `revue.md`, `backlog/sortie/`, `synthese-actions.md` | Humain entre chaque étape |
| 3. Analyser | Comparer aux critères du plan, trouver la cause, ajuster **un seul** élément, rejouer | `ANALYSE.md` | Humain |
- `PLAN.md` prime sur toute improvisation. Si une demande le contredit, le signaler avant d'agir.
- Une phase ne commence qu'après validation humaine de la précédente.

## Documentation (sources de vérité)
| Fichier | Quand le consulter |
|---|---|
| `sprintdesk/contexte/produit.md` | Comprendre le produit, les acteurs, le hors-périmètre |
| `sprintdesk/contexte/regles-metier.md` | Avant toute règle : RM-xx validées, ND-xx non décidées |
| `sprintdesk/backlog/entree/lot<N>/` | US à traiter (lecture seule, jamais modifiées) |
| `PLAN.md` | Plan validé du groupe |
| `sprintdesk/resultats/` | `revue.md`, `synthese-actions.md`, `ANALYSE.md` |

## Règles
- N'invente aucune règle ni décision métier : une décision ND-xx reste une question ouverte, sans valeur par défaut (pas de seuil, taille, canal ou tri supposé).
- Une règle absente de `regles-metier.md` n'est jamais écrite comme un fait ; elle est une proposition ou une question.
- Conserve l'identifiant US-xxx ; une US découpée prend des identifiants dérivés (US-xxx-a, -b…) et cite l'US d'origine.
- Distingue explicitement : **Faits** (sources) / **Propositions** (à valider) / **Questions ouvertes**.
- Si une US est correcte, laisse-la inchangée et réponds « aucune action ».
- En cas de contradiction avec une règle validée (RM-xx), applique la règle validée et signale l'écart.
- Ne modifie jamais `backlog/entree/` ni le code de l'application.
- Ne publie rien vers un service externe sans validation humaine.
- Indique les contrôles réellement exécutés, et ceux qui ne l'ont pas été.
- Arrête-toi et pose la question si une règle manque, si deux sources se contredisent ou si une décision métier est requise.

## Exemple de réponse attendue
> **US-403** — Faits : deux seuils contradictoires (5 jours calendaires, 3 jours ouvrés). Aucune règle RM ne tranche.
> Proposition : conserver une seule règle d'alerte une fois ND-01 décidée.
> Questions ouvertes : ND-01 (seuil et mode de décompte) ; alerte immédiate P1 non validée.
> Contrôles : relu contre RM-01 à RM-08 ; aucun test exécuté.

## Où trouver les détails
- Format d'une US : skill `formater-us`.
- Méthode de revue : skill `revue-agilite`.
- Méthode d'analyse des écarts : skill `analyser-ecarts`.
- Rôles : agents `reviewer-backlog`, `redacteur-backlog`.
