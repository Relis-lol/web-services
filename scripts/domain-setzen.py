#!/usr/bin/env python3
"""
domain-setzen.py — stellt die Website auf eine andere Adresse um.

Die Domain steht an mehreren Stellen: in den canonical-Links der drei
HTML-Seiten, in den OpenGraph- und Twitter-Angaben, in robots.txt,
in sitemap.xml und in js/config.js. Dieses Skript ändert alle auf einmal,
damit nichts vergessen wird.

Nur nötig, wenn die bestehende Studio-Domain geändert wird. Der produktive
Betrieb erfolgt über den eigenen Docker-Stack und Cloudflare Tunnel.

Aufruf aus dem Projektstamm:

    python scripts/domain-setzen.py https://beispiel.de/

    python scripts/domain-setzen.py https://beispiel.de/ --probe
        zeigt nur an, was sich ändern würde, ohne zu schreiben

Indexierung getrennt schalten (ohne Domainwechsel):

    python scripts/domain-setzen.py --index an
    python scripts/domain-setzen.py --index aus

Die Indexierung wird beim Domainwechsel BEWUSST NICHT automatisch
mitgeschaltet. Ob eine Seite in den Suchindex darf, ist eine eigene
Entscheidung und soll nicht als Nebenwirkung passieren.

Nach dem Umstellen zusätzlich erledigen:
  - <lastmod> in sitemap.xml auf das heutige Datum setzen
  - Cloudflare-Tunnel und DNS auf die neue Domain umstellen
  - TLS und alle kanonischen URLs nach dem Deployment pruefen
"""

import io
import os
import re
import sys

DATEIEN = [
    'index.html', 'impressum.html', 'datenschutz.html',
    'websites/index.html', 'web-apps-saas/index.html',
    'ai-automatisierung/index.html', 'api-integrationen/index.html',
    'hosting-betrieb/index.html', 'wartung-support/index.html',
    'virtuelle-assistenz/index.html',
    'robots.txt', 'sitemap.xml', 'js/config.js', 'README.md',
]

INDEX_SEITEN = [datei for datei in DATEIEN if datei.endswith('.html')]

MUSTER = re.compile(r'https://[a-z0-9.-]+\.[a-z]{2,}(?:/[a-z0-9._-]*)*/')


def indexierung_setzen(stamm, an, nur_zeigen):
    """Schaltet <meta name="robots"> auf allen oeffentlichen Seiten um."""
    soll = 'index, follow' if an else 'noindex, follow'
    geaendert = 0
    for rel in INDEX_SEITEN:
        pfad = os.path.join(stamm, rel)
        inhalt = io.open(pfad, encoding='utf-8').read()
        ist = 'index, follow' if 'content="index, follow"' in inhalt else 'noindex, follow'
        if ist == soll:
            continue
        geaendert += 1
        print('  %s: %s -> %s' % (rel, ist, soll))
        if not nur_zeigen:
            io.open(pfad, 'w', encoding='utf-8', newline=chr(10)).write(
                inhalt.replace('content="%s"' % ist, 'content="%s"' % soll))
    if not geaendert:
        print('Indexierung steht auf allen Seiten bereits auf: %s' % soll)
    elif nur_zeigen:
        print('Probelauf - es wurde nichts geschrieben.')
    return 0


def main():
    argv = sys.argv[1:]
    nur_zeigen = '--probe' in argv
    stamm = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

    if '--index' in argv:
        i = argv.index('--index')
        wert = argv[i + 1] if len(argv) > i + 1 else ''
        if wert not in ('an', 'aus'):
            print('FEHLER: --index braucht "an" oder "aus".')
            return 1
        return indexierung_setzen(stamm, wert == 'an', nur_zeigen)

    args = [a for a in argv if not a.startswith('--')]

    if len(args) != 1:
        print(__doc__)
        return 1

    neu = args[0]
    if not neu.startswith('https://'):
        print('FEHLER: Die Adresse muss mit https:// beginnen.')
        return 1
    if not neu.endswith('/'):
        neu += '/'

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
        print()
        print('Nicht vergessen:')
        print('  - <lastmod> in sitemap.xml aktualisieren')
        print('  - Cloudflare-Tunnel und DNS pruefen')
        print('  - Indexierung separat schalten: --index an')
    return 0


if __name__ == '__main__':
    sys.exit(main())
