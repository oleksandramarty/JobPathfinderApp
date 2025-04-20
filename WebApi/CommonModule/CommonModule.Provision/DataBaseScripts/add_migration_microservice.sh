#!/bin/bash

echo "----------------------"
echo "Adding migrations..."
echo "----------------------"

# Get the microservice name from the command line argument
microservices=("Localizations" "AuthGateway" "Dictionaries" "AuditTrail" "Profile")
migrationNames=("InitLocalization" "InitUser" "InitDictionary" "InitAuditTrail" "InitProfile")
shouldRunMigrations=(true true true true true)

# Get the directory of the current script
SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)

# Extract the desired part of the script directory
BASE_DIR=$(echo "$SCRIPT_DIR" | sed 's|/CommonModule/CommonModule.Provision/DataBaseScripts||')

# Loop through each microservice and run the migration command if shouldRunMigrations is true
for index in "${!microservices[@]}"; do
  if [ "${shouldRunMigrations[$index]}" = true ]; then
    microserviceName=${microservices[$index]}
    migrationName=${migrationNames[$index]}

    # Change to the target directory relative to the script's location
    cd "$BASE_DIR/$microserviceName/$microserviceName.Domain" || { echo "Directory not found: $BASE_DIR/$microserviceName/$microserviceName.Domain"; exit 1; }

    # Run the migration command
    dotnet ef migrations add "$migrationName" --context "${microserviceName}DataContext" --output-dir Migrations --startup-project "../$microserviceName.ClientApi/$microserviceName.ClientApi.csproj"
  fi
done

echo "----------------------"
echo "Migrations added."
echo "----------------------"
