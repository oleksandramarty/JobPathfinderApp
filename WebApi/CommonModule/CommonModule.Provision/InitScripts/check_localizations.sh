#!/bin/bash

echo "Checking localizations..."
log_file=$(cd "$(dirname "$0")" && pwd | sed 's|/InitScripts||')"/provision_logs.txt"
{

# Path to the CSV file
csv_file=$(cd "$(dirname "$0")" && pwd | sed 's|/InitScripts||')"/InitData/locales.csv"

csv_localizations_folder=$(cd "$(dirname "$0")" && pwd | sed 's|/InitScripts||')"/InitData/Localizations"

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

# Read the CSV file line by line
while IFS=';' read -r id isoCode title titleEn _
do
  # Skip the header line
  if [ "$id" != "id" ]; then
    ((totalRecords++))
    echo "Checking localization for $titleEn($title)"
    localization_file="$csv_localizations_folder/a$id-localizations_$isoCode.csv"

    # Execute the SQL query to find missing localizations for the current locale
    missing_localizations=$(psql -h $db_host -p $db_port -d $db_name -U $db_user -t -c "
      SELECT DISTINCT l.\"Key\"
      FROM \"Locales\".\"Localizations\" l
               LEFT JOIN (
          SELECT \"Key\"
          FROM \"Locales\".\"Localizations\"
          WHERE \"LocaleId\" = $id
      ) k ON l.\"Key\" = k.\"Key\"
      WHERE k.\"Key\" IS NULL;
    " > /dev/null)

    if [ -z "$missing_localizations" ]; then
      ((alreadyExist++))
    else
      echo "Missing localizations for key $missing_localizations"
      ((errorAdded++))
    fi
  fi
done < "$csv_file"

# Unset the password variable for security
unset PGPASSWORD
} >> "$log_file"

# Call the add_logs.sh script
SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
chmod +x "$SCRIPT_DIR/add_logs.sh"
"$SCRIPT_DIR/add_logs.sh" "CHECK LOCALES LOCALIZATIONS" "$totalRecords" "$alreadyExist" "$errorAdded"