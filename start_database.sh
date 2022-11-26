#!/bin/bash
source .env

PASSWORD="$POSTGRES_PASSWORD"
NAME="$POSTGRES_DB"
PORT="$POSTGRES_PORT"

docker container stop cats_postgres
docker container rm cats_postgres
docker run -d --name cats_postgres -e POSTGRES_PASSWORD="$PASSWORD" -p "$PORT":"$PORT" postgres:13.4 && npm run migration:up