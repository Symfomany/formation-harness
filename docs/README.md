# Guides — construire le harness Copilot

Ces fiches expliquent comment créer chaque brique de personnalisation de GitHub Copilot dans VS Code, avec des exemples tirés de SprintDesk.

| Guide | Brique | Fichier(s) | Chargé quand ? |
|---|---|---|---|
| [01-instructions.md](01-instructions.md) | Instructions | `.github/copilot-instructions.md`, `.github/instructions/*.instructions.md` | Toujours (ou selon les fichiers ciblés) |
| [02-agents.md](02-agents.md) | Agent personnalisé | `.github/agents/*.agent.md` | Quand on sélectionne l'agent |
| [03-skills.md](03-skills.md) | Skill | `.github/skills/<nom>/SKILL.md` | Quand la tâche correspond à sa description |
| [04-prompts.md](04-prompts.md) | Prompt réutilisable | `.github/prompts/*.prompt.md` | Quand on tape `/nom` |
| [05-hooks.md](05-hooks.md) | Hook | `.github/hooks/*.json` | Automatiquement, sur un événement |
| [06-orchestration.md](06-orchestration.md) | Assemblage | — | Workflow complet Reviewer → Rédacteur → contrôle |

## Quelle brique pour quel besoin ?

| Je veux… | J'utilise |
|---|---|
| Une règle valable pour **toutes** les conversations | Instructions |
| Un **rôle** avec sa mission, ses outils et ses interdits | Agent |
| Un **savoir-faire** réutilisable par plusieurs agents (procédure, modèle, checklist) | Skill |
| Lancer une **tâche répétitive** avec un raccourci | Prompt |
| Un contrôle **déterministe** qui s'exécute sans dépendre du modèle | Hook |

Règle d'or : ce qui doit *toujours* être vrai va dans les instructions ; ce qui doit être *garanti* va dans un hook ; le reste se répartit entre agents (qui ?) et skills (comment ?).

Voir aussi l'aide-mémoire : [Aide_Memoire_Participant.pdf](Aide_Memoire_Participant.pdf).

> Les formats évoluent vite (hooks en préversion notamment). En cas de doute, vérifier la documentation VS Code / GitHub Copilot à jour.
