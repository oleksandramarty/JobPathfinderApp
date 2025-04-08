#!/bin/bash

echo "Initializing locales..."

# Path to the CSV file
csv_file=$(cd "$(dirname "$0")" && pwd | sed 's|/InitScripts||')"/InitData/locales.csv"

# Database connection details
db_host="localhost"
db_port="5432"
source "$(cd "$(dirname "$0")" && pwd | sed 's|/InitScripts||')/provision_helpers.sh"
db_name=$(getDbNameLocalization)
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
while IFS=';' read -r id isoCode title titleEn isDefault status localeEnum culture
do
  # Skip the header line
  if [ "$id" != "id" ]; then
    ((totalRecords++))
    # Check if the locale with the specific ID already exists
    locale_exists=$(psql -h $db_host -p $db_port -d $db_name -U $db_user -t -c "SELECT 1 FROM \"$db_name\".\"Locales\".\"Locales\" WHERE \"Id\" = $id;" > /dev/null)

    # If the locale does not exist, insert it
    if [ -z "$locale_exists" ]; then
      # Normalize titles
      titleNormalized=$(echo "$title" | tr '[:lower:]' '[:upper:]')
      titleEnNormalized=$(echo "$titleEn" | tr '[:lower:]' '[:upper:]')

      # Convert boolean values to integers
      isDefaultBool=$( [ "$isDefault" == "1" ] && echo true || echo false )

      # Construct the SQL command
      sql="INSERT INTO \"$db_name\".\"Locales\".\"Locales\" 
      (\"Id\", \"IsoCode\", \"Title\", \"TitleEn\", \"TitleNormalized\", \"TitleEnNormalized\", \"IsDefault\", \"Status\", \"LocaleEnum\", \"Culture\") 
      VALUES ($id, '$isoCode', '$title', '$titleEn', '$titleNormalized', '$titleEnNormalized', $isDefaultBool, $status, '$localeEnum', '$culture');"

      # Execute the SQL command
      if psql -h $db_host -p $db_port -d $db_name -U $db_user -c "$sql" > /dev/null; then
         echo "Locale with ID $id added successfully."
      else
        ((errorAdded++))
        echo "Error adding locale with ID $id." >> "$log_file"
      fi
    else
      ((alreadyExist++))
      echo "Locale with ID $id already exists. Skipping insertion." 
    fi
  fi
done < "$csv_file"

# Unset the password variable for security
unset PGPASSWORD

# Call the add_logs.sh script
SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
chmod +x "$SCRIPT_DIR/add_logs.sh"
"$SCRIPT_DIR/add_logs.sh" "LOCALES" "$totalRecords" "$alreadyExist" "$errorAdded"
echo "Users initialized."
echo