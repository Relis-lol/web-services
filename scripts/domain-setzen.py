#!/usr/bin/env python3
"""
domain-setzen.py — stellt die Website auf eine andere Adresse um.

Die Domain steht an mehreren Stellen: in den canonical-Links der drei
HTML-Seiten, in den OpenGraph- und Twitter-Angaben, in robots.txt,
in sitemap.xml und in js/config.js. Dieses Skript ändert alle auf einmal,
damit nichts vergessen wird.

Nur nötig, wenn eine EIGENE DOMAIN dazukommt. Für den Betrieb unter
GitHub Pages ist bereits alles korrekt eingetragen.

Aufruf aus dem Projektstamm:

    python scripts/domain-setzen.py https://beispiel.de/

    python scripts/domain-setzen.py https://beispiel.de/ --probe
        zeigt nur an, was sich ändern würde, ohne zu schreiben

Nach dem Umstellen zusätzlich erledigen:
  - <lastmod> in sitemap.xml auf das heutige Datum setzen
  - in GitHub unter Settings -> Pages die Custom Domain eintragen
  - "Enforce HTTPS" aktivieren, sobald das Zertifikat da ist
"""

import io
import os
import re
import sys

DATEIEN = [
    'index.html', 'impressum.html', 'datenschutz.html',
    'robots.txt', 'sitemap.xml', 'js/config.js', 'README.md',
]

MUSTER = re.compile(r'https://[a-z0-9.-]+\.[a-z]{2,}(?:/[a-z0-9._-]*)*/')


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    nur_zeigen = '--probe' in sys.argv

    if len(args) != 1:
        print(__doc__)
        return 1

    neu = args[0]
    if not neu.startswith('https://'):
        print('FEHLER: Die Adresse muss mit https:// beginnen.')
        return 1
    if not neu.endswith('/'):
        neu += '/'

    stamm = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

    # Die aktuell eingetragene Adresse aus config.js lesen
    cfg = io.open(os.path.join(stamm, 'js/config.js'), encoding='utf-8').read()
    treffer = re.search(r"SITE_URL:\s*'([^']+)'", cfg)
    if not treffer:
        print('FEHLER: SITE_URL wurde in js/config.js nicht gefunden.')
        return 1
    alt = treffer.group(1)

    if alt == neu:
        print('Die Adresse ist bereits eingetragen:', neu)
        return 0

    print('von:  %s' % alt)
    print('nach: %s' % neu)
    print()

    gesamt = 0
    for rel in DATEIEN:
        pfad = os.path.join(stamm, rel)
        if not os.path.exists(pfad):
            continue
        inhalt = io.open(pfad, encoding='utf-8').read()
        anzahl = inhalt.count(alt)
        if not anzahl:
            continue
        gesamt += anzahl
        print('  %-20s %d Stelle(n)' % (rel, anzahl))
        if not nur_zeigen:
            io.open(pfad, 'w', encoding='utf-8', newline='\n').write(
                inhalt.replace(alt, neu))

    print()
    if nur_zeigen:
        print('Probelauf — es wurde nichts geschrieben. %d Stelle(n) betroffen.' % gesamt)
    else:
        print('%d Stelle(n) umgestellt.' % gesamt)
        print('Nicht vergessen: <lastmod> in sitemap.xml aktualisieren.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
