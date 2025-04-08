#!/bin/bash

echo "----------------------"
echo "Dropping databases..."
echo "----------------------"

# Database connection details
db_host="localhost"
db_port="5432"
db_user="postgres"
db_password="postgres"

# Export password to avoid password prompt
export PGPASSWORD=$db_password

  # Array of database names
  dbNames=("JP_LocalizationDb" "JP_UserDb" "JP_DictionaryDb" "JP_AuditTrailDb")
  
  # Loop through each database name and drop it
  for db_name in "${dbNames[@]}"; do
    # Construct the SQL command to drop the database
    echo "Dropping database: $db_name"
    sql="DROP DATABASE IF EXISTS \"$db_name\";"
    
    # Execute the SQL command
    psql -h $db_host -p $db_port -U $db_user -c "$sql" > /dev/null
  done

# Unset the password variable for security
unset PGPASSWORD

echo "----------------------"
echo "Databases dropped."
echo "----------------------"