#!/bin/bash

echo "----------------------"
echo "Applying migrations..."
echo "----------------------"

# Get the absolute path of the script directory
SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)

# Extract the desired part of the script directory
BASE_DIR=$(echo "$SCRIPT_DIR" | sed 's|/CommonModule/CommonModule.Provision/DataBaseScripts||')

# Define the microservice names as an array
microservices=("Localizations" "AuthGateway" "Dictionaries" "AuditTrail" "Profile")

# Loop through each microservice and apply the migrations
for microserviceName in "${microservices[@]}"; do
  # Change to the target directory relative to the script's location
  cd "$BASE_DIR/$microserviceName/$microserviceName.Domain" || { echo "Directory not found: $BASE_DIR/$microserviceName/$microserviceName.Domain"; exit 1; }

  # Apply the migrations
  dotnet ef database update --startup-project "../$microserviceName.ClientApi/$microserviceName.ClientApi.csproj"
done

echo "----------------------"
echo "Migrations applied."
echo "----------------------"
