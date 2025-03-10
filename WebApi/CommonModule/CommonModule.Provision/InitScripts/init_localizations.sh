#!/bin/bash

echo "Processing localizations..."

# Path to the CSV files
csv_file=$(cd "$(dirname "$0")" && pwd | sed 's|/InitScripts||')"/InitData/locales.csv"
csv_public_keys_file=$(cd "$(dirname "$0")" && pwd | sed 's|/InitScripts||')"/InitData/Localizations/localizations_public_keys.csv"

# Check if isBulkUpdate parameter is passed
isBulkUpdate=$1

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
bulkCounter=0
bulkInsertSQL=""

log_file=$(cd "$(dirname "$0")" && pwd | sed 's|/InitScripts||')"/provision_logs.txt"

# Read the public keys into an array
publicKeys=()
while IFS= read -r publicKey; do
  publicKeys+=("$publicKey")
done < <(tail -n +2 "$csv_public_keys_file") # Skip the header line

# Function to check if a key is in the public keys array
is_public_key() {
  local key=$1
  for publicKey in "${publicKeys[@]}"; do
    if [[ "$publicKey" == "$key" ]]; then
      return 0
    fi
  done
  return 1
}

# Read the CSV file line by line
while IFS=';' read -r id isoCode title titleEn _
do
  # Skip the header line
  if [ "$id" != "id" ]; then
    echo "Localization for $titleEn($title)"
    localization_file="$csv_localizations_folder/a$id-localizations_$isoCode.csv"

    # Read the localization file line by line
    while IFS=';' read -r loc_id locale_IsoCode key valueEn value
    do
      # Skip the header line
      if [ "$loc_id" != "id" ]; then
        ((totalRecords++))
        # Check if the localization with the specific ID already exists
        localization_exists=$(psql -h $db_host -p $db_port -d $db_name -U $db_user -t -c "SELECT 1 FROM \"$db_name\".\"Locales\".\"Localizations\" WHERE \"Id\" = '$loc_id';" > /dev/null)

        # Determine if the key is public
        isPublicBool=false
        if is_public_key "$key"; then
          isPublicBool=true
        fi

        # If the localization does not exist, prepare the SQL for bulk insert
        if [ -z "$localization_exists" ]; then
          if [ "$isBulkUpdate" == "true" ]; then
            # Construct the SQL command
            bulkInsertSQL+="INSERT INTO \"$db_name\".\"Locales\".\"Localizations\" (\"Id\", \"Key\", \"ValueEn\", \"Value\", \"LocaleId\", \"IsPublic\") VALUES ('$loc_id', '$key', '$valueEn', '$value', $id, $isPublicBool);"
            ((bulkCounter++))

            # If bulkCounter reaches 900, execute the bulk insert
            if [ $bulkCounter -ge 900 ]; then
              if psql -h $db_host -p $db_port -d $db_name -U $db_user -c "$bulkInsertSQL" > /dev/null; then
                echo "Bulk insert of $bulkCounter localizations added successfully."
              else
                ((errorAdded+=bulkCounter))
                echo "Error adding bulk localizations."
              fi
              # Reset the counter and SQL variable
              bulkCounter=0
              bulkInsertSQL=""
            fi
          else
            # Non-bulk insert
            sql="INSERT INTO \"$db_name\".\"Locales\".\"Localizations\" (\"Id\", \"Key\", \"ValueEn\", \"Value\", \"LocaleId\", \"IsPublic\") VALUES ('$loc_id', '$key', '$valueEn', '$value', $id, $isPublicBool);"
            if psql -h $db_host -p $db_port -d $db_name -U $db_user -c "$sql" > /dev/null; then
              echo "Localization with ID $loc_id added successfully."
            else
              ((errorAdded++))
              echo "Error adding localization with ID $loc_id." >> "$log_file"
            fi
          fi
        else
          ((alreadyExist++))
          echo "Localization with ID $loc_id already exists. Skipping insertion."
        fi
      fi
    done < "$localization_file"
  fi
done < "$csv_file"

# Insert any remaining localizations
if [ $bulkCounter -gt 0 ]; then
  if psql -h $db_host -p $db_port -d $db_name -U $db_user -c "$bulkInsertSQL" > /dev/null; then
    echo "Bulk insert of $bulkCounter remaining localizations added successfully."
  else
    ((errorAdded+=bulkCounter))
    echo "Error adding remaining bulk localizations." >> "$log_file"
  fi
fi

# Unset the password variable for security
unset PGPASSWORD

# Call the add_logs.sh script
SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
chmod +x "$SCRIPT_DIR/add_logs.sh"
"$SCRIPT_DIR/add_logs.sh" "LOCALIZATIONS" "$totalRecords" "$alreadyExist" "$errorAdded"
echo "Localizations initialized."