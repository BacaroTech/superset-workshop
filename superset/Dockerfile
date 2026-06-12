# superset/Dockerfile
FROM apache/superset:latest

USER root
COPY ./superset-init.sh /app/superset-init.sh
RUN sed -i 's/\r//' /app/superset-init.sh && chmod +x /app/superset-init.sh

USER superset