# Saveroq Studio — Kontakt-Endpunkt
#
# Ein einzelner FastAPI-Dienst. Kein Datenbankzugriff, kein Zustand auf
# der Platte, ein Arbeitsprozess. Der Dienst hat genau einen Endpunkt.
FROM python:3.12-alpine

# Nicht als root. Die uid ist fest, damit die tmpfs-Mounts in compose.yml
# dieselbe Kennung verwenden koennen.
RUN adduser -D -u 10001 kontakt

WORKDIR /app

# Erst die Abhaengigkeiten, dann der Code: So bleibt die Paket-Ebene im
# Zwischenspeicher, solange sich requirements.txt nicht aendert.
COPY api/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY api/config.py api/validation.py api/mailer.py api/app.py ./

USER 10001
EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD python -c "import urllib.request,sys; sys.exit(0 if urllib.request.urlopen('http://127.0.0.1:8000/api/health',timeout=3).status==200 else 1)"

# Ein Arbeitsprozess: Die Ratenbegrenzung liegt im Arbeitsspeicher und
# waere ueber mehrere Prozesse hinweg wirkungslos. Fuer ein
# Kontaktformular ist ein Prozess reichlich.
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000", \
     "--workers", "1", "--no-server-header", "--proxy-headers", \
     "--forwarded-allow-ips", "*"]
