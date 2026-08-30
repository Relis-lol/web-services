# Saveroq Studio — Produktionsabbild
#
# Die Seite ist statisch: kein Build-Schritt, keine Abhaengigkeiten, kein
# Paketmanager. Das Abbild besteht aus nginx plus den fertigen Dateien.
#
# Bewusst `nginx-unprivileged` statt `nginx`: Das Standard-Image startet den
# Master-Prozess als root. Diese Variante laeuft vollstaendig als uid 101 und
# laesst sich dadurch zusammen mit `read_only: true` betreiben.
FROM nginxinc/nginx-unprivileged:1.29-alpine

# Die mitgelieferte Beispielkonfiguration wird nicht gebraucht.
USER root
RUN rm -f /etc/nginx/conf.d/default.conf
USER 101

COPY --chown=101:101 deploy/nginx.conf /etc/nginx/conf.d/saveroq-studio.conf

# Nur die tatsaechlich ausgelieferten Dateien. Was nicht zur Website gehoert,
# steht in .dockerignore und landet gar nicht erst im Build-Kontext.
COPY --chown=101:101 index.html impressum.html datenschutz.html \
     robots.txt sitemap.xml favicon.ico /usr/share/nginx/html/
COPY --chown=101:101 css/    /usr/share/nginx/html/css/
COPY --chown=101:101 js/     /usr/share/nginx/html/js/
COPY --chown=101:101 assets/ /usr/share/nginx/html/assets/

EXPOSE 8080

# busybox-wget ist im Alpine-Basisimage enthalten, ein zusaetzliches Paket
# waere unnoetiger Ballast.
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD wget -q -O /dev/null http://127.0.0.1:8080/healthz || exit 1
