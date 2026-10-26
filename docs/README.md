# Guides — construire le harness Copilot

Ces fiches accompagnent l'atelier. Elles expliquent comment créer chaque brique de personnalisation de GitHub Copilot dans VS Code, avec des exemples tirés de SprintDesk.

## Le parcours
| Temps | Objectif | Guides |
|---|---|---|
| **Atelier 1 — Planifier** | Poser le contexte du projet dans des instructions claires, puis prompter pour obtenir un plan clair et bien construit | [01-instructions.md](01-instructions.md) · [02-plan.md](02-plan.md) |
| **Atelier 2 — Acter** | Architecturer les agents dans le cycle de développement, créer agents et skills | [03-architecture-agents.md](03-architecture-agents.md) · [04-agents.md](04-agents.md) · [05-skills.md](05-skills.md) · [06-prompts.md](06-prompts.md) (annexe) |
| **Bonus — Analyser** | Évaluer, analyser les erreurs et ajuster | [07-evaluation.md](07-evaluation.md) |

## Les briques
| Brique | Fichier(s) | Chargée quand ? |
|---|---|---|
| Instructions | `.github/copilot-instructions.md`, `.github/instructions/*.instructions.md` | Toujours (ou selon les fichiers ciblés) |
| Agent personnalisé | `.github/agents/*.agent.md` | Quand on sélectionne l'agent |
| Skill | `.github/skills/<nom>/SKILL.md` | Quand la tâche correspond à sa description |
| Prompt réutilisable | `.github/prompts/*.prompt.md` | Quand on tape `/nom` |

## Quelle brique pour quel besoin ?
| Je veux… | J'utilise |
|---|---|
| Une règle valable pour **toutes** les conversations | Instructions |
| Un **plan** validé avant d'agir | Mode Plan → `PLAN.md` |
| Un **rôle** avec sa mission, ses outils et ses interdits | Agent |
| Un **savoir-faire** réutilisable par plusieurs agents (procédure, modèle, checklist) | Skill |
| Lancer une **tâche répétitive** avec un raccourci | Prompt |

Règle d'or : ce qui doit *toujours* être vrai va dans les instructions ; le reste se répartit entre agents (qui ?) et skills (comment ?).

Voir aussi l'aide-mémoire : [Aide_Memoire_Participant.pdf](Aide_Memoire_Participant.pdf).

> Les formats évoluent vite. En cas de doute, vérifier la documentation VS Code / GitHub Copilot à jour.
