#!/bin/bash

echo "Initializing users..."

# Path to the CSV file
csv_file=$(cd "$(dirname "$0")" && pwd | sed 's|/InitScripts||')"/InitData/users.csv"

# Database connection details
db_host="localhost"
db_port="5432"

source "$(cd "$(dirname "$0")" && pwd | sed 's|/InitScripts||')/provision_helpers.sh"
db_name=$(getDbNameUser)
db_user="postgres"
db_password="postgres"

temporary_pas="stLUd+qcVN82+0yhZLPjwJ/OyhPl9/Q/5rSR0a3SAUQ="
temporary_salt="UDGVIgQfoxqqLpAgeoOIx6XkwnnwvfilcF1d/hSnaS4="
                 
# Export password to avoid password prompt
export PGPASSWORD=$db_password

# Initialize counters
totalRecords=0
alreadyExist=0
errorAdded=0

log_file=$(cd "$(dirname "$0")" && pwd | sed 's|/InitScripts||')"/provision_logs.txt"
# Read the CSV file line by line
while IFS=';' read -r id login email authType role userRoleId _
do
  # Skip the header line
  if [ "$id" != "id" ]; then
    ((totalRecords++))
    # Check if the user with the specific ID already exists
    user_exists=$(psql -h $db_host -p $db_port -d $db_name -U $db_user -t -c "SELECT 1 FROM \"$db_name\".\"Users\".\"Users\" WHERE \"Id\" = '$id';" > /dev/null)

    # If the user does not exist, insert it
    if [ -z "$user_exists" ]; then
      # Normalize login and email
      login_normalized=$(echo "$login" | tr '[:lower:]' '[:upper:]')
      email_normalized=$(echo "$email" | tr '[:lower:]' '[:upper:]')

      # Construct the SQL command
      sql1="INSERT INTO \"$db_name\".\"Users\".\"Users\" 
      (\"Id\", \"Login\", \"LoginNormalized\", \"Email\", \"EmailNormalized\", \"PasswordHash\", \"Salt\", \"Status\", \"IsTemporaryPassword\", \"AuthType\", \"CreatedAt\", \"Version\") 
      VALUES ('$id', '$login', '$login_normalized', '$email', '$email_normalized', '$temporary_pas', '$temporary_salt', 1, true, $authType, CURRENT_TIMESTAMP, '$(uuidgen | tr -d '-')');"
          
      sql2="INSERT INTO \"$db_name\".\"Users\".\"UserRoles\" 
      (\"RoleId\", \"UserId\", \"Id\") 
      VALUES ($role, '$id', '$userRoleId');"
      
      # Execute the SQL command
      if psql -h $db_host -p $db_port -d $db_name -U $db_user -c "$sql1" > /dev/null && psql -h $db_host -p $db_port -d $db_name -U $db_user -c "$sql2" > /dev/null; then
         echo "User with ID $id added successfully."
      else
        ((errorAdded++))
        echo "Error adding user with ID $id." >> "$log_file"
      fi
    else
      ((alreadyExist++))
        echo "User with ID $id already exists. Skipping insertion."
    fi
  fi
done < "$csv_file"

# Unset the password variable for security
unset PGPASSWORD

# Call the add_logs.sh script
SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
chmod +x "$SCRIPT_DIR/add_logs.sh"
"$SCRIPT_DIR/add_logs.sh" "USERS" "$totalRecords" "$alreadyExist" "$errorAdded"
echo "Users initialized."
echo