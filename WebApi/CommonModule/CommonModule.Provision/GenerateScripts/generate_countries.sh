#!/bin/bash

echo "Extracting country data from CSV..."

# Path to the CSV file
csv_file="$(cd "$(dirname "$0")" && pwd | sed 's|/GenerateScripts||')/InitData/countries.csv"

# Path to output TypeScript file
ANGULAR_BASE_DIR=$(cd "$(dirname "$0")" && pwd | sed 's|/WebApi/CommonModule/CommonModule.Provision/GenerateScripts||')
output_file="$ANGULAR_BASE_DIR/WebClient/Shared/projects/amarty/api/lib/dictionaries/countries.ts"

# Start writing TypeScript file
echo "// Auto-generated TypeScript file with country data" > "$output_file"
echo "" >> "$output_file"
echo "import { CountryResponse, StatusEnum } from '../api.model';" >> "$output_file"
echo "" >> "$output_file"

# Start array declaration
echo "export const CountryData: CountryResponse[] = [" >> "$output_file"

# Read CSV file and process each line
tail -n +2 "$csv_file" | while IFS=';' read -r id code titleEn title status; do
  # Replace '' with '
  titleEn_cleaned=$(echo "$titleEn" | sed "s/''/'/g")
  echo "  { id: $id, code: \`$code\`, titleEn: \`$titleEn_cleaned\`, title: \`$title\`, status: StatusEnum.Active } as CountryResponse," >> "$output_file"
done

# Close array
echo "];" >> "$output_file"
echo "✅ countries.ts file generated successfully at $output_file"
