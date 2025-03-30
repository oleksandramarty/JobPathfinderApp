#!/bin/bash

echo "Extracting skill data from CSV..."

# Define the path to the CSV file
csv_file="$(cd "$(dirname "$0")" && pwd | sed 's|/GenerateScripts||')/InitData/skills.csv"

# Define the output TypeScript file path
ANGULAR_BASE_DIR=$(cd "$(dirname "$0")" && pwd | sed 's|/WebApi/CommonModule/CommonModule.Provision/GenerateScripts||')
output_file="$ANGULAR_BASE_DIR/WebClient/Shared/projects/amarty/dictionaries/lib/skills.ts"

# Start writing the TypeScript file
echo "// Auto-generated TypeScript file with skill data" > "$output_file"
echo "" >> "$output_file"
echo "import { SkillResponse, StatusEnum } from '@amarty/models';" >> "$output_file"
echo "" >> "$output_file"

# Start array declaration
echo "export const SkillData: SkillResponse[] = [" >> "$output_file"

# Read the CSV file and process each row
tail -n +2 "$csv_file" | while IFS=';' read -r id title; do
  echo "  { id: $id, title: \`$title\` } as SkillResponse," >> "$output_file"
done

# Close the array
echo "];" >> "$output_file"
echo "✅ skills.ts file generated successfully at $output_file"
