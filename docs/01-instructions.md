# Créer des instructions

## À quoi ça sert
Les instructions sont du contexte ajouté **automatiquement** à chaque requête Copilot. Elles portent les règles communes à tous les agents : sources de référence, interdits, conventions de sortie.

## Dans l'atelier 1 : exprimer clairement le contexte du projet
Le premier exercice n'est pas technique : c'est de **dire clairement** à Copilot où il travaille. Des instructions claires répondent à quatre questions :
| Question | Exemple SprintDesk |
|---|---|
| Quel est le projet et son but ? | Centraliser, qualifier, prioriser et suivre les demandes métier |
| Quelles sont les sources de vérité ? | `produit.md`, `regles-metier.md` |
| Qu'est-ce qui est interdit ? | Inventer une décision (`ND-xx`), publier sans validation |
| Quelle forme doivent avoir les réponses ? | Faits / propositions / questions ouvertes ; identifiants US conservés |

Ces instructions servent ensuite de base à **tous** les prompts et à tous les agents : [02-plan.md](02-plan.md) s'appuie dessus.

## Deux niveaux

| Fichier | Portée |
|---|---|
| `.github/copilot-instructions.md` | Tout le dépôt, toutes les conversations |
| `.github/instructions/<nom>.instructions.md` | Seulement les fichiers correspondant au motif `applyTo` |

Activer si besoin dans VS Code : paramètre `github.copilot.chat.codeGeneration.useInstructionFiles` (activé par défaut).

## Étapes
1. Ouvrir `.github/copilot-instructions.md` (ou le créer).
2. Lister les **références** : fichiers de contexte à lire.
3. Écrire des **règles courtes, impératives et vérifiables** (une par ligne).
4. Renvoyer vers les skills pour le détail (ne pas tout recopier ici).
5. Tester : poser une question à Copilot et vérifier dans « Références » que le fichier est bien utilisé.

## Exemple SprintDesk
```markdown
# Instructions communes — SprintDesk

## Références
- Contexte produit : `sprintdesk/contexte/produit.md`
- Règles métier : `sprintdesk/contexte/regles-metier.md`

## Règles
- N'invente aucune règle ni décision métier : une décision ND-xx reste une question ouverte.
- Conserve l'identifiant US-xxx et cite l'US d'origine.
- Distingue explicitement : Faits / Propositions / Questions ouvertes.
- Si une US est correcte, laisse-la inchangée et dis-le.
- Ne publie rien vers un service externe sans validation humaine.
- Indique les contrôles réellement exécutés (et ceux qui ne l'ont pas été).

## Où trouver les détails
- Format d'une US : skill `formater-us`.
- Méthode de revue : skill `revue-agilite`.
```

## Instructions ciblées (optionnel)
```markdown
---
applyTo: "sprintdesk/backlog/sortie/**/*.md"
---
Chaque US produite respecte le modèle de la skill `formater-us`.
Les critères d'acceptation sont au format Given / When / Then.
```

## Bonnes pratiques
- **Court** : ce fichier est envoyé à chaque requête ; au-delà d'une page, déplacer dans une skill.
- **Positif et précis** : « cite la règle RM-xx » plutôt que « sois rigoureux ».
- **Pas de procédure longue** : c'est le rôle d'une skill.
- **Pas de garantie** : une instruction peut être ignorée ; ce qui doit être vérifié se contrôle lors de la relecture humaine.

## Pièges
- Contradiction entre instructions et agent → le modèle arbitre au hasard. Garder une seule source de vérité.
- Règles vagues (« fais de bonnes US ») → aucun effet mesurable.
