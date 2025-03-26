#!/bin/bash

echo "Extracting language data from CSV..."

# Path to the CSV file
csv_file="$(cd "$(dirname "$0")" && pwd | sed 's|/GenerateScripts||')/InitData/languages.csv"

# Path to output TypeScript file
ANGULAR_BASE_DIR=$(cd "$(dirname "$0")" && pwd | sed 's|/WebApi/CommonModule/CommonModule.Provision/GenerateScripts||')
output_file="$ANGULAR_BASE_DIR/WebClient/Shared/projects/amarty/api/lib/dictionaries/languages.ts"

# Start writing TypeScript file
echo "// Auto-generated TypeScript file with language data" > "$output_file"
echo "" >> "$output_file"
echo "import { LanguageResponse, StatusEnum } from '../api.model';" >> "$output_file"
echo "" >> "$output_file"

# Start array declaration
echo "export const LanguageData: LanguageResponse[] = [" >> "$output_file"

# Read CSV file and process each line
tail -n +2 "$csv_file" | while IFS=';' read -r id code titleEn title status; do
  # Replace '' with '
  titleEn_cleaned=$(echo "$titleEn" | sed "s/''/'/g")

  echo "  { id: $id, isoCode: \`$code\`, titleEn: \`$titleEn_cleaned\`, title: \`$title\`, status: StatusEnum.Active } as LanguageResponse," >> "$output_file"
done

# Close array
echo "];" >> "$output_file"
echo "✅ languages.ts file generated successfully at $output_file"
