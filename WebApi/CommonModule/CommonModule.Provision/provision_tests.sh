#!/bin/bash

echo "Initializing integration tests databases..."
integration_tests_dbs=("JP_MonolithDb" "JP_AuditTrailDb")

# Copy each database in the array
db_host="localhost"
db_port="5432"
db_user="postgres"
db_password="postgres"

# Export password to avoid password prompt
export PGPASSWORD=$db_password

# Check connection to PostgreSQL server
if ! psql -U $db_user -h $db_host -p $db_port -c '\q'; then
  echo "Failed to connect to PostgreSQL server at $db_host:$db_port"
  exit 1
fi

for db in "${integration_tests_dbs[@]}"; do
  SOURCE_DB=$db
  TARGET_DB="${db}_Tests"

  echo "Copying $SOURCE_DB to $TARGET_DB..."

  echo "Dropping database: $TARGET_DB"
  sql="DROP DATABASE IF EXISTS \"$TARGET_DB\";"
    
  # Execute the SQL command
  psql -h $db_host -p $db_port -U $db_user -c "$sql"
  
  # Create the target database
  psql -U $db_user -h $db_host -p $db_port -c "CREATE DATABASE \"$TARGET_DB\";" > /dev/null

  # Dump the source database and restore it to the target database
  pg_dump -U $db_user -h $db_host -p $db_port $SOURCE_DB > /tmp/${SOURCE_DB}.sql
  psql -U $db_user -h $db_host -p $db_port "$TARGET_DB" < /tmp/${SOURCE_DB}.sql > /dev/null
  rm /tmp/${SOURCE_DB}.sql

  echo "Done."
done

unset PGPASSWORD