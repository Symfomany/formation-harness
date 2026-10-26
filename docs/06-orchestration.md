# Assembler le harness

## Le workflow cible
```
PLAN.md (validé par le groupe)
   │
   ▼
Agent Reviewer ── skill revue-agilite ──► resultats/revue.md
   │
   ▼
Décisions du groupe (humain) : ce qui est tranché / ce qui reste ND-xx
   │
   ▼
Agent Rédacteur ── skill formater-us ──► backlog/sortie/lot<N>/US-xxx.md
   │                                     resultats/synthese-actions.md
   ▼
Hook PostToolUse ── verifier_backlog.py ──► resultats/rapport-structure.md
   │
   ▼
Relecture humaine (pertinence métier, aucune décision inventée)
```
Les instructions communes s'appliquent à chaque étape.

## Ordre de construction conseillé
1. **Instructions** : poser les règles communes.
2. **Skills** : formaliser le *comment* (modèle d'US, checklist de revue).
3. **Agents** : définir les rôles qui appliquent ces skills.
4. **Hook** : brancher le contrôle automatique.
5. **Exécuter** sur une US correcte (doit rester inchangée) puis sur une US défectueuse.

## Vérifier que le harness fonctionne
| Test | Résultat attendu |
|---|---|
| US déjà correcte | « aucune action », fichier recopié à l'identique |
| US touchant une décision ND-xx | Question ouverte, pas de règle inventée |
| US trop volumineuse | Découpage avec identifiants dérivés et lien vers l'origine |
| Fichier de sortie mal structuré | Signalé par le rapport de structure |

## Boucle d'amélioration
1 défaut → 1 cause → **1 seule** modification (plan, instructions, agent ou skill) → rejouer → vérifier l'absence de régression. Consigner dans `sprintdesk/resultats/ANALYSE.md`.
