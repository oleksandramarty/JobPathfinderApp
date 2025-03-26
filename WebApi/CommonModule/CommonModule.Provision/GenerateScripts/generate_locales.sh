#!/bin/bash

echo "Extracting locale data from CSV..."

# Path to the CSV file
csv_file="$(cd "$(dirname "$0")" && pwd | sed 's|/GenerateScripts||')/InitData/locales.csv"

# Path to the TypeScript file
ANGULAR_BASE_DIR=$(cd "$(dirname "$0")" && pwd | sed 's|/WebApi/CommonModule/CommonModule.Provision/GenerateScripts||')
output_file="$ANGULAR_BASE_DIR/WebClient/Shared/projects/amarty/api/lib/dictionaries/locales.ts"

# Start by writing the TypeScript file
echo "// Auto-generated TypeScript file with locale data" > "$output_file"
echo "" >> "$output_file"
echo "import { LocaleResponse, StatusEnum } from '../api.model';" >> "$output_file"
echo "" >> "$output_file"

# Array declaration
echo "export const LocaleData: LocaleResponse[] = [" >> "$output_file"

# Read the CSV file and write the data to the TypeScript file
tail -n +2 "$csv_file" | while IFS=';' read -r id isoCode title titleEn isDefault status localeEnum culture; do
  isDefaultBool=$( [ "$isDefault" == "1" ] && echo true || echo false )
  echo "  { id: $id, isoCode: \`$isoCode\`, title: \`$title\`, titleEn: \`$titleEn\`, isDefault: $isDefaultBool, status: StatusEnum.Active, localeEnum: $localeEnum, culture: \`$culture\` } as LocaleResponse," >> "$output_file"
done

# Close the array
echo "];" >> "$output_file"
echo "✅ locales.ts file generated successfully at $output_file"
