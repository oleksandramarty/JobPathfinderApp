#!/bin/bash

echo "Extracting localizations data from CSVs..."

locales=("en" "es" "fr" "ua" "ru" "de" "it")
index=0

# Path to output TypeScript file
ANGULAR_BASE_DIR=$(cd "$(dirname "$0")" && pwd | sed 's|/WebApi/CommonModule/CommonModule.Provision/GenerateScripts||')
output_file="$ANGULAR_BASE_DIR/WebClient/Shared/projects/amarty/api/lib/dictionaries/localizations.ts"

# Start writing TypeScript file
echo "// Auto-generated TypeScript file for static localizations" > "$output_file"
for i in "${!locales[@]}"; do
  echo "// Auto-generated TypeScript file with a$((i+1))-localizations_${locales[$i]}.csv data" >> "$output_file"
done
echo "" >> "$output_file"
echo "import {LocalizationItemResponse, LocalizationResponse, LocalizationsResponse} from '../api.model';" >> "$output_file"
echo "" >> "$output_file"
echo "export const LocalizationsData: LocalizationsResponse = {" >> "$output_file"
echo "  data: [" >> "$output_file"

for i in "${!locales[@]}"; do
  # Path to the CSV file
  csv_file="$(cd "$(dirname "$0")" && pwd | sed 's|/GenerateScripts||')/InitData/Localizations/a$((i+1))-localizations_${locales[$i]}.csv"
  
  echo "    {" >> "$output_file"
  echo "      locale: '${locales[$i]}'," >> "$output_file"
  echo "      items: [" >> "$output_file"

  # Read CSV file and process each line
  {
    read  # Skip the first line (header)
    while IFS=';' read -r id locale key valueEn value isPublic; do
      # Increment index correctly
      ((index++))

      # Replace '' with '
      value_cleaned=$(echo "$value" | sed "s/''/'/g")

      echo "          { key: \`$key\`, value: \`$value_cleaned\`} as LocalizationItemResponse," >> "$output_file"
    done
  } < "$csv_file"
  
  echo "      ]" >> "$output_file"
  echo "    } as LocalizationResponse," >> "$output_file"
done

echo "  ]," >> "$output_file"
echo "  version: 'static'" >> "$output_file"
echo "} as LocalizationsResponse;" >> "$output_file"

echo "$index record(s) have been processed"
echo "✅ localizations.ts file generated successfully at $output_file"
