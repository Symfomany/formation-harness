# Créer un hook

## À quoi ça sert
Un hook exécute une **commande** (script) automatiquement sur un événement de l'agent, par exemple après chaque modification de fichier. Contrairement aux instructions, il ne dépend pas du bon vouloir du modèle : c'est le **contrôle déterministe** du harness.

> Fonctionnalité en **préversion** dans VS Code : tester sur le poste cible. Repli manuel : `python scripts/verifier_backlog.py`.

## Emplacement
`.github/hooks/<nom>.json`

## Événements utiles
| Événement | Quand | Usage typique |
|---|---|---|
| `PreToolUse` | Avant l'appel d'un outil | Bloquer une action interdite (ex. publication) |
| `PostToolUse` | Après l'appel d'un outil | Contrôler ce qui vient d'être écrit |
| `UserPromptSubmit` | À l'envoi d'un message | Ajouter du contexte, filtrer |
| `Stop` | Fin de la réponse de l'agent | Vérification finale |

## Exemple SprintDesk
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "type": "command",
        "command": "python scripts/verifier_backlog.py --hook",
        "windows": "python scripts\\verifier_backlog.py --hook",
        "timeout": 20
      }
    ]
  }
}
```
Le script reçoit l'événement en JSON sur l'entrée standard, ne contrôle que si l'outil a touché `backlog/sortie`, puis vérifie : sections obligatoires, identifiants uniques, au moins un critère d'acceptation. Il écrit `sprintdesk/resultats/rapport-structure.md`.

## Étapes
1. Écrire (ou réutiliser) un **script** qui contrôle quelque chose d'objectif.
2. Le tester **seul** en ligne de commande.
3. Le brancher sur l'événement adapté dans le JSON (`command`, variante `windows`, `timeout`).
4. Provoquer l'événement (faire écrire une US par l'agent) et vérifier que le rapport est produit.
5. Vérifier le comportement en cas d'échec : le message renvoyé doit être compréhensible par l'agent.

## Bonnes pratiques
- Le hook contrôle la **structure**, pas la pertinence métier : celle-ci reste une revue humaine.
- Script rapide (quelques secondes) et silencieux quand tout va bien.
- Filtrer tôt : ne rien faire si l'événement ne concerne pas les fichiers visés.

## Pièges
- Chemin Python différent sous Windows → prévoir la clé `windows`.
- Script qui plante → l'agent reçoit une erreur obscure. Toujours tester hors hook d'abord.
