#!/usr/bin/env python3
"""cache-buster.py — haengt Versionskennungen an CSS- und JS-Verweise.

WARUM DAS NOETIG IST:
Cloudflare ueberschreibt auf dieser Zone den Cache-Control-Header des
Servers und setzt fuer statische Dateien 4 Stunden Browser-Cache. Nach
einem Deploy wuerden Besucher also bis zu vier Stunden lang die alte
styles.css oder main.js benutzen — mit neuem HTML kombiniert ergibt das
kaputte Seiten. Die Einstellung liegt zonenweit und darf nicht angefasst
werden, weil sie auch saveroq.com betrifft.

Die Loesung, die vollstaendig in diesem Projekt liegt: Der Dateiname
bekommt eine Kennung aus dem Inhalt der Datei. Aendert sich der Inhalt,
aendert sich die URL, und der Zwischenspeicher greift nicht mehr.

Aufruf aus dem Projektstamm, vor jedem Commit mit geaenderten Assets:

    python scripts/cache-buster.py

Das Skript ist wiederholbar: Bei unveraenderten Dateien aendert sich
nichts. `--probe` zeigt nur an, was passieren wuerde.
"""

import hashlib
import io
import os
import re
import sys

SEITEN = ['index.html', 'impressum.html', 'datenschutz.html']
MUSTER = re.compile(r'(href|src)="((?:css|js)/[a-z0-9-]+\.(?:css|js))(?:\?v=[a-f0-9]+)?"')


def kennung(pfad):
    with open(pfad, 'rb') as f:
        return hashlib.sha256(f.read()).hexdigest()[:8]


def main():
    nur_zeigen = '--probe' in sys.argv
    stamm = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    gesamt = 0

    for seite in SEITEN:
        pfad = os.path.join(stamm, seite)
        if not os.path.exists(pfad):
            continue
        inhalt = io.open(pfad, encoding='utf-8').read()
        geaendert = []

        def ersetzen(treffer):
            attr, datei = treffer.group(1), treffer.group(2)
            ziel = os.path.join(stamm, datei)
            if not os.path.exists(ziel):
                return treffer.group(0)
            neu = '%s="%s?v=%s"' % (attr, datei, kennung(ziel))
            if neu != treffer.group(0):
                geaendert.append(datei)
            return neu

        neu_inhalt = MUSTER.sub(ersetzen, inhalt)
        if geaendert:
            gesamt += len(geaendert)
            print('  %-18s %s' % (seite, ', '.join(sorted(set(geaendert)))))
            if not nur_zeigen:
                io.open(pfad, 'w', encoding='utf-8', newline='\n').write(neu_inhalt)

    if not gesamt:
        print('  Alle Versionskennungen sind aktuell.')
    elif nur_zeigen:
        print('\n  Probelauf — es wurde nichts geschrieben.')
    else:
        print('\n  %d Verweis(e) aktualisiert.' % gesamt)
    return 0


if __name__ == '__main__':
    sys.exit(main())
