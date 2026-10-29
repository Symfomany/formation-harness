# Revue de backlog — SprintDesk, lot 1

Revue produite en appliquant la skill `revue-agilite` (checklist.md) aux 5 US de
`sprintdesk/backlog/entree/lot1/`, avec `sprintdesk/contexte/produit.md` et
`sprintdesk/contexte/regles-metier.md` comme sources. Aucune US n'a été réécrite.

> Point d'attention : `PLAN.md` n'existe pas dans le projet à ce stade (il est produit à
> l'Atelier 1, partie B). Cette revue s'appuie donc uniquement sur `produit.md` et
> `regles-metier.md`.

## US-101 — Formulaire simple

```
US concernée : US-101
Constat : Aucun critère d'acceptation n'est formulé. Impossible de vérifier quand l'US est terminée.
Règle ou critère concerné : Checklist revue-agilite — « Les critères d'acceptation sont-ils vérifiables ? »
Gravité : bloquant
Question métier éventuelle : Aucune (défaut de rédaction, pas une décision métier).
Recommandation : Ajouter au moins 2 critères Étant donné/Quand/Alors avant réécriture.
```
```
US concernée : US-101
Constat : L'US ne cite aucune règle métier, alors que le dépôt d'une demande est encadré par RM-01 (champs obligatoires).
Règle ou critère concerné : RM-01
Gravité : recommandation
Question métier éventuelle : Le « formulaire simple » demandé ajoute-t-il des champs au-delà de RM-01, ou se limite-t-il à RM-01 ?
Recommandation : Lier explicitement l'US à RM-01 plutôt que de laisser « simple et pratique » sans définition.
```

## US-102 — Dépôt complet d'une demande

```
US concernée : US-102
Constat : L'US mélange plusieurs besoins distincts dans une seule US : pièces jointes, brouillons, modèles de demande par type, import Excel, notifications à chaque étape.
Règle ou critère concerné : Checklist revue-agilite — « Un découpage est-il nécessaire ? »
Gravité : bloquant
Question métier éventuelle : Aucune (découpage, pas une décision métier).
Recommandation : Découper en US plus petites (une par besoin), à valider par l'humain avant réécriture.
```
```
US concernée : US-102
Constat : Les pièces jointes ne sont couvertes par aucune règle validée.
Règle ou critère concerné : ND-02 (pièces jointes : autorisées ? formats ? taille ?)
Gravité : bloquant
Question métier éventuelle : ND-02 — quels formats et quelle taille maximale pour les pièces jointes ?
Recommandation : Laisser ND-02 en question ouverte dans l'US issue du découpage ; ne pas inventer de formats/tailles.
```
```
US concernée : US-102
Constat : Les notifications « à chaque étape » ne sont couvertes par aucune règle validée.
Règle ou critère concerné : ND-03 (notifications : lesquelles, à qui ?)
Gravité : bloquant
Question métier éventuelle : ND-03 — quelles notifications, par quel canal, à destination de qui ?
Recommandation : Laisser ND-03 en question ouverte dans l'US issue du découpage.
```
```
US concernée : US-102
Constat : Les 2 critères d'acceptation donnés (« Le formulaire fonctionne. », « L'import Excel fonctionne. ») ne sont pas vérifiables : aucun comportement observable n'est décrit.
Règle ou critère concerné : Checklist revue-agilite — « Les critères d'acceptation sont-ils vérifiables ? »
Gravité : bloquant
Question métier éventuelle : Aucune (défaut de rédaction).
Recommandation : Réécrire des critères Étant donné/Quand/Alors par besoin, une fois le découpage validé.
```

## US-103 — Dépôt rapide

```
US concernée : US-103
Constat : L'US autorise l'envoi d'une demande sans titre « si le demandeur est pressé ». Cela contredit la règle validée qui rend le titre obligatoire.
Règle ou critère concerné : RM-01 (titre obligatoire), contredite par la phrase « Le demandeur peut envoyer sa demande sans titre s'il est pressé. »
Gravité : bloquant
Question métier éventuelle : Aucune — RM-01 est une règle déjà validée, elle ne se renégocie pas dans une US.
Recommandation : Supprimer cette règle de l'US ; le titre reste obligatoire dans tous les cas.
```
```
US concernée : US-103
Constat : Le critère d'acceptation unique (« Quand je clique sur Envoyer, la demande est enregistrée ») ne couvre pas le cas des champs obligatoires (RM-01) ni le statut de création (RM-08).
Règle ou critère concerné : RM-01, RM-08
Gravité : recommandation
Question métier éventuelle : Aucune.
Recommandation : Ajouter des critères couvrant le respect de RM-01 et la création au statut « Nouvelle » (RM-08).
```

## US-104 — Confirmation de dépôt

```
US concernée : US-104
Constat : Aucun critère d'acceptation, aucune règle métier citée. On ne sait pas sous quelle forme la confirmation est donnée.
Règle ou critère concerné : Checklist revue-agilite — « Les critères d'acceptation sont-ils vérifiables ? »
Gravité : bloquant
Question métier éventuelle : Aucune (défaut de rédaction).
Recommandation : Ajouter des critères vérifiables une fois le canal de confirmation précisé (voir constat suivant).
```
```
US concernée : US-104
Constat : La « confirmation après le dépôt » relève potentiellement d'une notification, sujet non tranché.
Règle ou critère concerné : ND-03 (notifications : lesquelles, à qui ?)
Gravité : bloquant
Question métier éventuelle : ND-03 — la confirmation est-elle un message à l'écran, un e-mail, les deux ?
Recommandation : Laisser ND-03 en question ouverte dans l'US réécrite.
```

## US-105 — Champs obligatoires du formulaire

```
US concernée : US-105
Constat : Aucune action. L'US contient toutes les sections attendues, des critères Étant donné/Quand/Alors vérifiables, et cite RM-01.
Règle ou critère concerné : RM-01 (correctement citée et respectée)
Gravité : —
Question métier éventuelle : Aucune.
Recommandation : Recopier à l'identique lors de la réécriture, ne rien modifier.
```

## Synthèse des questions ouvertes à faire trancher par l'humain

| ID | Question | US concernées |
|---|---|---|
| ND-02 | Pièces jointes : formats et taille autorisés ? | US-102 |
| ND-03 | Notifications : lesquelles, à qui, par quel canal ? | US-102, US-104 |

## Contrôles réellement exécutés
- Les 5 US du lot 1 ont été lues et comparées à `regles-metier.md`.
- Chaque constat cite soit une règle validée (RM-xx), soit une décision non prise (ND-xx), soit un point de la checklist `revue-agilite`.
- Aucune règle n'a été inventée ; aucune décision ND-xx n'a été tranchée.
- `PLAN.md` étant absent, le critère « conformité au plan » n'a pas pu être contrôlé.
