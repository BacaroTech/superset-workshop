#!/bin/bash
# superset/superset-init.sh

echo "================================================="
echo "Installazione forzata dei driver nel runtime..."
echo "================================================="
pip install --no-cache-dir psycopg2-binary redis

echo "Avvio inizializzazione di Superset..."

superset fab create-admin \
              --username "${SUPERSET_ADMIN_USER}" \
              --firstname Superset \
              --lastname Admin \
              --email admin@superset.com \
              --password "${SUPERSET_ADMIN_PASSWORD}"

superset db upgrade
superset init

echo "Inizializzazione completata! Avvio del server web..."

gunicorn --bind 0.0.0.0:8088 \
         --workers 1 \
         --timeout 120 \
         --limit-request-line 0 \
         --limit-request-field_size 0 \
         "superset.app:create_app()"