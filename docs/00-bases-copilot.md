# Les bases de GitHub Copilot — pour ceux qui démarrent

> Aucun prérequis. Si vous n'avez jamais utilisé Copilot, ou si le mot « agent » ne vous dit rien, commencez ici.

## Code couleurs de ce guide

| Pastille | Signification | À retenir |
|---|---|---|
| 🔵 **Bleu** | Définition / concept | « C'est quoi ? » |
| 🟢 **Vert** | Bonne pratique / à faire | Réflexe à adopter |
| 🟡 **Jaune** | Attention / vigilance | Point qui piège souvent |
| 🔴 **Rouge** | Interdit / risque | À ne jamais faire |
| 🟣 **Violet** | Astuce avancée / bonus | Pour aller plus loin |
| 🔗 **Lien** | Documentation externe | Source officielle |

---

## 🔵 1. C'est quoi GitHub Copilot ?

🔵 **Copilot est un assistant IA intégré à votre éditeur (VS Code).** Il lit votre contexte (fichiers ouverts, dossier, consignes) et produit du texte, du code ou des modifications de fichiers à partir de ce que vous lui demandez en langage naturel.

Pas besoin d'être développeur : un PO, un Scrum Master ou un DevOps l'utilise de la même façon, avec des mots. Ici, on s'en sert pour **rédiger et relire des user stories**.

🟡 Copilot **n'est pas un moteur de vérité** : il produit une réponse *plausible*. S'il manque une information, il peut l'inventer avec aplomb. Tout l'atelier sert à l'en empêcher.

🔗 [Présentation de Copilot dans VS Code](https://code.visualstudio.com/docs/copilot/overview) · [Documentation GitHub Copilot](https://docs.github.com/en/copilot)

---

## 🔵 2. Les 4 modes du chat

Le chat Copilot se trouve dans le panneau latéral. Un sélecteur permet de choisir **comment** Copilot travaille.

| Mode | Il fait quoi ? | Il modifie vos fichiers ? | Quand l'utiliser |
|---|---|---|---|
| 🔵 **Ask** | Répond à une question | ❌ Non | Comprendre, explorer, demander un avis |
| 🟣 **Plan** | Pose des questions et construit un plan | ❌ Non (il propose) | Cadrer avant d'agir (Atelier 1) |
| 🟢 **Edit** | Modifie les fichiers que **vous** désignez | ✅ Oui, sur la sélection | Retouche ciblée |
| 🟢 **Agent** | Explore, décide des étapes, enchaîne les actions | ✅ Oui, en autonomie | Tâche multi-fichiers (Atelier 2) |

🟢 **Réflexe :** en cas de doute, démarrez en **Ask** ou **Plan** (lecture seule), passez en **Agent** seulement quand le cadre est clair.

🔗 [Mode agent dans VS Code](https://code.visualstudio.com/docs/copilot/chat/chat-agent-mode)

---

## 🔵 3. C'est quoi un « agent » ?

Imaginez un stagiaire très rapide :

- **Sans cadre** : il fonce, improvise, « améliore » tout, ne dit pas ce qu'il a fait.
- **Avec une fiche de poste** : il connaît sa mission, ses outils, ses interdits et le format de ce qu'il doit rendre.

🔵 **Un agent Copilot, c'est cette fiche de poste.** Techniquement, c'est un fichier texte `.github/agents/nom.agent.md` qui décrit :

| Élément | Question à laquelle il répond | Exemple SprintDesk |
|---|---|---|
| **Mission** | Que fait-il ? | « Diagnostiquer les US, sans les réécrire » |
| **Outils** | De quoi dispose-t-il ? | lire, chercher (pas de suppression) |
| **Interdits** | Que ne décide-t-il pas ? | Ne pas inventer de règle métier |
| **Sortie** | Qu'est-ce qu'il rend ? | Un tableau de revue dans `revue.md` |

🔵 **Mode Agent ≠ agent personnalisé.**
- Le **mode Agent** = la capacité de Copilot à agir seul (lire, modifier, lancer des commandes).
- Un **agent personnalisé** = un rôle précis que vous avez défini (Reviewer, Rédacteur…) et que vous choisissez dans la liste.

🟢 **Pourquoi plusieurs agents ?** Séparer les rôles : le *Reviewer* constate, **l'humain décide**, le *Rédacteur* applique. Un seul agent qui juge *et* corrige se valide lui-même.

🔗 [Agents personnalisés](https://code.visualstudio.com/docs/copilot/customization/custom-agents)

---

## 🔵 4. Les briques de personnalisation (le « harness »)

*Harness* = le harnais : tout ce qui encadre Copilot pour qu'il travaille comme vous l'attendez.

| Brique | Analogie | Fichier | Chargée quand ? |
|---|---|---|---|
| 📏 **Instructions** | Le règlement intérieur | `.github/copilot-instructions.md` | Toujours |
| 🧑‍💼 **Agent** | La fiche de poste | `.github/agents/*.agent.md` | Quand on le sélectionne |
| 🧰 **Skill** | Le mode d'emploi / la boîte à outils | `.github/skills/<nom>/SKILL.md` | Quand la tâche correspond |
| ⚡ **Prompt** | Le raccourci | `.github/prompts/*.prompt.md` | Quand on tape `/nom` |

🟢 **Règle d'or :** ce qui doit *toujours* être vrai → instructions. Le reste : **qui** → agent, **comment** → skill.

🔗 [Instructions personnalisées](https://code.visualstudio.com/docs/copilot/customization/custom-instructions) · [Agent Skills](https://code.visualstudio.com/docs/copilot/customization/agent-skills) · [Fichiers de prompt](https://code.visualstudio.com/docs/copilot/customization/prompt-files)

---

## 🔵 5. Vocabulaire express

| Mot | Sens simple |
|---|---|
| **Prompt** | Ce que vous écrivez à Copilot |
| **Contexte** | Ce que Copilot « voit » (fichiers, sélection, instructions) |
| **Fenêtre de contexte** | Sa mémoire de travail : limitée, elle se remplit au fil de la conversation |
| **Hallucination** | Réponse plausible mais inventée |
| **Outil (tool)** | Action possible : lire un fichier, chercher, éditer, lancer une commande |
| **Handoff** | Bouton qui passe la main d'un agent à un autre |
| **`#fichier` / `@`** | Raccourcis pour ajouter un fichier ou un participant au contexte |
| **Modèle** | Le « cerveau » utilisé (choisi dans le sélecteur) |

---

## 🟢 6. Écrire un bon prompt

Un bon prompt répond à 5 questions :

1. 🎯 **Objectif** : que voulez-vous obtenir ?
2. 📎 **Contexte** : sur quels fichiers / règles s'appuyer ? (`#fichier`)
3. 🚧 **Contraintes** : ce qu'il ne doit pas faire
4. 📐 **Format** : tableau, liste, gabarit, fichier de sortie
5. ✅ **Critère de réussite** : comment saurez-vous que c'est bon ?

| ❌ Prompt vague | ✅ Prompt exploitable |
|---|---|
| « Améliore cette US » | « Relis `#US-101.md` avec les règles de `#regles-metier.md`. Ne réécris rien. Liste les défauts dans un tableau (défaut / preuve / question ouverte). Si une règle manque, signale-le au lieu de l'inventer. » |

🟢 **Astuce :** demandez-lui d'abord de **vous poser des questions** avant d'agir. Un bon plan vaut mieux que dix corrections.

🔗 [Ingénierie de prompt (GitHub)](https://docs.github.com/en/copilot/concepts/prompting/prompt-engineering) · [Bonnes pratiques Copilot](https://docs.github.com/en/copilot/get-started/best-practices)

---

## 🟢 7. Les bons réflexes

- 🟢 **Une tâche = une conversation.** Nouveau sujet → nouveau chat (le contexte reste propre).
- 🟢 **Avancer par petites étapes** et relire chaque résultat.
- 🟢 **Exiger la traçabilité** : « cite le fichier et la règle qui justifient chaque point ».
- 🟢 **Séparer faits / propositions / questions** dans les sorties.
- 🟢 **Changer un seul élément à la fois** (instruction, agent ou skill) avant de rejouer, pour savoir ce qui a marché.
- 🟢 **Versionner** (git) avant de laisser un agent modifier plusieurs fichiers : annuler devient trivial.
- 🟢 **Garder des instructions courtes et concrètes** : un fichier de 3 pages n'est pas mieux respecté qu'un de 20 lignes.
- 🟢 **Demander « qu'as-tu vérifié ? »** : un agent qui n'explique pas ce qu'il a contrôlé est suspect.

## 🟡 8. Les pièges classiques

- 🟡 **« Il a l'air sûr de lui »** ≠ « il a raison ». Relisez, surtout les chiffres, les règles et les références.
- 🟡 **Trop d'outils = trop de dérives.** Donnez à un agent le minimum nécessaire.
- 🟡 **Trop de consignes contradictoires** : il en suit une au hasard. Relisez vos instructions.
- 🟡 **Conversation trop longue** : le début est « oublié ». Résumez ou repartez à zéro.
- 🟡 **Description d'agent / skill floue** : Copilot ne saura pas quand l'utiliser. Écrivez *quand* l'activer.
- 🟡 **Modèle ou interface qui évoluent** : les noms de menus et options changent souvent. Vérifiez la doc à jour.
- 🟡 **Résultats non déterministes** : deux essais identiques peuvent différer. Comparez sur plusieurs essais.

## 🔴 9. Les interdits

- 🔴 **Ne jamais coller** de données sensibles (mots de passe, clés, données personnelles de locataires, informations confidentielles) dans un prompt ou un fichier de contexte.
- 🔴 **Ne jamais publier / valider sans relecture humaine** : décisions métier et mises en production restent humaines.
- 🔴 **Ne pas laisser l'agent inventer** une règle, un chiffre ou une décision (`ND-xx`) : une question ouverte vaut mieux qu'une réponse fausse.
- 🔴 **Ne pas accepter en bloc** (« Keep all ») des modifications sans les avoir parcourues.
- 🔴 **Ne pas donner un outil de publication / suppression** à un agent sans validation explicite.

## 🟣 10. Pour aller plus loin

- 🟣 **Handoffs** : enchaînez Reviewer → Rédacteur avec un bouton, la validation humaine restant entre les deux.
- 🟣 **Skills réutilisables** : un même savoir-faire (format d'US, checklist) partagé par plusieurs agents, sans copier-coller.
- 🟣 **Instructions ciblées** : `.github/instructions/*.instructions.md` avec un motif de fichiers (`applyTo`) pour des règles propres à un dossier.
- 🟣 **Évaluer avec des critères** : définissez à l'avance ce qu'est une « bonne » sortie, puis comparez (voir [07-evaluation.md](07-evaluation.md)).
- 🟣 **Standard ouvert Agent Skills** : format de skills portable entre outils.

🔗 [agentskills.io](https://agentskills.io) · [Customisation de Copilot dans VS Code](https://code.visualstudio.com/docs/copilot/customization/overview)

---

## 🔗 Liens utiles regroupés

| Sujet | Lien |
|---|---|
| Doc officielle GitHub Copilot | https://docs.github.com/en/copilot |
| Copilot dans VS Code (vue d'ensemble) | https://code.visualstudio.com/docs/copilot/overview |
| Instructions personnalisées | https://code.visualstudio.com/docs/copilot/customization/custom-instructions |
| Agents personnalisés | https://code.visualstudio.com/docs/copilot/customization/custom-agents |
| Agent Skills | https://code.visualstudio.com/docs/copilot/customization/agent-skills |
| Fichiers de prompt | https://code.visualstudio.com/docs/copilot/customization/prompt-files |
| Mode Agent | https://code.visualstudio.com/docs/copilot/chat/chat-agent-mode |
| Ingénierie de prompt | https://docs.github.com/en/copilot/concepts/prompting/prompt-engineering |
| Bonnes pratiques | https://docs.github.com/en/copilot/get-started/best-practices |

> 🟡 Ces URL peuvent changer : la documentation Copilot évolue vite. Si un lien est cassé, repartir de https://docs.github.com/en/copilot ou de la recherche de la doc VS Code.

**Suite du parcours :** [01-instructions.md](01-instructions.md) → [02-plan.md](02-plan.md) → [03-architecture-agents.md](03-architecture-agents.md)
