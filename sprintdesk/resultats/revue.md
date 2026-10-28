# Revue du backlog — lots 1 à 4

Méthode : skill `revue-agilite` appliquée US par US (checklist de 7 points). Aucune US réécrite ici, aucune décision ND-xx tranchée.
Gravité : **Bloquant** = impossible à réaliser/tester sans décision · **Recommandation** = amélioration · **Aucune action**.

---
## Lot 1 — Dépôt des demandes

**US concernée :** US-101 — Formulaire simple
**Constat :** Trop vague. « simple et pratique » n'est pas mesurable ; aucun critère d'acceptation.
**Règle ou critère concerné :** RM-01 (champs de la demande), RM-08.
**Gravité :** Bloquant (non testable)
**Question métier :** Que signifie « simple » (nombre de champs, ordre, aides) ?
**Recommandation :** Ancrer les critères sur RM-01 ; ne pas inventer d'ergonomie.

**US concernée :** US-102 — Dépôt complet d'une demande
**Constat :** Trop volumineuse : pièces jointes, brouillons, modèles, import Excel, notifications. Critères génériques (« fonctionne »).
**Règle ou critère concerné :** ND-02 (pièces jointes), ND-03 (notifications) ; RM-02 (pas de statut « brouillon »), RM-01/RM-08.
**Gravité :** Bloquant
**Question métier :** PJ autorisées (formats, taille) ? Notifications à quelles étapes, par quel canal ? Qu'est-ce qu'un brouillon vis-à-vis des 6 statuts ? Quels types de besoin pour les modèles ? Format et gestion d'erreurs de l'import ?
**Recommandation :** Découper en 5 US (brouillon, modèles, import, pièces jointes, notifications) ; bloquer PJ et notifications.

**US concernée :** US-103 — Dépôt rapide
**Constat :** Contradiction interne : « titre obligatoire » vs « envoi sans titre s'il est pressé ». Règle « service renseigné automatiquement depuis le profil » absente des RM.
**Règle ou critère concerné :** RM-01 (titre obligatoire).
**Gravité :** Bloquant
**Question métier :** Un assouplissement du titre est-il voulu (cela modifierait RM-01) ? Le service est-il pré-rempli depuis le profil, et modifiable ?
**Recommandation :** Appliquer RM-01 ; signaler l'écart.

**US concernée :** US-104 — Confirmation de dépôt
**Constat :** Aucun critère d'acceptation ; support de la confirmation non défini.
**Règle ou critère concerné :** ND-03.
**Gravité :** Bloquant (critères) / canal non décidé
**Question métier :** Confirmation par e-mail, in-app, les deux ? Contenu ?
**Recommandation :** Rédiger des critères indépendants du canal ; ND-03 en question ouverte.

**US concernée :** US-105 — Champs obligatoires du formulaire
**Constat :** Conforme (5 sections, critères Given/When/Then, RM-01 citée).
**Règle ou critère concerné :** checklist 7/7.
**Gravité :** Aucune action
**Recommandation :** Recopier à l'identique.

---
## Lot 2 — Qualification et priorisation

**US concernée :** US-201 — Bonne priorisation
**Constat :** Trop vague : « bien » non défini. Recoupe US-205 (calcul de priorité). Rôle « responsable SI » = Qualificateur.
**Règle ou critère concerné :** RM-03, RM-04, RM-05.
**Gravité :** Bloquant (non testable) ; doublon à signaler
**Question métier :** Que veut dire « bien » au-delà de RM-04 ? US-201 se distingue-t-elle de US-205 ?
**Recommandation :** Reformuler autour de RM-03/04/05 sans dupliquer US-205.

**US concernée :** US-202 — Qualification avancée
**Constat :** Trop volumineuse (qualification, matrice, SLA, escalade, reporting, IA). La matrice paramétrable contredit RM-04 (figée). SLA, escalade, IA non documentés. « La suggestion IA est pertinente » non vérifiable.
**Règle ou critère concerné :** RM-03, RM-04, RM-05 ; ND-01 et ND-03 (escalade) ; décisions hors liste (SLA, IA).
**Gravité :** Bloquant
**Question métier :** La matrice doit-elle rester figée (RM-04) ? Quels SLA ? Qui est escaladé, comment (ND-03) ? L'IA propose-t-elle ou fixe-t-elle ? Quels indicateurs de reporting ?
**Recommandation :** Découper en 6 US ; qualification seule exécutable, les cinq autres bloquées.

**US concernée :** US-203 — Fixer la priorité
**Constat :** Contradictions : demandeur fixe la priorité vs RM-05 ; priorité « non modifiable » vs « ajustable manuellement » par le Qualificateur ; priorité « calculée » vs « choisie par le demandeur ».
**Règle ou critère concerné :** RM-04, RM-05.
**Gravité :** Bloquant
**Question métier :** Le Qualificateur peut-il ajuster manuellement la priorité calculée (cela contredit RM-04) ? Le demandeur peut-il seulement exprimer une urgence souhaitée ?
**Recommandation :** Appliquer RM-05 : le demandeur ne fixe pas la priorité ; ajustement manuel en question ouverte.

**US concernée :** US-204 — Tri par priorité
**Constat :** Aucun critère d'acceptation ; ordre de tri et tri par défaut non définis.
**Règle ou critère concerné :** RM-04 (P1–P4), ND-05.
**Gravité :** Bloquant (critères)
**Question métier :** Tri par défaut de la liste (ND-05) ? Ordre des demandes sans priorité ?
**Recommandation :** Critères du tri à la demande ; ND-05 ouverte.

**US concernée :** US-205 — Calcul de la priorité
**Constat :** Conforme.
**Gravité :** Aucune action
**Recommandation :** Recopier à l'identique.

---
## Lot 3 — Traitement des demandes

**US concernée :** US-301 — Traitement rapide
**Constat :** Trop vague : « rapidement » non mesurable, pas de critère. Recoupe US-303/305.
**Règle ou critère concerné :** aucune RM ; pas de SLA validé.
**Gravité :** Bloquant (non testable)
**Question métier :** Quelle mesure de rapidité ? Quels écrans/actions du traitant ?
**Recommandation :** Ne pas inventer de SLA ; limiter aux faits (le traitant traite ce qui lui est affecté).

**US concernée :** US-302 — Gestion complète du traitement
**Constat :** Trop volumineuse (affectation, délégation, statut, réouverture, commentaires/mentions, historique, notifications). Statut = US-305, historique = US-304, affectation = US-303 (doublons). Critère unique « fonctionne ».
**Règle ou critère concerné :** RM-02, RM-06, RM-07 ; ND-04 (réouverture), ND-03 (notifications/mentions), ND-06 (refus).
**Gravité :** Bloquant
**Question métier :** Réouverture autorisée, par qui ? Notifications ? Délégation = réaffectation (RM-07) ? Format des mentions ?
**Recommandation :** Découper en 4 US (délégation, réouverture, commentaires, notifications) ; affectation → US-303, statut → US-305, historique → US-304.

**US concernée :** US-303 — Affectation
**Constat :** Contradiction : « plusieurs traitants » vs « un seul traitant à la fois ».
**Règle ou critère concerné :** RM-07.
**Gravité :** Bloquant
**Question métier :** Le travail d'équipe est-il voulu (cela modifierait RM-07) ?
**Recommandation :** Appliquer RM-07.

**US concernée :** US-304 — Consulter l'historique
**Constat :** Aucun critère ; contenu non précisé alors que RM-06 le définit ; ordre d'affichage non défini.
**Règle ou critère concerné :** RM-06.
**Gravité :** Bloquant (critères)
**Question métier :** Ordre d'affichage (chronologique ou inverse) ? Qui peut consulter ?
**Recommandation :** Critères basés sur RM-06.

**US concernée :** US-305 — Changement de statut historisé
**Constat :** Conforme (ND-04 déjà signalée en question ouverte).
**Gravité :** Aucune action
**Recommandation :** Recopier à l'identique.

---
## Lot 4 — Pilotage du backlog

**US concernée :** US-401 — Tableau de bord
**Constat :** Trop vague : « utile » non défini, aucun indicateur.
**Règle ou critère concerné :** RM-02 (statuts), RM-04 (priorités).
**Gravité :** Bloquant (non testable)
**Question métier :** Quels indicateurs ? Quelle période ?
**Recommandation :** Se limiter aux indicateurs de l'énoncé du lot (statut, priorité) ; renvoyer vers US-405/402.

**US concernée :** US-402 — Tableau de bord complet
**Constat :** Trop volumineuse (compteurs, filtres enregistrables, graphiques, alertes, exports, abonnement e-mail). Critères génériques.
**Règle ou critère concerné :** ND-01 (alertes), ND-03 (abonnement e-mail) ; RM-02, RM-04.
**Gravité :** Bloquant
**Question métier :** Seuil d'alerte (ND-01) ? Canal et destinataires de l'abonnement (ND-03) ? Filtres « enregistrables » : par utilisateur ? Évolution de quoi, sur quelle période ?
**Recommandation :** Découper en 6 US ; bloquer alertes et abonnement.

**US concernée :** US-403 — Alerte sur demandes non traitées
**Constat :** Contradiction : 5 jours calendaires vs 3 jours ouvrés ; alerte immédiate P1 non validée.
**Règle ou critère concerné :** ND-01.
**Gravité :** Bloquant
**Question métier :** Quel seuil et quel mode de décompte ? Les P1 déclenchent-elles une alerte immédiate ? Alerte = tableau de bord seul ou notification (ND-03) ?
**Recommandation :** Ne choisir aucun seuil ; ND-01 ouverte.

**US concernée :** US-404 — Filtrer le backlog
**Constat :** Aucun critère ; combinaison des filtres non définie.
**Règle ou critère concerné :** RM-02, RM-04.
**Gravité :** Bloquant (critères)
**Question métier :** Filtres combinés en ET ou en OU ? Sélection multiple ?
**Recommandation :** Critères par filtre ; combinaison en question ouverte.

**US concernée :** US-405 — Compteurs par statut
**Constat :** Conforme.
**Gravité :** Aucune action
**Recommandation :** Recopier à l'identique.

---
## Contrôles exécutés
- Lecture des 20 US d'origine et des deux fichiers de contexte ; checklist appliquée US par US.
- Aucun test applicatif (aucun code dans le dépôt).
