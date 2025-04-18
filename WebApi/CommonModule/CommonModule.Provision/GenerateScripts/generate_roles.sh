#!/bin/bash

echo "Extracting role data from CSV..."

# Define the path to the CSV file
csv_file="$(cd "$(dirname "$0")" && pwd | sed 's|/GenerateScripts||')/InitData/roles.csv"

# Define the output TypeScript file path
ANGULAR_BASE_DIR=$(cd "$(dirname "$0")" && pwd | sed 's|/WebApi/CommonModule/CommonModule.Provision/GenerateScripts||')
output_file="$ANGULAR_BASE_DIR/WebClient/Shared/projects/amarty/dictionaries/lib/roles.ts"

# Start writing the TypeScript file
echo "// Auto-generated TypeScript file with role data" > "$output_file"
echo "" >> "$output_file"
echo "import { RoleResponse, StatusEnum } from '@amarty/models';" >> "$output_file"
echo "" >> "$output_file"

# Start array declaration
echo "export const RoleData: RoleResponse[] = [" >> "$output_file"

# Read the CSV file and process each row
tail -n +2 "$csv_file" | while IFS=';' read -r id title userRole; do
  # Clean and escape the title
  title_cleaned=$(echo "$title" | sed "s/''/'/g" | sed "s/'/\\\'/g")
  echo "  { id: $id, title: '$title_cleaned', userRole: $userRole } as RoleResponse," >> "$output_file"
done

# Close the array
echo "];" >> "$output_file"
echo "✅ roles.ts file generated successfully at $output_file"
