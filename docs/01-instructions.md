# Créer des instructions

## À quoi ça sert
Les instructions sont du contexte ajouté **automatiquement** à chaque requête Copilot. Elles portent les règles communes à tous les agents : sources de référence, interdits, conventions de sortie.

## Dans l'atelier 1 : exprimer clairement le contexte du projet
Le premier exercice n'est pas technique : c'est de **dire clairement** à Copilot où il travaille. Des instructions claires répondent à quatre questions :
| Question | Exemple SprintDesk |
|---|---|
| Quel est le projet et son but ? | Centraliser, qualifier, prioriser et suivre les demandes métier |
| Quelles sont les sources de vérité ? | `produit.md`, `regles-metier.md` |
| Qu'est-ce qui est interdit ? | Inventer une décision (`ND-xx`), publier sans validation |
| Quelle forme doivent avoir les réponses ? | Faits / propositions / questions ouvertes ; identifiants US conservés |

Ces instructions servent ensuite de base à **tous** les prompts et à tous les agents : [02-plan.md](02-plan.md) s'appuie dessus.

## 📝 Consigne : créer le fichier d'instructions de votre projet
**À faire en premier, avant tout prompt de plan.** Chaque groupe crée (ou complète) `.github/copilot-instructions.md`.

1. Lire `produit.md` et `regles-metier.md`.
2. Remplir les `TODO` du squelette en répondant aux 4 questions du tableau ci-dessus.
3. Ajouter une section **Documentation** : une ligne par fichier de référence, avec *quand* le consulter.
4. Ajouter au moins **un exemple** de bon résultat (voir ci-dessous) : un exemple vaut mieux que trois règles.
5. Tester : ouvrir un nouveau chat, demander « Quelles règles dois-tu respecter sur ce projet ? » et vérifier que `copilot-instructions.md` apparaît dans les références.

Livrable : un fichier de moins d'une page, relu par le groupe.

### Exemple complet (documentation + exemple de sortie)
```markdown
# Instructions communes — SprintDesk

## Contexte
SprintDesk centralise, qualifie, priorise et suit les demandes métier de HabiOuest.
Nous transformons un backlog d'US imparfaites en backlog exploitable.

## Documentation (sources de vérité)
| Fichier | Quand le consulter |
|---|---|
| `sprintdesk/contexte/produit.md` | Pour comprendre le produit et les acteurs |
| `sprintdesk/contexte/regles-metier.md` | Avant toute règle : RM-xx validées, ND-xx non décidées |
| `sprintdesk/backlog/entree/lot<N>/` | Les US à traiter (lecture seule) |
| `PLAN.md` | Le plan validé du groupe : il prime sur toute improvisation |

## Règles
- N'invente aucune règle : une décision ND-xx reste une question ouverte.
- Conserve l'identifiant US-xxx et cite la règle RM-xx utilisée.
- Distingue : Faits / Propositions / Questions ouvertes.
- Si une US est correcte, laisse-la inchangée et dis-le.
- Ne publie rien sans validation humaine.
- Indique les contrôles réellement exécutés.

## Exemple de réponse attendue
> **US-1xx** — Faits : l'US ne précise pas qui voit la liste (aucune règle RM). 
> Proposition : limiter la vue au demandeur et au Qualificateur (à valider).
> Question ouverte : ND-05, tri par défaut non décidé.
> Contrôles : relu contre RM-01 à RM-08 ; critères d'acceptation non vérifiés par un test.

## Où trouver les détails
- Format d'une US : skill `formater-us`.
- Méthode de revue : skill `revue-agilite`.
```

## Deux niveaux

| Fichier | Portée |
|---|---|
| `.github/copilot-instructions.md` | Tout le dépôt, toutes les conversations |
| `.github/instructions/<nom>.instructions.md` | Seulement les fichiers correspondant au motif `applyTo` |

Activer si besoin dans VS Code : paramètre `github.copilot.chat.codeGeneration.useInstructionFiles` (activé par défaut).

## Étapes
1. Ouvrir `.github/copilot-instructions.md` (ou le créer).
2. Lister les **références** : fichiers de contexte à lire.
3. Écrire des **règles courtes, impératives et vérifiables** (une par ligne).
4. Renvoyer vers les skills pour le détail (ne pas tout recopier ici).
5. Tester : poser une question à Copilot et vérifier dans « Références » que le fichier est bien utilisé.

## Exemple SprintDesk
```markdown
# Instructions communes — SprintDesk

## Références
- Contexte produit : `sprintdesk/contexte/produit.md`
- Règles métier : `sprintdesk/contexte/regles-metier.md`

## Règles
- N'invente aucune règle ni décision métier : une décision ND-xx reste une question ouverte.
- Conserve l'identifiant US-xxx et cite l'US d'origine.
- Distingue explicitement : Faits / Propositions / Questions ouvertes.
- Si une US est correcte, laisse-la inchangée et dis-le.
- Ne publie rien vers un service externe sans validation humaine.
- Indique les contrôles réellement exécutés (et ceux qui ne l'ont pas été).

## Où trouver les détails
- Format d'une US : skill `formater-us`.
- Méthode de revue : skill `revue-agilite`.
```

## Instructions ciblées (optionnel)
```markdown
---
applyTo: "sprintdesk/backlog/sortie/**/*.md"
---
Chaque US produite respecte le modèle de la skill `formater-us`.
Les critères d'acceptation sont au format Given / When / Then.
```

## Bonnes pratiques
- **Court** : ce fichier est envoyé à chaque requête ; au-delà d'une page, déplacer dans une skill.
- **Positif et précis** : « cite la règle RM-xx » plutôt que « sois rigoureux ».
- **Pas de procédure longue** : c'est le rôle d'une skill.
- **Pas de garantie** : une instruction peut être ignorée ; ce qui doit être vérifié se contrôle lors de la relecture humaine.

## Pièges
- Contradiction entre instructions et agent → le modèle arbitre au hasard. Garder une seule source de vérité.
- Règles vagues (« fais de bonnes US ») → aucun effet mesurable.
