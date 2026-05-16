# superset/Dockerfile
FROM apache/superset:latest

USER root
COPY ./superset-init.sh /app/superset-init.sh
RUN chmod +x /app/superset-init.sh

USER superset