#!/bin/bash

clear

# Record the start time
START_TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)

echo "Provision running..."

# Set the environment variable to use the custom appsettings file
export ASPNETCORE_ENVIRONMENT=Development

# Truncate the provision_logs.txt file
truncate -s 0 "$SCRIPT_DIR/provision_logs.txt"

# Set the dropMigrations parameter
dropMigrations=true 
# Set the addNewMigration parameter
addNewMigration=true
# Set the isBulkUpdate parameter
isBulkUpdate=true

# Make each script executable and run it
chmod +x "$SCRIPT_DIR/reinitialize_db.sh"
"$SCRIPT_DIR/reinitialize_db.sh" $dropMigrations $addNewMigration

chmod +x "$SCRIPT_DIR/reinitialize_db_data.sh"
"$SCRIPT_DIR/reinitialize_db_data.sh" $isBulkUpdate

# Generate client additional models typescript files for Angular app
chmod +x "$SCRIPT_DIR/InitScripts/generate_client_models_ts.sh"
"$SCRIPT_DIR/InitScripts/generate_client_models_ts.sh"

# Initialize Kafka
chmod +x "$SCRIPT_DIR/InitScripts/init_kafka.sh"
"$SCRIPT_DIR/InitScripts/init_kafka.sh"

# Initialize integration tests databases
chmod +x "$SCRIPT_DIR/provision_tests.sh"
"$SCRIPT_DIR/provision_tests.sh"
echo "Provision completed."


chmod +x "$SCRIPT_DIR/provision_demo.sh"
"$SCRIPT_DIR/provision_demo.sh"

# Record the end time
END_TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# Convert timestamps to seconds since epoch
START_SECONDS=$(date -j -f '%Y-%m-%d %H:%M:%S' "$START_TIMESTAMP" +%s)
END_SECONDS=$(date -j -f '%Y-%m-%d %H:%M:%S' "$END_TIMESTAMP" +%s)

# Calculate the duration in seconds
DURATION=$((END_SECONDS - START_SECONDS))

# Print the results
printf "%-30s : %s\n" "Provision Start Date" "$START_TIMESTAMP"
printf "%-30s : %s\n" "Provision End Date" "$END_TIMESTAMP"
printf "%-30s : %s\n" "Duration:" "$DURATION second(s)"

# Write the results to provision_logs.txt
{
  printf "%-30s : %s\n" "Provision Start Date" "$START_TIMESTAMP"
  printf "%-30s : %s\n" "Provision End Date" "$END_TIMESTAMP"
  printf "%-30s : %s\n" "Duration:" "$DURATION second(s)"
} >> "$SCRIPT_DIR/provision_logs.txt"