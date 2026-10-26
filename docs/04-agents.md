# Créer un agent personnalisé

## À quoi ça sert
Un agent personnalisé est un **rôle** : une mission, des outils autorisés, des interdits et un format de sortie. On le sélectionne dans la liste des agents du chat Copilot (à côté de Ask / Edit / Agent / Plan).

Séparer les rôles évite qu'un même agent diagnostique *et* corrige à sa façon : le Reviewer constate, l'humain décide, le Rédacteur applique.

## Emplacement
`.github/agents/<nom>.agent.md` — un fichier par agent.
(Création rapide : palette de commandes → « Chat: New Custom Agent ».)

## Structure du fichier
```markdown
---
description: "Ce que fait l'agent et quand l'utiliser (une phrase)."
tools: ['read', 'search', 'edit']
# model: optionnel, modèle à utiliser
# handoffs: optionnel, bouton pour passer la main à un autre agent
---
# Nom de l'agent

## Mission
## Entrées
## Interdits
## Sortie attendue
```

| Champ | Rôle |
|---|---|
| `description` | Affichée dans le sélecteur ; aide aussi à choisir l'agent comme sous-agent |
| `tools` | Liste **limitative** des outils. Moins d'outils = moins de dérives |
| `model` | (Optionnel) modèle imposé |
| `handoffs` | (Optionnel) enchaînement proposé vers un autre agent |

## Étapes
1. Définir la **mission en une phrase** (verbe + livrable).
2. Choisir les **outils minimaux** : un reviewer n'a pas besoin de `runCommands`, aucun agent n'a besoin d'un outil de publication sans validation.
3. Écrire les **interdits** explicites (ce que l'agent ne décide pas).
4. Fixer le **format de sortie** (gabarit) et le **fichier de destination**.
5. Citer les **skills** à appliquer plutôt que recopier leur contenu.
6. Tester sur une US connue (ex. US-105, déjà correcte) : l'agent doit répondre « aucune action ».

## Exemple : Reviewer
```markdown
---
description: "Relit des user stories SprintDesk et produit une revue sans les réécrire."
tools: ['read', 'search', 'edit']
handoffs:
  - label: Passer au rédacteur
    agent: redacteur-backlog
    prompt: Réécris les US à partir de sprintdesk/resultats/revue.md et des décisions du groupe.
---
# Reviewer backlog

## Mission
Diagnostiquer les US de `sprintdesk/backlog/entree/lot<N>/` en appliquant la skill `revue-agilite`.

## Interdits
- Ne réécris aucune US.
- Ne tranche aucune décision ND-xx : formule une question métier.

## Sortie
Un bloc par constat dans `sprintdesk/resultats/revue.md` :
US concernée / Constat / Règle concernée / Gravité / Question métier / Recommandation.
```

## Bonnes pratiques
- Un agent = un livrable. S'il en produit trois, le découper.
- Le **point de validation humaine** se place entre deux agents (handoff), pas à l'intérieur.
- Écrire dans un fichier plutôt que dans le chat : le résultat devient traçable et relisible.

## Pièges
- Donner `edit` à un agent censé ne rien modifier dans le backlog → limiter par consigne *et* vérifier dans la revue.
- Description trop générique → l'agent est mal choisi quand il est appelé comme sous-agent.
