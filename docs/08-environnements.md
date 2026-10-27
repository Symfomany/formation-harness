# Environnements : VS Code ou GitHub Copilot app (desktop)

## À quoi ça sert
Le harness de l'atelier (instructions, agents, skills, prompts) est fait de **fichiers dans le dépôt**. Il peut donc être utilisé depuis deux environnements sous Windows. Ce guide aide à choisir, installer et vérifier.

> ⚠️ **Ne pas confondre** avec *Microsoft 365 Copilot* (page `m365.cloud.microsoft/chat`) : c'est un autre produit, orienté bureautique, qui ne lit pas le dépôt ni `.github/`. Pour l'atelier, il faut **GitHub Copilot**.

## Prérequis communs
| Élément | Détail |
|---|---|
| Compte GitHub | Avec un forfait GitHub Copilot actif (voir « Forfaits » plus bas) |
| Git | Pour cloner le dépôt de l'atelier |
| Le dépôt | Ouvert comme dossier : le harness vit dans `.github/` à sa racine |

## Option A — Visual Studio Code
### Présentation
Éditeur de code avec l'extension GitHub Copilot Chat. C'est l'environnement pris pour référence par les guides `docs/01` à `docs/07`.

### Installation (Windows)
Source : [documentation officielle VS Code pour Windows](https://code.visualstudio.com/docs/setup/windows).
| Variante | Lien | Quand la choisir |
|---|---|---|
| **User setup** (recommandé) | [téléchargement](https://go.microsoft.com/fwlink/?LinkID=534107) | Poste sans droits administrateur ; installe dans `%LOCALAPPDATA%\Programs\Microsoft VS Code` |
| **System setup** | [téléchargement](https://go.microsoft.com/fwlink/?linkid=852157) | Tous les utilisateurs de la machine ; droits administrateur requis |
| **ZIP** | [page de téléchargement](https://code.visualstudio.com/download) | Poste verrouillé ; mises à jour manuelles |

Étapes :
1. Télécharger le programme et l'exécuter (`VSCodeUserSetup-<version>.exe`).
2. Rouvrir le terminal puis taper `code .` dans le dossier du dépôt : VS Code est ajouté au `PATH`.
3. Ouvrir la vue Chat, installer/activer l'extension **GitHub Copilot** si elle n'est pas proposée, et se connecter à GitHub.
4. Ouvrir le dossier du dépôt (pas un sous-dossier) : `.github/` doit être à la racine de l'espace de travail.

### Avantages
- Environnement documenté par les guides de l'atelier : mêmes menus, mêmes noms.
- Prise en charge des briques du harness : instructions, agents `.agent.md`, skills, prompts `/nom` (voir `docs/00` à `docs/06`).
- Sélecteur d'agents et mode **Plan** intégrés au Chat.
- Panneau Chat avec **références** et outils appelés : indispensable pour la phase Analyser.
- Édition du code et des fichiers Markdown dans le même outil.

### Limites
- Une session = un dossier ouvert ; l'exécution en parallèle de plusieurs tâches se fait au prix de plusieurs fenêtres.
- Les formats évoluent : vérifier les paramètres Copilot (`chat.useAgentSkills`, `github.copilot.chat.codeGeneration.useInstructionFiles`).

## Option B — GitHub Copilot app (application de bureau)
### Présentation
Application de bureau « pour le développement piloté par des agents », construite nativement sur GitHub (sur Copilot CLI). Page produit : [github.com/features/ai/github-app](https://github.com/features/ai/github-app) · documentation : [GitHub Copilot app](https://docs.github.com/en/copilot/concepts/agents/github-copilot-app).
Plateformes annoncées : macOS, Linux, **Windows**.

### Installation (Windows)
1. Suivre le guide officiel « Getting started with the GitHub Copilot app », accessible depuis la [documentation](https://docs.github.com/en/copilot/concepts/agents/github-copilot-app) (c'est là que se trouve le lien de téléchargement à jour pour Windows ; la page produit ne montre qu'un bouton macOS).
2. Option en ligne de commande, **non officielle** (listings tiers, à vérifier avant usage) : `winget install --id GitHub.CopilotApp --exact`.
3. Se connecter avec son compte GitHub, puis **connecter le dépôt ou le dossier local** de l'atelier.
4. Business / Enterprise : l'administrateur doit laisser activée la politique « GitHub Copilot app » (distincte de la politique Copilot CLI).

### Avantages (d'après la page produit et la documentation)
- **Sessions d'agents en parallèle**, chacune dans son propre espace isolé (branche et worktree Git).
- **Modes de session** : Interactive, **Plan** et Autopilot, ce qui correspond à Planifier → Acter.
- **Contexte GitHub natif** : issues, pull requests, revues, résultats CI.
- **Boucle de validation intégrée** : diffs, aperçu navigateur, terminal, fusion de PR.
- **Automatisations** récurrentes à partir de skills et de prompts.
- Personnalisations : skills, serveurs MCP, instructions globales ; choix du modèle (BYOK possible).
- Idéal pour la partie « Acter » à l'échelle : un lot par session, sans conflit entre groupes.

### Limites / points de vigilance
- Produit récent : les éléments ci-dessous sont à **vérifier dans votre version** avant l'atelier.
- Les sources consultées se contredisent sur les forfaits : la page produit indique que le forfait Free inclut l'app, la documentation dit « tous les plans », un listing tiers parle de preview réservée aux forfaits payants. **Vérifier avec votre compte.**

## Le harness selon l'environnement
| Brique du harness | VS Code | GitHub Copilot app |
|---|---|---|
| Instructions `.github/copilot-instructions.md` | ✅ Documenté (`docs/01`) | ⚠️ « Instructions globales » citées ; lecture du fichier du dépôt à vérifier |
| Agents `.github/agents/*.agent.md` | ✅ Documenté (`docs/04`) | ⚠️ Sessions d'agents ; agents personnalisés non confirmés par la doc |
| Skills `.github/skills/*/SKILL.md` | ✅ Documenté (`docs/05`) | ✅ Skills pris en charge |
| Prompts `.github/prompts/*.prompt.md` | ✅ Documenté (`docs/06`) | ⚠️ Non confirmé ; les prompts s'appliquent via les skills/automatisations |
| Mode Plan | ✅ | ✅ (mode de session) |
| MCP | ✅ | ✅ |
| Sessions parallèles isolées | Plusieurs fenêtres | ✅ natif (worktrees) |

**Conséquence pratique** : le même dossier `.github/` sert aux deux environnements. Ce qui n'est pas lu par l'un se fait en collant le contenu du fichier dans le prompt de la session (le harness reste valable, la mise en œuvre est manuelle).

## Quel environnement choisir ?
| Situation | Choix |
|---|---|
| Atelier guidé, pas à pas, avec captures des guides | **VS Code** |
| Poste verrouillé sans droits administrateur | **VS Code** (User setup ou ZIP) |
| Démonstration du travail parallèle, d'un lot par session, de la PR | **GitHub Copilot app** |
| Doute sur la compatibilité de l'app avec votre dépôt | **VS Code**, puis découverte de l'app en bonus |

## Test de contrôle (identique dans les deux)
1. Ouvrir le dépôt de l'atelier.
2. Nouvelle conversation : « Quelles règles dois-tu respecter sur ce projet ? » → `copilot-instructions.md` doit apparaître en référence.
3. Demander : « Contrôle le format de US-104 » → la skill `formater-us` est chargée.
4. Sélectionner l'agent `reviewer-backlog` et lui demander de revoir US-105 → réponse « aucune action ».

Si une étape échoue : cause **environnement** (mauvais dossier ouvert, fonction désactivée, brique non prise en charge) : voir `docs/07-evaluation.md`.

## Sources
- [VS Code sur Windows](https://code.visualstudio.com/docs/setup/windows)
- [GitHub Copilot app, page produit](https://github.com/features/ai/github-app)
- [GitHub Copilot app, documentation](https://docs.github.com/en/copilot/concepts/agents/github-copilot-app)
- Listing winget tiers (non officiel) : [wingetly.io](https://wingetly.io/apps/git-hub/copilot-app)
