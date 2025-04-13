#!/bin/bash

echo "----------------------"
echo "Deleting migration folders..."
echo "----------------------"

# Get the absolute path of the script directory
SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)

# Extract the base directory
BASE_DIR=$(echo "$SCRIPT_DIR" | sed 's|/CommonModule/CommonModule.Provision/DataBaseScripts||')

# Define the microservice names as an array
microservices=("Localizations" "AuthGateway" "Dictionaries" "AuditTrail" "Profile")

# Loop through each microservice and delete the Migrations folder if it exists
for microserviceName in "${microservices[@]}"; do
  MIGRATIONS_DIR="$BASE_DIR/$microserviceName/$microserviceName.Domain/Migrations"
  if [ -d "$MIGRATIONS_DIR" ]; then
    rm -rf "$MIGRATIONS_DIR"/*
    echo "All files in the $MIGRATIONS_DIR folder have been deleted."
  else
    echo "Migrations folder $MIGRATIONS_DIR does not exist."
  fi
done

echo "----------------------"
echo "Migration folders deleted."
echo "----------------------"
