---
description: "Relecture automatique d'une PR qui modifie le backlog de sortie : commente sans jamais approuver ni demander de modifications bloquantes."
on:
  pull_request:
    types: [opened, synchronize]
    paths:
      - sprintdesk/backlog/sortie/**
permissions:
  contents: read
  pull-requests: read
engine: copilot
tools:
  github:
    toolsets: [pull_requests, repos]
safe-outputs:
  staged: true            # aperçu sans écriture : retirer après validation humaine du comportement
  submit-pull-request-review:
    allowed-events: [COMMENT]   # jamais APPROVE : l'approbation reste humaine
    max: 1
  noop:
timeout-minutes: 15
---

# Relecture d'une PR de backlog SprintDesk

Tu relis la PR #${{ github.event.pull_request.number }}, qui modifie des user stories de `sprintdesk/backlog/sortie/`.

## Méthode
1. Pour chaque US modifiée, retrouve l'US d'origine dans `sprintdesk/backlog/entree/` (même identifiant, ou identifiant d'origine pour une US découpée).
2. Applique la grille de `.github/skills/revue-agilite/checklist.md`.
3. Vérifie qu'aucune décision non prise (ND-01 à ND-06 de `sprintdesk/contexte/regles-metier.md`) n'a été tranchée et qu'aucune règle absente du contexte n'a été inventée.
4. Rédige une seule revue de type COMMENT : tableau US / constat / règle / gravité, puis questions ouvertes.

## Limites
- Le format est déjà contrôlé par le check « Format des US de sortie » : ne le recopie pas, concentre-toi sur le sens.
- Tu n'approuves jamais et tu ne bloques jamais : la décision de fusion reste humaine.
- Si la PR ne contient aucune US, appelle `noop`.
