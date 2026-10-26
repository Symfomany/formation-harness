# Créer une skill

## À quoi ça sert
Une skill est un **savoir-faire packagé** : une procédure, accompagnée si besoin de ressources (modèle, checklist, script). Copilot ne lit que son nom et sa description au départ, puis charge le contenu **uniquement quand la tâche correspond**. Plusieurs agents peuvent réutiliser la même skill.

Agent = *qui* agit. Skill = *comment* on fait.

## Emplacement
```
.github/skills/<nom-de-la-skill>/
├── SKILL.md          obligatoire
├── modele-us.md      ressource (optionnelle)
└── checklist.md      ressource (optionnelle)
```
Le dossier porte le même nom que le champ `name`. Activer si besoin le paramètre VS Code `chat.useAgentSkills`.

## Structure de SKILL.md
```markdown
---
name: formater-us
description: "Formate une user story SprintDesk selon le modèle cible. Utiliser pour réécrire ou contrôler le format d'une US."
---
# Skill formater-us

## Quand l'utiliser
## Procédure
## Exemple conforme / contre-exemple
```

| Champ | Rôle |
|---|---|
| `name` | Identifiant en minuscules et tirets, identique au nom du dossier |
| `description` | **Décisive** : c'est elle qui déclenche le chargement. Dire *ce que fait* la skill et *quand* l'utiliser |

## Étapes
1. Identifier un savoir-faire **répété** ou **partagé** par plusieurs agents.
2. Rédiger une `description` avec des mots que l'utilisateur emploiera (« réécrire », « contrôler le format », « US »).
3. Écrire une **procédure numérotée**, courte et vérifiable.
4. Mettre les gros contenus (modèle, checklist) dans des fichiers à côté et y faire référence par lien relatif.
5. Ajouter **un exemple conforme et un contre-exemple** (few-shot) : ici US-105 et US-104.
6. Tester : demander « contrôle le format de US-104 » et vérifier que la skill est chargée.

## Exemple : procédure formater-us
```markdown
## Procédure
1. Reprendre toutes les sections de [modele-us.md](modele-us.md), même vides.
2. Critères d'acceptation : Given / When / Then, un comportement par critère, vérifiable.
3. Information manquante ou décision ND-xx : l'écrire dans « Questions ouvertes », jamais l'inventer.
4. US déjà conforme : la recopier à l'identique et le signaler.
5. US trop volumineuse : découper en US-xxx-a, US-xxx-b avec lien vers l'US d'origine.
```

## Bonnes pratiques
- Une skill = une compétence. « formater » et « revoir » sont deux skills.
- Les règles **toujours vraies** restent dans les instructions ; la skill porte le détail.
- Préférer une checklist à un long texte : elle se vérifie ligne à ligne.

## Pièges
- Description vague → la skill n'est jamais chargée.
- Nom de dossier ≠ `name` → skill ignorée.
- Procédure qui contredit les instructions → résultats incohérents.
