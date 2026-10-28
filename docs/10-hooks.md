# Bonus 10 — Les hooks, pas à pas

## À quoi ça sert
Une instruction **demande** à l'agent de respecter une règle. Un hook **l'impose**.

Un hook est un petit programme lancé automatiquement à un moment précis de la vie d'un agent : démarrage de session, avant un outil, après un outil, fin de tour. Il reçoit un événement en JSON et peut répondre : refuser une action, ajouter du contexte, forcer l'agent à continuer.

| | Instruction (`copilot-instructions.md`, agent, skill) | Hook |
|---|---|---|
| Nature | Texte lu par le modèle | Programme exécuté par le runtime |
| Garantie | Probable : le modèle peut l'oublier ou mal l'interpréter | Déterministe : le script s'exécute à chaque fois |
| Exemple SprintDesk | « Ne modifie pas `sprintdesk/contexte/` » | Toute écriture dans `sprintdesk/contexte/` est refusée |
| Coût d'une erreur | L'agent écrit quand même | Le script se trompe : il faut le tester |

Règle simple : **ce qui ne doit jamais arriver** va dans un hook ; **ce qui guide le travail** reste dans les instructions.

> Le dépôt contient un jeu complet de hooks prêts à l'emploi dans `.github/hooks-exemples/`. Ils ne sont **pas actifs** tant qu'ils ne sont pas copiés dans `.github/hooks/`. Ce guide les construit et les explique un par un.

---

## 1. Les notions à connaître

### Où vivent les hooks
| Surface | Emplacement lu | Particularités |
|---|---|---|
| VS Code (session cible « Copilot ») | `.github/hooks/*.json`, `~/.copilot/hooks/` | Même format que la CLI (harness partagé). En préversion. |
| Copilot CLI | Idem + `.github/copilot/settings.json`, hooks de plugin, **hooks de politique** machine | Tous les événements. Les hooks de politique (administrateur) ne se désactivent pas. |
| Copilot cloud agent (sur GitHub) | `.github/hooks/*.json` du dépôt cloné **uniquement** | Linux : seul `bash` (ou `command`) est exécuté, `powershell` est ignoré. Disque éphémère. `ask` vaut `deny`. |

### Les événements utiles pour SprintDesk
| Événement | Moment | Ce que le hook peut faire | Usage dans ce guide |
|---|---|---|---|
| `sessionStart` | Début ou reprise de session | Ajouter du contexte (`additionalContext`) | Rappeler les ND-xx à jour |
| `preToolUse` | Avant chaque outil | Refuser (`deny`), autoriser, modifier les arguments | Protéger `entree/` et `contexte/`, bloquer `git push` |
| `postToolUse` | Après un outil réussi | Ajouter un retour au modèle | Contrôler une US juste après son écriture |
| `subagentStart` | Avant un sous-agent | Préfixer sa consigne (ne peut pas bloquer) | Transmettre les interdits aux sous-agents |
| `agentStop` | Fin de tour de l'agent principal | `decision: "block"` : forcer un tour de plus | Refuser de finir avec une US non conforme |
| `preCompact` | Avant le résumé automatique du contexte | Rien (notification) | Sauvegarder un état (exercice) |

### Le contrat d'un hook « commande »
- **Entrée** : un objet JSON sur l'entrée standard (stdin).
- **Sortie** : **un seul** objet JSON sur la sortie standard (stdout). `{}` signifie « pas d'avis ».
- **Deux formats d'événement**, choisis par le nom de l'événement dans la configuration :
  - `preToolUse` (camelCase) : champs `toolName`, `toolArgs` ;
  - `PreToolUse` (PascalCase, « compatible VS Code ») : champs `tool_name`, `tool_input`, et noms d'outils façon Claude (`Bash`, `Edit`).
  Les scripts du dépôt acceptent les deux.

### Échec ouvert ou fermé : le piège principal
| Situation | `preToolUse` (commande) | Autres événements |
|---|---|---|
| Le script plante ou sort avec un code non nul | **Refus** (fail-closed) | Ignoré, l'agent continue |
| Code de sortie 2 | **Refus**, même si stdout dit `allow` | Avertissement |
| Délai dépassé (`timeoutSec`, 30 s par défaut) | **Autorisé** : circuit normal (fail-open) | Ignoré |
| Hook HTTP en erreur | Autorisé (fail-open) | Ignoré |

Conséquence : un garde-fou lent n'est **pas** un garde-fou. Gardez les hooks sous quelques secondes.

---

## 2. Pas à pas

### Étape 1 — Observer avant d'interdire : un hook d'audit
Objectif : voir quels outils l'agent appelle, sans rien bloquer.

Créer `.github/hooks/audit.json` :
```json
{
  "version": 1,
  "hooks": {
    "preToolUse": [
      { "type": "command", "command": "node .github/hooks/log-tool-use.cjs", "timeoutSec": 10 }
    ]
  }
}
```

Créer `.github/hooks/log-tool-use.cjs` :
```js
const fs = require('node:fs');
const path = require('node:path');
const evt = JSON.parse(fs.readFileSync(0, 'utf8'));
const outil = evt.toolName || evt.tool_name || 'inconnu';
fs.appendFileSync(path.join(__dirname, 'tool-use.log'), `${new Date().toISOString()} ${outil}\n`);
process.stdout.write('{}'); // pas d'avis : la demande suit le circuit normal
```

Vérifier : nouvelle session, demander « Lis sprintdesk/contexte/produit.md ». Le fichier `tool-use.log` contient `view` (ou le nom de l'outil de lecture).

Pourquoi `{}` et pas `allow` ? `allow` court-circuiterait la demande d'approbation. Un hook d'audit ne doit rien décider.

Le journal ne contient que le **nom** de l'outil, jamais ses arguments : ils peuvent contenir des données sensibles. `.github/hooks/*.log` est déjà dans `.gitignore`.

### Étape 2 — Le garde-fou : `preToolUse` qui refuse
Objectif : rendre impossibles les écritures dans `sprintdesk/backlog/entree/` et `sprintdesk/contexte/`, et les actions irréversibles (`git push`, `git reset --hard`, `gh pr merge`, `gh release`).

Lire `.github/hooks-exemples/scripts/protege-sources.cjs`. Les points clés :

| Choix | Raison |
|---|---|
| Filtrer les outils **dans le script** plutôt qu'avec `matcher` | Les noms d'outils varient selon la surface (`edit`, `Edit`, `str_replace_editor`). Un `matcher` trop étroit laisse passer une écriture. |
| Répondre `deny` + `permissionDecisionReason` | La raison est **obligatoire** pour un refus. Elle est montrée à l'agent, qui peut changer d'approche. |
| Ne jamais répondre `allow` | Le hook ajoute une barrière, il n'en retire aucune. |
| Événement illisible → `deny` | Choix volontaire d'échec fermé pour un garde-fou. |

Tester **sans agent**, depuis un terminal PowerShell à la racine du dépôt :
```powershell
'{"toolName":"edit","toolArgs":{"path":"sprintdesk/contexte/regles-metier.md"}}' | node .github/hooks-exemples/scripts/protege-sources.cjs
'{"toolName":"bash","toolArgs":{"command":"git push origin main"}}' | node .github/hooks-exemples/scripts/protege-sources.cjs
'{"toolName":"create","toolArgs":{"path":"sprintdesk/backlog/sortie/lot1/US-101.md"}}' | node .github/hooks-exemples/scripts/protege-sources.cjs
```
Attendu : deux `deny` avec une raison, puis `{}`.

### Étape 3 — Donner le bon contexte au démarrage : `sessionStart`
Objectif : à chaque session, rappeler les zones protégées et la liste **à jour** des décisions non prises.

`contexte-session.cjs` lit `sprintdesk/contexte/regles-metier.md` et en extrait les lignes `ND-xx`. Il n'y a donc **aucune copie** à maintenir : si le référent tranche ND-05 demain, le hook suit.

Lors d'une **reprise** de session (`source: "resume"`), il ajoute une consigne : relire le plan et le journal avant d'agir, ne pas refaire une étape validée. C'est la base de la reprise sans répétition (voir [11-planificateur-orchestration.md](11-planificateur-orchestration.md)).

Tester :
```powershell
'{"source":"resume"}' | node .github/hooks-exemples/scripts/contexte-session.cjs
```

### Étape 4 — Contrôler juste après l'écriture : `postToolUse`
Objectif : dès que l'agent écrit une US dans `sprintdesk/backlog/sortie/`, la contrôler et lui renvoyer les écarts.

`controle-apres-ecriture.cjs` appelle **le même script que la CI** : `.github/scripts/verifier-us.cjs`. Même règle, même verdict, plus tôt. C'est le principe du « shift left » : l'erreur est corrigée pendant la session, pas découverte dans la PR.

Limite à retenir : `postToolUse` ne peut **pas annuler** l'écriture, l'outil a déjà agi. Il ajoute un `additionalContext` que le modèle lit dans le même tour.

Contrôles appliqués par `verifier-us.cjs` :
- nom de fichier et titre `# US-XXX — Titre` cohérents ;
- les cinq sections du modèle présentes et non vides ;
- besoin « En tant que … je souhaite … afin de … » ;
- chaque critère d'acceptation sous la forme « Étant donné … quand … alors … » ;
- aucune ND-xx dans un critère, et chaque ND-xx citée reprise en « Questions ouvertes » ;
- une US découpée (`US-104a.md`, `US-104-1.md`) cite son US d'origine.

### Étape 5 — Transmettre les interdits aux sous-agents : `subagentStart`
Un sous-agent ne voit pas la conversation de l'orchestrateur. Une règle dite à l'orchestrateur peut être perdue à la délégation.

`rappel-sous-agent.cjs` ajoute les interdits du projet **en tête de la consigne** de chaque sous-agent, plus une consigne propre à certains agents (le rédacteur doit lancer `verifier-us.cjs` après chaque US).

Dans `garde-fous.json`, ce hook a un `matcher` : il ne s'applique qu'aux agents SprintDesk. Le `matcher` est une expression régulière ancrée (`^(?:...)$`) qui doit correspondre au nom **entier**.

### Étape 6 — Ne pas finir un travail incomplet : `agentStop`
Objectif : l'agent ne rend pas la main tant qu'une US modifiée n'est pas conforme.

`verifier-avant-arret.cjs` contrôle les US nouvelles ou modifiées (via `git status`). S'il reste des écarts, il répond :
```json
{ "decision": "block", "reason": "Avant de terminer, corrige les US non conformes : ..." }
```
L'agent reçoit `reason` comme nouvelle consigne et repart pour un tour.

Le risque est la **boucle sans fin**. Deux protections :
| Protection | Qui | Comportement |
|---|---|---|
| `stop_hook_active` | Le script | Vaut `true` si le tour a déjà été forcé : le script laisse finir et rend la main à l'humain |
| Garde-fou du runtime | Copilot | Après 8 blocages consécutifs, le blocage est ignoré |

Sur cloud agent, chaque tour forcé consomme du temps sur la durée maximale de la tâche.

### Étape 7 — Activer l'ensemble et le tester
1. Lancer les tests automatiques (aucun agent, aucun réseau) :
   ```powershell
   node .github/scripts/tester-harness.cjs
   ```
   Attendu : `Tous les tests passent.`
2. Activer les hooks :
   ```powershell
   New-Item -ItemType Directory -Force .github/hooks | Out-Null
   Copy-Item .github/hooks-exemples/garde-fous.json .github/hooks/
   Copy-Item .github/hooks-exemples/scripts .github/hooks/ -Recurse -Force
   ```
3. Nouvelle session. Demander : « Corrige la coquille dans sprintdesk/contexte/produit.md ». Attendu : refus avec la raison du hook.
4. Demander au rédacteur d'écrire une US volontairement incomplète. Attendu : retour du hook `postToolUse`, puis correction.
5. Pour suspendre tous les hooks d'un fichier sans le supprimer : `"disableAllHooks": true` dans ce fichier.

### Étape 8 — La variante cloud agent
Les mêmes fichiers `.github/hooks/*.json` sont lus par Copilot cloud agent quand il travaille sur une issue. Différences à connaître :

| Point | Conséquence |
|---|---|
| Linux uniquement | Utiliser `command` ou `bash`. Une entrée `powershell` seule est ignorée. |
| Dossier de travail `/workspace` | Les chemins relatifs à la racine du dépôt fonctionnent. |
| Disque éphémère | Un journal écrit sur disque disparaît en fin de tâche : utiliser un hook `http` vers un serveur autorisé par le pare-feu. |
| Pas d'utilisateur | `ask` est traité comme `deny`. `notification` et `permissionRequest` ne s'appliquent pas. |
| `GITHUB_TOKEN` absent | Un hook ne peut pas appeler l'API GitHub avec ce jeton. |
| Node.js nécessaire | Installé par `.github/workflows/copilot-setup-steps.yml`. |

---

## 3. Défense en profondeur
Un hook protège la session locale ou la session de l'agent. Il ne protège pas un humain qui modifie un fichier à la main, ni un hook désactivé. D'où trois couches, chacune utile seule :

| Couche | Où | Exemple SprintDesk | Contournable par |
|---|---|---|---|
| Instructions | Texte lu par l'agent | `copilot-instructions.md` : « ne pas modifier `contexte/` » | Un oubli du modèle |
| Hook | Runtime de l'agent | `protege-sources.cjs` | Un humain, un hook désactivé |
| Contrôle de PR | GitHub | Check requis « Politique - sources protégées », revue Code Owners | Un administrateur qui contourne le ruleset |

Voir [12-workflows-agentiques.md](12-workflows-agentiques.md) pour la troisième couche.

---

## Checklist
- [ ] `node .github/scripts/tester-harness.cjs` passe.
- [ ] Le hook `preToolUse` ne renvoie jamais `allow`.
- [ ] Chaque refus a une raison compréhensible par l'agent.
- [ ] Aucun hook ne journalise les arguments, les prompts ou les variables d'environnement.
- [ ] Chaque hook s'exécute en moins de 5 secondes.
- [ ] Le hook `agentStop` lit `stop_hook_active`.
- [ ] Les fichiers de hooks sont protégés par `CODEOWNERS`.

## Pièges
- **Croire qu'un délai dépassé bloque** : c'est l'inverse, le délai dépassé laisse passer.
- **Deux objets JSON sur stdout** : la sortie devient invalide et elle est ignorée. Un seul `process.stdout.write` final.
- **Message de débogage sur stdout** : même effet. Écrire les diagnostics sur stderr.
- **`matcher` trop étroit** : `edit` ne couvre pas `create`. Un garde-fou filtre plutôt dans le script.
- **Hook seulement en `powershell`** : ignoré par cloud agent.
- **Interpoler un argument d'outil dans une commande shell** : risque d'injection. Traiter l'événement comme une donnée.
- **Hook qui « corrige » à la place de l'agent** : un hook vérifie et signale ; il ne réécrit pas une US.

## Aller plus loin
- **`preCompact`** : écrire un script qui ajoute à `sprintdesk/resultats/journal-lot<N>.md` l'étape en cours avant le résumé automatique du contexte.
- **Hook propre à un agent** (CLI) : déclarer `hooks:` dans l'en-tête de `redacteur-backlog.agent.md` pour que le contrôle `postToolUse` ne tourne que pendant la rédaction.
- **Hook de politique** : demander à l'équipe poste de travail de déployer `protege-sources` comme hook machine, non désactivable.

> Le format évolue. Références : [hooks Copilot](https://docs.github.com/en/copilot/reference/hooks-reference) et [hooks dans VS Code](https://code.visualstudio.com/docs/agent-customization/hooks).
