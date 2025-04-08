#!/bin/bash

echo "Initializing simple dictionaries..."

# Database connection details
db_host="localhost"
db_port="5432"
source "$(cd "$(dirname "$0")" && pwd | sed 's|/InitScripts||')/provision_helpers.sh"
db_name=$(getDbNameDictionary)
db_user="postgres"
db_password="postgres"

# Export password to avoid password prompt
export PGPASSWORD=$db_password

csv_files=("job_types" "job_sources" "experience_levels" "skill_levels" "language_levels" "work_arrangements")
table_names=("JobTypes" "JobSources" "ExperienceLevels" "SkillLevels" "LanguageLevels" "WorkArrangements")

for i in "${!csv_files[@]}"; do
  # Path to the CSV file
  csv_file="$(cd "$(dirname "$0")" && pwd | sed 's|/InitScripts||')/InitData/${csv_files[$i]}.csv"
  table_name=${table_names[$i]}

  # Initialize counters
  totalRecords=0
  alreadyExist=0
  errorAdded=0

  log_file="$(cd "$(dirname "$0")" && pwd | sed 's|/InitScripts||')/provision_logs.txt"

  # Read the CSV file line by line
  while IFS=';' read -r id title titleEn status; do
    # Skip the header line
    if [[ "$id" != "id" ]]; then
      ((totalRecords++))

      # Check if the record with the specific ID already exists
      record_exist=$(psql -h "$db_host" -p "$db_port" -d "$db_name" -U "$db_user" -t -c \
        "SELECT 1 FROM \"$db_name\".\"Dictionaries\".\"${table_name}\" WHERE \"Id\" = $id;" | tr -d '[:space:]')

      # If the record does not exist, insert it
      if [[ -z "$record_exist" ]]; then
        # Construct the SQL command
        sql="INSERT INTO \"$db_name\".\"Dictionaries\".\"${table_name}\" 
        (\"Id\", \"Title\", \"TitleEn\", \"Status\") 
        VALUES ($id, '$title', '$titleEn', $status);"

        # Execute the SQL command
        if psql -h "$db_host" -p "$db_port" -d "$db_name" -U "$db_user" -c "$sql" > /dev/null; then
          echo "${table_name} with ID $id added successfully."
        else
          ((errorAdded++))
          echo "Error adding ${table_name} with ID $id." >> "$log_file"
        fi
      else
        ((alreadyExist++))
        echo "${table_name} with ID $id already exists. Skipping insertion."
      fi
    fi
  done < "$csv_file"

  # Call the add_logs.sh script
  SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
  chmod +x "$SCRIPT_DIR/add_logs.sh"
  "$SCRIPT_DIR/add_logs.sh" "${table_name}" "$totalRecords" "$alreadyExist" "$errorAdded"

  echo "${table_name} initialized."
  echo
done

# Unset the password variable for security
unset PGPASSWORD
