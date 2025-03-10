#!/bin/bash

echo "Initializing countries..."

# Path to the CSV file
csv_file=$(cd "$(dirname "$0")" && pwd | sed 's|/InitScripts||')"/InitData/countries.csv"

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

# Initialize counters
totalRecords=0
alreadyExist=0
errorAdded=0
bulkCounter=0
bulkInsertSQL=""

log_file=$(cd "$(dirname "$0")" && pwd | sed 's|/InitScripts||')"/provision_logs.txt"
# Read the CSV file line by line
while IFS=';' read -r id code titleEn title status;
do
  # Skip the header line
  if [ "$id" != "id" ]; then
    ((totalRecords++))
    # Check if the country with the specific ID already exists
    country_exists=$(psql -h $db_host -p $db_port -d $db_name -U $db_user -t -c "SELECT 1 FROM \"$db_name\".\"Dictionaries\".\"Countries\" WHERE \"Id\" = $id;" > /dev/null)

    # If the country does not exist, prepare the SQL for bulk insert
    if [ -z "$country_exists" ]; then

      if [ "$isBulkUpdate" == "true" ]; then
        # Construct the SQL command
        bulkInsertSQL+="INSERT INTO \"$db_name\".\"Dictionaries\".\"Countries\"
        (\"Id\", \"Code\", \"TitleEn\", \"Title\", \"Status\")
        VALUES ($id, '$code', '$titleEn', '$title', $status);"
        ((bulkCounter++))

        # If bulkCounter reaches 500, execute the bulk insert
        if [ $bulkCounter -ge 500 ]; then
          if psql -h $db_host -p $db_port -d $db_name -U $db_user -c "$bulkInsertSQL" > /dev/null; then
            echo "Bulk insert of $bulkCounter countries added successfully."
          else
            ((errorAdded+=bulkCounter))
            echo "Error adding bulk countries."
          fi
          # Reset the counter and SQL variable
          bulkCounter=0
          bulkInsertSQL=""
        fi
      else
        # Non-bulk insert
        sql="INSERT INTO \"$db_name\".\"Dictionaries\".\"Countries\"
        (\"Id\", \"Code\", \"TitleEn\", \"Title\", \"Status\")
        VALUES ($id, '$code', '$titleEn', '$title', $status);"
        if psql -h $db_host -p $db_port -d $db_name -U $db_user -c "$sql" > /dev/null; then
          echo "Country with ID $id added successfully."
        else
          ((errorAdded++))
          echo "Error adding country with ID $id." >> "$log_file"
        fi
      fi
    else
      ((alreadyExist++))
      echo "Country with ID $id already exists. Skipping insertion."
    fi
  fi
done < "$csv_file"

# Insert any remaining countries
if [ $bulkCounter -gt 0 ]; then
  if psql -h $db_host -p $db_port -d $db_name -U $db_user -c "$bulkInsertSQL" > /dev/null; then
    echo "Bulk insert of $bulkCounter remaining countries added successfully."
  else
    ((errorAdded+=bulkCounter))
    echo "Error adding remaining bulk countries." >> "$log_file"
  fi
fi

# Unset the password variable for security
unset PGPASSWORD

# Call the add_logs.sh script
SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
chmod +x "$SCRIPT_DIR/add_logs.sh"
"$SCRIPT_DIR/add_logs.sh" "COUNTRIES" "$totalRecords" "$alreadyExist" "$errorAdded"
echo "Countries initialized."
