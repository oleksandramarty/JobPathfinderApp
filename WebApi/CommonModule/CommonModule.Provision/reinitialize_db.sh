#!/bin/bash

# Get the absolute path of the script directory
echo "Reinitializing the database..."

# Get the absolute path of the script directory
SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)

# Check if dropMigrations parameter is passed
dropMigrations=$1
addNewMigration=$2

# Extract the desired part of the script directory
BASE_DIR=$(echo "$SCRIPT_DIR" | sed 's|/CommonModule/CommonModule.Provision/DataBaseScripts||')

# Make each script executable and run it
chmod +x "$SCRIPT_DIR/DataBaseScripts/drop_db.sh"
"$SCRIPT_DIR/DataBaseScripts/drop_db.sh"

if [ "$dropMigrations" = true ]; then
  chmod +x "$SCRIPT_DIR/DataBaseScripts/delete_migration_folder.sh"
  "$SCRIPT_DIR/DataBaseScripts/delete_migration_folder.sh"
fi 

if [ "$addNewMigration" = true ]; then
  chmod +x "$SCRIPT_DIR/DataBaseScripts/add_migration_microservice.sh"
  "$SCRIPT_DIR/DataBaseScripts/add_migration_microservice.sh"
fi

chmod +x "$SCRIPT_DIR/DataBaseScripts/apply_migration_microservice.sh"
"$SCRIPT_DIR/DataBaseScripts/apply_migration_microservice.sh"

chmod +x "$SCRIPT_DIR/InitScripts/remove_cache.sh"
"$SCRIPT_DIR/InitScripts/remove_cache.sh"

echo "Database reinitialized."
echo