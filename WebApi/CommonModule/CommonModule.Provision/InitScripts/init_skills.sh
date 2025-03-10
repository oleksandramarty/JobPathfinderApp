#!/bin/bash

echo "Initializing skills..."

# Path to the CSV file
csv_file=$(cd "$(dirname "$0")" && pwd | sed 's|/InitScripts||')"/InitData/skills.csv"

# Check if isBulkUpdate parameter is passed
isBulkUpdate=$1

# Database connection details
db_host="localhost"
db_port="5432"
source "$(cd "$(dirname "$0")" && pwd | sed 's|/InitScripts||')/provision_helpers.sh"
db_name=$(getDbNameDictionary)
db_user="postgres"
db_password="postgres"

# Export password to avoid password prompt
export PGPASSWORD=$db_password

# Initialize skills
totalRecords=0
alreadyExist=0
errorAdded=0
bulkCounter=0
bulkInsertSQL=""

log_file=$(cd "$(dirname "$0")" && pwd | sed 's|/InitScripts||')"/provision_logs.txt"
# Read the CSV file line by line
while IFS=';' read -r id title;
do
  # Skip the header line
  if [ "$id" != "id" ]; then
    ((totalRecords++))
    # Check if the skill with the specific ID already exists
    skill_exists=$(psql -h $db_host -p $db_port -d $db_name -U $db_user -t -c "SELECT 1 FROM \"$db_name\".\"Dictionaries\".\"Skills\" WHERE \"Id\" = '$id';" > /dev/null)

    # If the skill does not exist, prepare the SQL for bulk insert
    if [ -z "$skill_exists" ]; then

      if [ "$isBulkUpdate" == "true" ]; then
        # Construct the SQL command
        bulkInsertSQL+="INSERT INTO \"$db_name\".\"Dictionaries\".\"Skills\"
        (\"Id\", \"Title\", \"Status\")
        VALUES ('$id', '$title', 1);"
        ((bulkCounter++))

        # If bulkCounter reaches 500, execute the bulk insert
        if [ $bulkCounter -ge 500 ]; then
          if psql -h $db_host -p $db_port -d $db_name -U $db_user -c "$bulkInsertSQL" > /dev/null; then
            echo "Bulk insert of $bulkCounter skills added successfully."
          else
            ((errorAdded+=bulkCounter))
            echo "Error adding bulk skills."
          fi
          # Reset the counter and SQL variable
          bulkCounter=0
          bulkInsertSQL=""
        fi
      else
        # Non-bulk insert
        sql="INSERT INTO \"$db_name\".\"Dictionaries\".\"Skills\"
        (\"Id\", \"Title\", \"Status\")
        VALUES ('$id', '$title', 1);"
        if psql -h $db_host -p $db_port -d $db_name -U $db_user -c "$sql" > /dev/null; then
          echo "Skill with ID $id added successfully."
        else
          ((errorAdded++))
          echo "Error adding skill with ID $id." >> "$log_file"
        fi
      fi
    else
      ((alreadyExist++))
      echo "Skill with ID $id already exists. Skipping insertion."
    fi
  fi
done < "$csv_file"

# Insert any remaining skills
if [ $bulkCounter -gt 0 ]; then
  if psql -h $db_host -p $db_port -d $db_name -U $db_user -c "$bulkInsertSQL" > /dev/null; then
    echo "Bulk insert of $bulkCounter remaining skills added successfully."
  else
    ((errorAdded+=bulkCounter))
    echo "Error adding remaining bulk skills." >> "$log_file"
  fi
fi

# Unset the password variable for security
unset PGPASSWORD

# Call the add_logs.sh script
SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
chmod +x "$SCRIPT_DIR/add_logs.sh"
"$SCRIPT_DIR/add_logs.sh" "SKILLS" "$totalRecords" "$alreadyExist" "$errorAdded"
echo "Skills initialized."
