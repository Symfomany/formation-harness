# Règles métier SprintDesk

## Règles validées
| ID | Règle |
|---|---|
| RM-01 | Une demande comporte : titre (obligatoire), description (obligatoire), demandeur (automatique), service (obligatoire), date de création (automatique). |
| RM-02 | Statuts possibles : Nouvelle, Qualifiée, En cours, En attente, Terminée, Refusée. |
| RM-03 | Impact : Faible, Moyen, Fort. Urgence : Normale, Haute. |
| RM-04 | Priorité = Impact × Urgence : Fort+Haute = P1 ; Fort+Normale = P2 ; Moyen+Haute = P2 ; Moyen+Normale = P3 ; Faible (toute urgence) = P4. |
| RM-05 | Seul un Qualificateur peut fixer l'impact et l'urgence. Le demandeur ne fixe jamais la priorité. |
| RM-06 | Tout changement de statut est historisé : auteur, date/heure, ancien statut, nouveau statut. |
| RM-07 | Une demande n'a qu'un seul Traitant affecté à la fois. |
| RM-08 | Une demande est créée au statut « Nouvelle ». |

## Décisions non prises (ne pas inventer)
| ID | Sujet |
|---|---|
| ND-01 | Seuil d'ancienneté déclenchant une alerte (jours calendaires ou ouvrés ?) |
| ND-02 | Pièces jointes : autorisées ? formats ? taille ? |
| ND-03 | Notifications (e-mail, in-app) : lesquelles, à qui ? |
| ND-04 | Réouverture d'une demande Terminée ou Refusée |
| ND-05 | Tri par défaut de la liste des demandes |
| ND-06 | Motif obligatoire lors d'un refus ? |
