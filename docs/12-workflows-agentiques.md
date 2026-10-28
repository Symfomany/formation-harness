# Bonus 12 — Workflows agentiques et GitHub Actions

## À quoi ça sert
Jusqu'ici, les agents travaillent dans VS Code, sous vos yeux. Ce bonus passe sur GitHub : des agents qui travaillent **en arrière-plan**, et des contrôles automatiques qui décident si leur travail peut entrer dans `main`.

Tous les fichiers de ce guide sont déjà dans le dépôt. Ils ne s'exécutent que lorsque le dépôt est poussé sur GitHub, après validation humaine.

| Fichier | Rôle |
|---|---|
| `.github/workflows/copilot-setup-steps.yml` | Prépare l'environnement de Copilot cloud agent |
| `.github/workflows/controle-backlog.yml` | Contrôles requis avant fusion : politique, format, tests |
| `.github/workflows/rollback-backlog.yml` | Annule un commit par son SHA, via une PR |
| `.github/workflows/publication-backlog.yml` | Publie le backlog après approbation de l'environnement `publication` |
| `.github/workflows/triage-demande.md` | Workflow agentique : pré-qualifie une demande déposée en issue |
| `.github/workflows/revue-pr-backlog.md` | Workflow agentique : relit une PR de backlog, commente sans approuver |
| `.github/CODEOWNERS` | Revue obligatoire des fichiers sensibles |
| `.github/scripts/*.cjs` | Contrôles déterministes partagés par la CI et les hooks |

---

## 1. La carte : qui s'exécute où ?
| Mécanisme | Déclencheur | Qui agit | Peut écrire ? |
|---|---|---|---|
| Workflow GitHub Actions classique | Événement (push, PR, manuel) | Un script, pas d'IA | Selon `permissions:` |
| Copilot cloud agent | Issue assignée à Copilot, `@copilot` dans une PR, panneau Agents | L'agent, dans un environnement Actions éphémère | Une seule branche, une PR brouillon |
| `copilot-setup-steps.yml` | Démarrage d'une tâche de cloud agent | Des étapes de préparation | Non (lecture) |
| GitHub Agentic Workflows (`gh aw`) | Événement GitHub | Un agent en **lecture seule** ; les écritures passent par des *safe outputs* | Seulement via les sorties autorisées |
| Copilot CLI dans Actions | Étape `copilot -p "..."` d'un workflow | La CLI, outils autorisés un par un | Selon `--allow-tool` et le jeton |
| Automations Copilot | Planification ou événement, définies dans l'onglet Agents | Cloud agent, au nom du créateur | Comme cloud agent |

---

## 2. Pas à pas

### Étape 1 — Préparer l'environnement du cloud agent
Ouvrir `.github/workflows/copilot-setup-steps.yml`. Règles à retenir :

| Règle | Conséquence |
|---|---|
| Un seul job nommé exactement `copilot-setup-steps` | Un autre nom : le fichier est ignoré |
| Le fichier doit être sur la branche par défaut | Sur une branche de travail, il ne s'applique pas encore |
| Clés prises en compte : `steps`, `permissions`, `runs-on`, `services`, `snapshot`, `timeout-minutes` | Toute autre clé est ignorée sans erreur |
| `timeout-minutes` : 59 maximum | Une tâche de cloud agent dure 59 minutes au plus |
| Une étape échoue | Les suivantes sont sautées, **l'agent démarre quand même** |
| `fetch-depth` imposé par Copilot | Il garde l'historique pour pouvoir revenir sur ses propres commits |
| Runners : Ubuntu x64 ou Windows 64 bits | Pas de macOS |

Ici, il installe Node.js (nécessaire aux hooks) et lance `tester-harness.cjs`. Les déclencheurs `push` et `pull_request` filtrés sur le fichier lui-même permettent de tester une modification avant fusion.

### Étape 2 — Les contrôles requis (« les tests passent »)
`.github/workflows/controle-backlog.yml` lance trois jobs sur chaque PR :

| Check (nom du job) | Ce qu'il vérifie | Script |
|---|---|---|
| `Politique - sources protégées` | Aucune modification de `entree/` ; `contexte/` seulement avec le label `decision-referent` | `verifier-sources.cjs` |
| `Format des US de sortie` | Toutes les US de `sortie/` respectent le modèle | `verifier-us.cjs` |
| `Tests du harness` | Scripts et hooks se comportent comme prévu | `tester-harness.cjs` |

Pour qu'ils **bloquent** la fusion : *Settings > Rules > Rulesets*, nouveau ruleset sur la branche par défaut :
1. *Require a pull request before merging* : 1 approbation minimum, *Require review from Code Owners*.
2. *Require status checks to pass* : ajouter les trois checks par leur nom.
3. *Block force pushes* et *Restrict deletions*.

Trois pièges à connaître :
- **Filtre `paths` sur un check requis** : si le workflow ne démarre pas, le check reste « en attente » et la PR est bloquée. D'où l'absence de filtre ici.
- **Job sauté = succès** : `politique-sources` est sauté sur `push`, ce n'est pas un échec.
- **Label et sécurité** : n'importe qui ayant le rôle *triage* peut poser un label. Le label `decision-referent` ne suffit pas seul : la revue Code Owners de `sprintdesk/contexte/` est la vraie barrière.

### Étape 3 — Protéger la configuration des agents
`.github/CODEOWNERS` désigne les propriétaires des fichiers qui changent le comportement des agents : instructions, agents, skills, hooks, scripts, workflows. Avec *Require review from Code Owners*, un agent (ou un humain) qui modifie ces fichiers doit obtenir leur approbation.

Remplacer les équipes d'exemple (`@habiouest/...`) par de vraies équipes avant d'activer la règle.

### Étape 4 — Le parcours d'une PR ouverte par Copilot
Exemple : une issue « Réécrire le lot 2 selon le plan approuvé » est assignée à Copilot.

| # | Étape | Qui | Garde-fou |
|---|---|---|---|
| 1 | Assignation de l'issue | Humain avec accès en écriture | Les commentaires de personnes sans accès en écriture ne sont jamais transmis à l'agent |
| 2 | Préparation | `copilot-setup-steps` | Node.js installé, tests du harness |
| 3 | Travail | Cloud agent sur une branche `copilot/...` | Hooks `.github/hooks/`, pare-feu, une seule branche |
| 4 | PR **brouillon** | Cloud agent | Il ne peut pas la passer en « prête », ni l'approuver, ni la fusionner |
| 5 | Lancement des workflows | Humain : **Approve and run workflows** | Par défaut, aucun workflow ne tourne sur le code de l'agent sans ce clic |
| 6 | Checks requis | Actions | Politique, format, tests |
| 7 | Revue | Un humain **autre** que celui qui a demandé la tâche | Le demandeur ne peut pas approuver ; une approbation de plus est exigée si la PR n'est attribuée à personne |
| 8 | Fusion | Humain | Ruleset |
| 9 | Publication | `publication-backlog.yml` | Approbation de l'environnement `publication` |

Les commits de l'agent sont signés, ont Copilot comme auteur et le demandeur comme co-auteur, et leur message pointe vers le journal de session.

### Étape 5 — Revenir en arrière par SHA
Cas : la PR du lot 2 a été fusionnée, puis on découvre qu'une US tranche ND-04.

1. Retrouver le SHA du commit fautif (historique de `main`, ou colonne « Commit » du journal d'exécution).
2. *Actions > Rollback backlog (revert par SHA) > Run workflow* : SHA complet (40 caractères) et motif.
3. Le workflow vérifie le format du SHA, vérifie qu'il appartient à `main`, crée une branche `rollback/...`, applique `git revert` (avec `-m 1` pour un commit de fusion) et ouvre une PR brouillon.
4. Revue et checks requis comme pour toute PR, puis fusion.

| Pourquoi `revert` et pas `reset` ? | |
|---|---|
| `git revert` | Ajoute un commit qui annule. Historique intact, audit possible, et le revert est lui-même annulable. |
| `git reset --hard` + `push --force` | Réécrit l'historique partagé : commits perdus pour les autres, audit cassé. Bloqué par le ruleset. |

Limite : une PR créée avec `GITHUB_TOKEN` ne déclenche pas les workflows `pull_request`. Pour faire tourner les checks requis, un humain pousse un commit sur la branche (ou ferme et rouvre la PR), ou l'on utilise le jeton d'une GitHub App.

### Étape 6 — Publier, et republier une version saine
`publication-backlog.yml` s'exécute après chaque fusion qui touche `sprintdesk/backlog/sortie/` :
1. Job `controler` : vérifie le format, empaquette le backlog.
2. Job `publier` : attend l'**approbation de l'environnement** `publication`, puis crée une release.

Configurer l'environnement (*Settings > Environments > publication*) : *Required reviewers* (référent produit), *Prevent self-review*, branches autorisées : `main` uniquement.

Rollback d'une publication : relancer le workflow à la main avec le SHA d'une version saine. On republie un état connu ; on ne touche pas à l'historique.

### Étape 7 — Les workflows agentiques (GitHub Agentic Workflows)
Un workflow agentique est un fichier Markdown : un en-tête YAML (déclencheur, droits, outils, sorties autorisées) et des consignes en langage naturel. On le compile en workflow Actions :
```bash
gh extension install github/gh-aw
gh aw compile          # produit .github/workflows/triage-demande.lock.yml
```
On versionne **les deux** fichiers : le `.md` (lisible) et le `.lock.yml` (exécuté).

Le principe de sécurité : **l'agent ne peut rien écrire lui-même**. Il travaille avec des droits en lecture et produit des demandes d'écriture (*safe outputs*). Un job séparé, aux droits limités, les applique si elles respectent les règles.

Lecture de `triage-demande.md` :
| Ligne | Effet |
|---|---|
| `permissions: contents: read, issues: read` | L'agent lit, n'écrit pas |
| `add-comment: max: 1` | Au plus un commentaire |
| `add-labels: allowed: [...]` | Seuls ces labels sont possibles. Aucun label de priorité : **RM-05** est imposée par la configuration, pas seulement par la consigne |
| `noop` | L'agent doit le signaler quand il n'y a rien à faire : un silence n'est jamais ambigu |
| `staged: true` | Mode aperçu : les sorties sont affichées dans le résumé du run, rien n'est écrit. À retirer après validation humaine |

Lecture de `revue-pr-backlog.md` : `submit-pull-request-review` avec `allowed-events: [COMMENT]`. L'agent commente, il **n'approuve jamais**. L'approbation reste humaine.

### Étape 8 — Alternative : Copilot CLI dans une étape Actions
Pour un besoin ponctuel (ex. résumé quotidien des US modifiées) :
```yaml
- run: npm install -g @github/copilot
- env:
    COPILOT_GITHUB_TOKEN: ${{ secrets.COPILOT_CLI_TOKEN }}   # PAT fin avec la permission « Copilot Requests »
  run: |
    copilot -p "Résume les US modifiées aujourd'hui dans sprintdesk/backlog/sortie/ dans resume.md" \
      --allow-tool='shell(git:*)' --allow-tool=write --no-ask-user
    cat resume.md >> "$GITHUB_STEP_SUMMARY"
```
| Option | Rôle |
|---|---|
| `-p` | Mode programmatique : un prompt, puis fin |
| `--allow-tool='shell(git:*)'` | Seules les commandes `git` sont autorisées |
| `--allow-tool=write` | Écriture de fichiers sur le runner |
| `--no-ask-user` | Aucune question : personne pour répondre |

GitHub recommande les workflows agentiques pour la plupart des automatisations : garde-fous intégrés, `GITHUB_TOKEN` par défaut.

### Étape 9 — Donner des outils externes au cloud agent (MCP)
Dans les *Settings* du dépôt, section Copilot (cloud agent), configuration MCP en JSON :
```json
{
  "mcpServers": {
    "referentiel-habiouest": {
      "type": "http",
      "url": "https://mcp.exemple-habiouest.fr/mcp",
      "headers": { "Authorization": "Bearer $COPILOT_MCP_REFERENTIEL_TOKEN" },
      "tools": ["lire_service", "lister_agences"]
    }
  }
}
```
| Règle | Pourquoi |
|---|---|
| `tools` : liste explicite d'outils en lecture | Le cloud agent utilise les outils MCP **sans demander d'approbation** |
| Secrets préfixés `COPILOT_MCP_`, dans les secrets *Agents* | Seuls ces secrets sont visibles par la configuration MCP |
| Vérifier dans le journal de session, étape « Start MCP Servers » | C'est là qu'on voit les outils réellement chargés |
| Le serveur MCP GitHub intégré est en lecture seule, sur le dépôt courant | L'élargir demande un jeton dédié, avec le minimum de droits |

---

## Checklist
- [ ] `copilot-setup-steps.yml` est sur `main`, avec un job `copilot-setup-steps`.
- [ ] Les trois checks de « Contrôle backlog » sont requis dans un ruleset.
- [ ] *Require review from Code Owners* est activé, avec de vraies équipes dans `CODEOWNERS`.
- [ ] L'environnement `publication` a des approbateurs et interdit l'auto-approbation.
- [ ] Les workflows agentiques sont compilés et testés en `staged: true` avant activation.
- [ ] Aucun secret dont l'agent n'a pas besoin n'est dans les secrets *Agents*.

## Pièges
- **Croire que la PR de Copilot est testée** : sans « Approve and run workflows », aucun check n'a tourné.
- **Approuver sa propre demande** : impossible ; prévoir un second relecteur.
- **Donner `contents: write` à tout le workflow** : déclarer les droits par job, au plus juste.
- **Interpoler `${{ inputs.x }}` dans un `run:`** : injection de commande possible. Passer par `env:`.
- **Oublier le `.lock.yml`** : un workflow agentique non compilé ne s'exécute pas.
- **Laisser `staged: true` sans le dire** : l'équipe croit que le triage fonctionne alors que rien n'est écrit.

> Références : [environnement du cloud agent](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/customize-the-agent-environment), [risques et protections du cloud agent](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/risks-and-mitigations), [serveurs MCP du dépôt](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/configure-mcp-servers), [Copilot CLI dans Actions](https://docs.github.com/en/copilot/how-tos/copilot-cli/automate-copilot-cli/automate-with-actions), [GitHub Agentic Workflows](https://github.github.com/gh-aw/).
