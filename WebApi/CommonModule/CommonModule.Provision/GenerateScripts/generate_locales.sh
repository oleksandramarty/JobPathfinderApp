#!/bin/bash

echo "Extracting locale data from CSV..."

# Path to the CSV file
csv_file="$(cd "$(dirname "$0")" && pwd | sed 's|/GenerateScripts||')/InitData/locales.csv"

# Path to the TypeScript file
ANGULAR_BASE_DIR=$(cd "$(dirname "$0")" && pwd | sed 's|/WebApi/CommonModule/CommonModule.Provision/GenerateScripts||')
output_file="$ANGULAR_BASE_DIR/WebClient/Shared/projects/amarty/dictionaries/lib/locales.ts"

# Start by writing the TypeScript file
echo "// Auto-generated TypeScript file with locale data" > "$output_file"
echo "" >> "$output_file"
echo "import { LocaleResponse, StatusEnum } from '@amarty/models';" >> "$output_file"
echo "" >> "$output_file"

# Array declaration
echo "export const LocaleData: LocaleResponse[] = [" >> "$output_file"

# Read the CSV file and write the data to the TypeScript file
tail -n +2 "$csv_file" | while IFS=';' read -r id isoCode title titleEn isDefault status localeEnum culture; do
  isDefaultBool=$( [ "$isDefault" == "1" ] && echo true || echo false )

  # Escape single quotes in all string fields
  isoCode_cleaned=$(echo "$isoCode" | sed "s/''/'/g" | sed "s/'/\\\'/g")
  title_cleaned=$(echo "$title" | sed "s/''/'/g" | sed "s/'/\\\'/g")
  titleEn_cleaned=$(echo "$titleEn" | sed "s/''/'/g" | sed "s/'/\\\'/g")
  culture_cleaned=$(echo "$culture" | sed "s/''/'/g" | sed "s/'/\\\'/g")

  echo "  { id: $id, isoCode: '$isoCode_cleaned', title: '$title_cleaned', titleEn: '$titleEn_cleaned', isDefault: $isDefaultBool, status: StatusEnum.Active, localeEnum: $localeEnum, culture: '$culture_cleaned' } as LocaleResponse," >> "$output_file"
done

# Close the array
echo "];" >> "$output_file"
echo "✅ locales.ts file generated successfully at $output_file"
