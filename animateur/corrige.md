# Corrigé animateur — NE PAS DISTRIBUER

## Défauts volontaires par US
| US | Défaut | Attendu des agents |
|---|---|---|
| 101 | Trop vague | Question métier : que veut dire « simple » ? Proposer des CA à partir de RM-01, sans inventer d'ergonomie |
| 102 | Trop volumineuse | Découper (dépôt, brouillons, modèles, import, notifications). PJ = ND-02, notifications = ND-03 : questions ouvertes |
| 103 | Contradiction | Titre obligatoire (RM-01) vs envoi sans titre. Appliquer RM-01 ; question si le métier veut un assouplissement |
| 104 | Sans CA | Rédiger les CA. Support (e-mail/in-app) = ND-03, ne pas trancher |
| 105 | Correcte | Recopier à l'identique, « aucune action » |
| 201 | Trop vague | Reformuler autour de RM-03/RM-04/RM-05 ; « bien » non défini |
| 202 | Trop volumineuse | Découper ; matrice paramétrable contredit RM-04 (figée) ; SLA, escalade, IA : décisions non prises |
| 203 | Contradiction | Demandeur fixe la priorité vs RM-05 ; non modifiable vs ajustable manuellement |
| 204 | Sans CA | CA de tri ; tri par défaut = ND-05 |
| 205 | Correcte | Inchangée |
| 301 | Trop vague | « Rapidement » non mesurable ; ne pas inventer de SLA |
| 302 | Trop volumineuse | Découper ; réouverture = ND-04, notifications = ND-03 |
| 303 | Contradiction | Plusieurs traitants vs RM-07 |
| 304 | Sans CA | CA liés à RM-06 (auteur, date, anciens/nouveaux statuts) ; ordre d'affichage non défini |
| 305 | Correcte | Inchangée |
| 401 | Trop vague | Quels indicateurs ? Se limiter aux demandes de l'énoncé du lot |
| 402 | Trop volumineuse | Découper ; alertes = ND-01, abonnement e-mail = ND-03 |
| 403 | Contradiction | 5 jours calendaires vs 3 jours ouvrés (ND-01), alerte immédiate P1 non validée |
| 404 | Sans CA | CA filtres statut (RM-02) et priorité (RM-04) ; combinaison ET/OU non décidée |
| 405 | Correcte | Inchangée |

## Pièges à observer
- Un agent qui « complète » ND-01 à 3 jours ou ND-02 à 5 Mo : décision inventée.
- Une US correcte réécrite : faute de préservation.
- Une US découpée qui perd la trace de l'identifiant d'origine.
- Un hook qui passe au vert alors que le contenu est faux : il contrôle la structure seulement.

## Points d'attention logistiques
- Le hook est en préversion : tester `.github/hooks/verifier-backlog.json` sur le poste cible avant la formation ; à défaut, lancer `python scripts/verifier_backlog.py` à la main.
- Le script est testé : sur `backlog/entree` il signale 72 anomalies attendues (US d'entrée non au format cible).
- Distribuer à chaque groupe uniquement son lot (`backlog/entree/lotN`) ; masquer ce dossier.
