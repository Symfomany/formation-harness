#!/usr/bin/env python3
"""Contrôle de structure du backlog produit (pas de pertinence métier).

Usage : python scripts/verifier_backlog.py [--hook] [dossier]
En mode --hook, lit l'événement JSON sur stdin et ne contrôle que si l'outil
a touché `backlog/sortie`.
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DEFAUT = ROOT / "sprintdesk" / "backlog" / "sortie"
RAPPORT = ROOT / "sprintdesk" / "resultats" / "rapport-structure.md"
SECTIONS = ["Besoin", "Règles métier", "Critères d'acceptation", "Dépendances", "Questions ouvertes"]
TITRE = re.compile(r"^# (US-[\w.-]+) — .+", re.M)


def section(texte, nom):
    m = re.search(rf"^## {re.escape(nom)}\s*$(.*?)(?=^## |\Z)", texte, re.M | re.S)
    return None if m is None else m.group(1).strip()


def controler(dossier):
    anomalies, ids = [], {}
    fichiers = sorted(dossier.rglob("*.md"))
    if not fichiers:
        anomalies.append((str(dossier), "aucun fichier US trouvé"))
    for f in fichiers:
        nom = f.relative_to(dossier).as_posix()
        texte = f.read_text(encoding="utf-8")
        m = TITRE.search(texte)
        if not m:
            anomalies.append((nom, "titre « # US-XXX — Titre » absent"))
        else:
            if m.group(1) in ids:
                anomalies.append((nom, f"identifiant {m.group(1)} déjà utilisé dans {ids[m.group(1)]}"))
            ids[m.group(1)] = nom
        for s in SECTIONS:
            if section(texte, s) is None:
                anomalies.append((nom, f"section « {s} » absente"))
        ca = section(texte, "Critères d'acceptation")
        if ca is not None and not re.search(r"^\s*[-*\d]", ca, re.M):
            anomalies.append((nom, "aucun critère d'acceptation"))
    return len(fichiers), anomalies


def ecrire_rapport(nb, anomalies):
    lignes = ["# Rapport de structure du backlog", "", f"Fichiers contrôlés : {nb}", f"Anomalies : {len(anomalies)}", ""]
    lignes += [f"- `{n}` : {msg}" for n, msg in anomalies] or ["Aucune anomalie de structure."]
    lignes += ["", "_Contrôle de structure uniquement ; la pertinence métier reste à relire._"]
    RAPPORT.parent.mkdir(parents=True, exist_ok=True)
    RAPPORT.write_text("\n".join(lignes) + "\n", encoding="utf-8")


def main():
    args = [a for a in sys.argv[1:] if a != "--hook"]
    if "--hook" in sys.argv:
        try:
            evenement = json.load(sys.stdin)
        except ValueError:
            return 0
        if "backlog/sortie" not in json.dumps(evenement).replace("\\\\", "/").replace("\\", "/"):
            return 0
    dossier = Path(args[0]) if args else DEFAUT
    nb, anomalies = controler(dossier)
    ecrire_rapport(nb, anomalies)
    msg = f"Contrôle backlog : {nb} fichier(s), {len(anomalies)} anomalie(s). Voir {RAPPORT.relative_to(ROOT).as_posix()}"
    if "--hook" in sys.argv:
        print(json.dumps({"systemMessage": msg}))
    else:
        print(msg)
        for n, m in anomalies:
            print(f" - {n} : {m}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
