#!/bin/bash

echo "Extracting role data from CSV..."

# Define the path to the CSV file
csv_file="$(cd "$(dirname "$0")" && pwd | sed 's|/GenerateScripts||')/InitData/roles.csv"

# Define the output TypeScript file path
ANGULAR_BASE_DIR=$(cd "$(dirname "$0")" && pwd | sed 's|/WebApi/CommonModule/CommonModule.Provision/GenerateScripts||')
output_file="$ANGULAR_BASE_DIR/WebClient/Shared/projects/amarty/api/lib/dictionaries/roles.ts"

# Start writing the TypeScript file
echo "// Auto-generated TypeScript file with role data" > "$output_file"
echo "" >> "$output_file"
echo "import { RoleResponse, StatusEnum } from '../api.model';" >> "$output_file"
echo "" >> "$output_file"

# Start array declaration
echo "export const RoleData: RoleResponse[] = [" >> "$output_file"

# Read the CSV file and process each row
tail -n +2 "$csv_file" | while IFS=';' read -r id title userRole; do
  echo "  { id: $id, title: \`$title\`, userRole: $userRole } as RoleResponse," >> "$output_file"
done

# Close the array
echo "];" >> "$output_file"
echo "✅ roles.ts file generated successfully at $output_file"
