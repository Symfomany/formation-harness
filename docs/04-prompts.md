# Créer un prompt réutilisable

## À quoi ça sert
Un fichier de prompt enregistre une **demande récurrente** pour la relancer avec `/nom` dans le chat. Idéal pour standardiser le lancement d'une étape (ex. le prompt de planification de la partie 1).

## Emplacement
`.github/prompts/<nom>.prompt.md` → invoqué par `/<nom>` dans le chat.

## Structure
```markdown
---
description: "Prépare le plan de traitement d'un lot SprintDesk."
agent: plan          # ou ask, edit, agent, ou un agent personnalisé
tools: ['read', 'search']
---
Nous préparons le backlog du projet SprintDesk, lot ${input:lot:numéro du lot}.

Lis :
- [produit.md](../../sprintdesk/contexte/produit.md)
- [regles-metier.md](../../sprintdesk/contexte/regles-metier.md)
- les cinq user stories de sprintdesk/backlog/entree/lot${input:lot}/

Ne réécris pas encore les user stories. Ne publie rien.
Prépare un plan de traitement et distingue faits, propositions et décisions à prendre.
```

| Élément | Rôle |
|---|---|
| `agent` | Agent qui exécute le prompt |
| `tools` | Outils autorisés pour ce prompt |
| `${input:nom:indication}` | Variable demandée à l'utilisateur au lancement |
| Liens Markdown | Ajoutent les fichiers au contexte |

## Étapes
1. Repérer un prompt que le groupe tape plusieurs fois.
2. Le copier dans un fichier `.prompt.md`, remplacer les valeurs variables par `${input:...}`.
3. Choisir l'agent et les outils minimaux.
4. Tester avec `/nom` puis ajuster.

## Prompt, agent ou skill ?
- **Prompt** : déclenché par l'humain, pour une tâche ponctuelle.
- **Agent** : un rôle durable sur toute une conversation.
- **Skill** : chargée automatiquement par le modèle quand elle est pertinente.
