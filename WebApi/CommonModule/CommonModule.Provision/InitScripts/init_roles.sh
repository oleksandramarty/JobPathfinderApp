#!/bin/bash

echo "Initializing roles..."

# Path to the CSV file
csv_file=$(cd "$(dirname "$0")" && pwd | sed 's|/InitScripts||')"/InitData/roles.csv"

# Database connection details
db_host="localhost"
db_port="5432"
source "$(cd "$(dirname "$0")" && pwd | sed 's|/InitScripts||')/provision_helpers.sh"
db_name=$(getDbNameUser)
db_user="postgres"
db_password="postgres"

# Export password to avoid password prompt
export PGPASSWORD=$db_password

# Initialize counters
totalRecords=0
alreadyExist=0
errorAdded=0

log_file=$(cd "$(dirname "$0")" && pwd | sed 's|/InitScripts||')"/provision_logs.txt"
# Read the CSV file line by line
while IFS=';' read -r id title userRole _
do
  # Skip the header line
  if [ "$id" != "id" ]; then
    ((totalRecords++))
    # Check if the role with the specific ID already exists
    role_exists=$(psql -h $db_host -p $db_port -d $db_name -U $db_user -t -c "SELECT 1 FROM \"$db_name\".\"Users\".\"Roles\" WHERE \"Id\" = $id;" > /dev/null)

    # If the role does not exist, insert it
    if [ -z "$role_exists" ]; then
      # Construct the SQL command
      sql="INSERT INTO \"$db_name\".\"Users\".\"Roles\" (\"Id\", \"Title\", \"UserRole\") VALUES ($id, '$title', $userRole);"

      # Execute the SQL command
      if psql -h $db_host -p $db_port -d $db_name -U $db_user -c "$sql" > /dev/null; then
         echo "Role with ID $id added successfully."
      else
        ((errorAdded++))
        echo "Error adding role with ID $id." >> "$log_file"
      fi
    else
      ((alreadyExist++))
        echo "Role with ID $id already exists. Skipping insertion."
    fi
  fi
done < "$csv_file"

# Unset the password variable for security
unset PGPASSWORD

# Call the add_logs.sh script
SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
chmod +x "$SCRIPT_DIR/add_logs.sh"
"$SCRIPT_DIR/add_logs.sh" "ROLES" "$totalRecords" "$alreadyExist" "$errorAdded"
echo "Roles initialized."
echo