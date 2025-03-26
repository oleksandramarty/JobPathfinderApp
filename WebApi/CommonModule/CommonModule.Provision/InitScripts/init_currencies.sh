#!/bin/bash

echo "Initializing currencies..."

# Path to the CSV file
csv_file=$(cd "$(dirname "$0")" && pwd | sed 's|/InitScripts||')"/InitData/currencies.csv"

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
while IFS=';' read -r id titleEn title code symbol status;
do
  # Skip the header line
  if [ "$id" != "id" ]; then
    ((totalRecords++))
    # Check if the currency with the specific ID already exists
    currency_exists=$(psql -h $db_host -p $db_port -d $db_name -U $db_user -t -c "SELECT 1 FROM \"$db_name\".\"Dictionaries\".\"Currencies\" WHERE \"Id\" = $id;" > /dev/null)

    # If the currency does not exist, prepare the SQL for bulk insert
    if [ -z "$currency_exists" ]; then

      if [ "$isBulkUpdate" == "true" ]; then
        # Construct the SQL command
        bulkInsertSQL+="INSERT INTO \"$db_name\".\"Dictionaries\".\"Currencies\" 
        (\"Id\", \"TitleEn\", \"Title\", \"Code\", \"Symbol\", \"Status\") 
        VALUES ($id, '$titleEn', '$title', '$code', '$symbol', $status);"
        ((bulkCounter++))

        # If bulkCounter reaches 500, execute the bulk insert
        if [ $bulkCounter -ge 500 ]; then
          if psql -h $db_host -p $db_port -d $db_name -U $db_user -c "$bulkInsertSQL" > /dev/null; then
            echo "Bulk insert of $bulkCounter currencies added successfully."
          else
            ((errorAdded+=bulkCounter))
            echo "Error adding bulk currencies."
          fi
          # Reset the counter and SQL variable
          bulkCounter=0
          bulkInsertSQL=""
        fi
      else
        # Non-bulk insert
        sql="INSERT INTO \"$db_name\".\"Dictionaries\".\"Currencies\" 
        (\"Id\", \"TitleEn\", \"Title\", \"Code\", \"Symbol\", \"Status\") 
        VALUES ($id, '$titleEn', '$title', '$code', '$symbol', $status);"
        if psql -h $db_host -p $db_port -d $db_name -U $db_user -c "$sql" > /dev/null; then
          echo "Currency with ID $id added successfully."
        else
          ((errorAdded++))
          echo "Error adding currency with ID $id." >> "$log_file"
        fi
      fi
    else
      ((alreadyExist++))
      echo "Currency with ID $id already exists. Skipping insertion."
    fi
  fi
done < "$csv_file"

# Insert any remaining currencies
if [ $bulkCounter -gt 0 ]; then
  if psql -h $db_host -p $db_port -d $db_name -U $db_user -c "$bulkInsertSQL" > /dev/null; then
    echo "Bulk insert of $bulkCounter remaining currencies added successfully."
  else
    ((errorAdded+=bulkCounter))
    echo "Error adding remaining bulk currencies." >> "$log_file"
  fi
fi

# Unset the password variable for security
unset PGPASSWORD

# Call the add_logs.sh script
SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
chmod +x "$SCRIPT_DIR/add_logs.sh"
"$SCRIPT_DIR/add_logs.sh" "CURRENCIES" "$totalRecords" "$alreadyExist" "$errorAdded"
echo "Currencies initialized."
