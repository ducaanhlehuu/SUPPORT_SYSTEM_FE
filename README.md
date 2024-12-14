docker run --name postgres-container \
  -e POSTGRES_USER=root \
  -e POSTGRES_PASSWORD=123 \
  -e POSTGRES_DB=support_system \
  -p 5432:5432 \
  -d postgres:latest
docker cp clean-data.sql postgres-container:/clean-data.sql
docker exec -it postgres-container psql -U root -d support_system -f /clean-data.sql
