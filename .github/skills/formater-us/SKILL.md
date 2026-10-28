---
name: formater-us
description: "Formate une user story SprintDesk selon le modèle cible : champs obligatoires, critères d'acceptation Given/When/Then, questions ouvertes. Utiliser pour réécrire ou contrôler le format d'une US."
---
# Skill formater-us

## Quand l'utiliser
- Réécrire une US vague, volumineuse, contradictoire ou sans critères.
- Contrôler le format d'une US de sortie.

Ne pas l'utiliser pour juger la valeur ou le découpage : c'est `revue-agilite`.

## Procédure
1. Reprendre **toutes** les sections de [modele-us.md](modele-us.md), même vides (écrire « Aucune. »).
2. Titre `# US-XXX — Titre` ; l'identifiant d'origine est conservé (dérivé -a, -b si découpage).
3. Besoin : « En tant que / Je souhaite / Afin de ». Ne pas changer l'intention d'origine.
4. Règles métier : seulement des RM-xx de `regles-metier.md`, citées par leur identifiant. Une règle de l'US d'origine absente des RM n'y figure pas : elle va en Questions ouvertes.
5. Critères d'acceptation : « Étant donné… quand… alors… », **un comportement par critère**, observable, sans adjectif flou (« rapide », « simple », « pertinent »). Au moins un par US.
6. Information manquante ou décision ND-xx : l'écrire en Questions ouvertes (« ND-04 : … »). Ne jamais fournir de valeur (jours, taille, canal, ordre de tri).
7. Dépendances : US liées, et pour un découpage « US d'origine : US-xxx ».
8. Aucun ordre, hiérarchie ou équivalence implicite entre valeurs (ex. « P1 est la plus haute ») n'est écrit comme un fait en Règles métier : si `regles-metier.md` ne le dit pas, c'est une proposition en Questions ouvertes.
9. US bloquée par une décision : critères provisoires limités à ce qui est décidé, et mention « Bloquée » en Dépendances.
10. US déjà conforme : copier à l'identique, le signaler, ne rien « améliorer ».

## Contrôle de structure (à exécuter avant de rendre)
- [ ] 5 sections présentes
- [ ] ≥ 1 critère vérifiable
- [ ] aucune règle hors `regles-metier.md`
- [ ] chaque ND-xx concernée en question ouverte
- [ ] identifiant tracé

## Exemple conforme
US-105 : sections complètes, un critère par champ manquant, RM-01 citée, « Aucune » en dépendances et questions. → à recopier telle quelle.

## Contre-exemple
US-104 d'origine : une phrase, pas de critère.
- Réécriture **non conforme** : « Une confirmation s'affiche par e-mail sous 5 secondes » → invente le canal (ND-03) et un délai.
- Réécriture conforme : critère « Étant donné une demande enregistrée, quand le dépôt réussit, alors une confirmation est présentée au demandeur », et en question ouverte : « ND-03 : support de la confirmation (e-mail, in-app) ? ».
