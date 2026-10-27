# Synthèse des actions — lots 1 à 4

Légende : **Créé** (nouveau fichier issu d'un découpage) · **Modifié** (réécrite) · **Inchangé** (copie identique) · **Bloqué** (livrée avec critères provisoires, décision manquante).

## Lot 1 — Dépôt des demandes
| US d'origine | Action | Fichier(s) de sortie | Décision(s) en attente |
|---|---|---|---|
| US-101 | Modifié | US-101 | Définition de « simple » |
| US-102 | Découpé | US-102-a (Créé), -b (Créé), -c (Créé), -d (**Bloqué** ND-02), -e (**Bloqué** ND-03) | Statut d'un brouillon vs RM-02 ; modèles ; format d'import ; ND-02 ; ND-03 |
| US-103 | Modifié | US-103 | RM-01 appliquée ; assouplissement du titre ? ; service depuis profil ? |
| US-104 | Modifié | US-104 | ND-03 |
| US-105 | **Inchangé** | US-105 | — |

## Lot 2 — Qualification et priorisation
| US d'origine | Action | Fichier(s) de sortie | Décision(s) en attente |
|---|---|---|---|
| US-201 | Modifié | US-201 | Définition de « bien » ; doublon avec US-205 |
| US-202 | Découpé | US-202-a (Créé), -b (**Bloqué**, contredit RM-04), -c (**Bloqué** SLA), -d (**Bloqué** ND-01/ND-03), -e (**Bloqué** SLA), -f (**Bloqué** IA) | Matrice paramétrable ; SLA ; escalade ; reporting ; IA ; ND-01 ; ND-03 |
| US-203 | Modifié | US-203 | RM-05 appliquée ; ajustement manuel par le Qualificateur ? |
| US-204 | Modifié | US-204 | ND-05 ; ordre secondaire |
| US-205 | **Inchangé** | US-205 | — |

## Lot 3 — Traitement des demandes
| US d'origine | Action | Fichier(s) de sortie | Décision(s) en attente |
|---|---|---|---|
| US-301 | Modifié | US-301 | Mesure de « rapidement » |
| US-302 | Découpé | US-302-a (Créé), -b (**Bloqué** ND-04), -c (Créé, mentions liées à ND-03), -d (**Bloqué** ND-03) ; affectation → US-303, statut → US-305, historique → US-304 | Délégation = réaffectation ? ; ND-04 ; ND-06 ; ND-03 |
| US-303 | Modifié | US-303 | RM-07 appliquée ; travail en équipe ? |
| US-304 | Modifié | US-304 | Ordre d'affichage |
| US-305 | **Inchangé** | US-305 | — |

## Lot 4 — Pilotage du backlog
| US d'origine | Action | Fichier(s) de sortie | Décision(s) en attente |
|---|---|---|---|
| US-401 | Modifié | US-401 | Indicateurs « utiles » |
| US-402 | Découpé | US-402-a (Créé), -b (Créé), -c (**Bloqué** indicateurs), -d (**Bloqué** ND-01), -e (Créé), -f (**Bloqué** ND-03) | ND-01 ; ND-03 ; contenu des exports ; filtres partagés ? |
| US-403 | Modifié (**Bloqué** ND-01) | US-403 | ND-01 ; alerte P1 immédiate |
| US-404 | Modifié | US-404 | ET/OU ; sélection multiple |
| US-405 | **Inchangé** | US-405 | — |

## Bilan
- 20 US d'origine → **37 fichiers** de sortie (4 inchangés, 12 modifiés, 4 découpées en 21 US).
- Décisions non prises rencontrées : ND-01, ND-02, ND-03, ND-04, ND-05, ND-06 (toutes en questions ouvertes, aucune valeur proposée).
- Règles validées appliquées en cas de contradiction : RM-01 (US-103), RM-04 et RM-05 (US-202-b, US-203), RM-07 (US-303).

## Contrôles réellement exécutés
- Contrôle de structure scripté sur les 37 fichiers : titre `# US-XXX — …`, 5 sections, ≥ 1 critère « Étant donné » → 37/37 conformes.
- Comparaison octet à octet des 4 US correctes avec l'entrée → identiques.
- Recherche de valeurs chiffrées (jours, Mo…) : une seule occurrence, US-403, citant les seuils contradictoires de l'US d'origine sans en retenir.

## Contrôles non exécutés
- Aucun test applicatif (pas de code dans le dépôt).
- Les propositions marquées « à valider » et les critères « provisoires » n'ont pas été validés par le métier.
- Aucune relecture humaine : les sorties sont des brouillons à valider.
