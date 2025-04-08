#!/bin/bash

echo "Initializing languages..."

# Path to the CSV file
csv_file=$(cd "$(dirname "$0")" && pwd | sed 's|/InitScripts||')"/InitData/languages.csv"

# Database connection details
db_host="localhost"
db_port="5432"
source "$(cd "$(dirname "$0")" && pwd | sed 's|/InitScripts||')/provision_helpers.sh"
db_name=$(getDbNameDictionary)
db_user="postgres"
db_password="postgres"

# Export password to avoid password prompt
export PGPASSWORD=$db_password

# Initialize counters
totalRecords=0
alreadyExist=0
errorAdded=0
bulkCounter=0
bulkInsertSQL=""

log_file=$(cd "$(dirname "$0")" && pwd | sed 's|/InitScripts||')"/provision_logs.txt"

# Read the CSV file line by line
while IFS=';' read -r id isoCode title titleEn status
do
  # Skip the header line
  if [ "$id" != "id" ]; then
    ((totalRecords++))

    # Check if the language with the specific ID already exists
    language_exists=$(psql -h $db_host -p $db_port -d $db_name -U $db_user -t -c \
      "SELECT 1 FROM \"$db_name\".\"Dictionaries\".\"Languages\" WHERE \"Id\" = $id;" > /dev/null)

    if [ -z "$language_exists" ]; then
      # Normalize titles
      titleNormalized=$(echo "$title" | tr '[:lower:]' '[:upper:]')
      titleEnNormalized=$(echo "$titleEn" | tr '[:lower:]' '[:upper:]')

      # Append to bulk SQL
      bulkInsertSQL+="INSERT INTO \"$db_name\".\"Dictionaries\".\"Languages\" 
        (\"Id\", \"IsoCode\", \"Title\", \"TitleEn\", \"Status\") 
        VALUES ($id, '$isoCode', '$titleNormalized', '$titleEnNormalized', $status);"
      ((bulkCounter++))

      # If bulkCounter reaches 500, execute the bulk insert
      if [ $bulkCounter -ge 500 ]; then
        if psql -h $db_host -p $db_port -d $db_name -U $db_user -c "$bulkInsertSQL" > /dev/null; then
          echo "Bulk insert of $bulkCounter languages added successfully."
        else
          ((errorAdded+=bulkCounter))
          echo "Error adding bulk languages." >> "$log_file"
        fi
        bulkCounter=0
        bulkInsertSQL=""
      fi
    else
      ((alreadyExist++))
      echo "Language with ID $id already exists. Skipping insertion."
    fi
  fi
done < "$csv_file"

# Insert remaining records if any
if [ $bulkCounter -gt 0 ]; then
  if psql -h $db_host -p $db_port -d $db_name -U $db_user -c "$bulkInsertSQL" > /dev/null; then
    echo "Bulk insert of $bulkCounter remaining languages added successfully."
  else
    ((errorAdded+=bulkCounter))
    echo "Error adding remaining bulk languages." >> "$log_file"
  fi
fi

# Unset the password variable for security
unset PGPASSWORD

# Call the add_logs.sh script
SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
chmod +x "$SCRIPT_DIR/add_logs.sh"
"$SCRIPT_DIR/add_logs.sh" "LANGUAGES" "$totalRecords" "$alreadyExist" "$errorAdded"
echo "Languages initialized."
