#!/bin/bash

echo "Extracting currency data from CSV..."

# Path to the CSV file
csv_file="$(cd "$(dirname "$0")" && pwd | sed 's|/GenerateScripts||')/InitData/currencies.csv"

# Path to output TypeScript file
ANGULAR_BASE_DIR=$(cd "$(dirname "$0")" && pwd | sed 's|/WebApi/CommonModule/CommonModule.Provision/GenerateScripts||')
output_file="$ANGULAR_BASE_DIR/WebClient/Shared/projects/amarty/dictionaries/lib/currencies.ts"

# Start writing TypeScript file
echo "// Auto-generated TypeScript file with currency data" > "$output_file"
echo "" >> "$output_file"
echo "import { CurrencyResponse, StatusEnum } from '@amarty/models';" >> "$output_file"
echo "" >> "$output_file"

# Start array declaration
echo "export const CurrencyData: CurrencyResponse[] = [" >> "$output_file"

# Read CSV file and process each line
tail -n +2 "$csv_file" | while IFS=';' read -r id titleEn title code symbol status; do  
  # Clean and escape values
  titleEn_cleaned=$(echo "$titleEn" | sed "s/''/'/g" | sed "s/'/\\\'/g")
  title_cleaned=$(echo "$title" | sed "s/''/'/g" | sed "s/'/\\\'/g")
  code_cleaned=$(echo "$code" | sed "s/''/'/g" | sed "s/'/\\\'/g")
  symbol_cleaned=$(echo "$symbol" | sed "s/''/'/g" | sed "s/'/\\\'/g")

  echo "  { id: $id, titleEn: '$titleEn_cleaned', title: '$title_cleaned', code: '$code_cleaned', symbol: '$symbol_cleaned', status: StatusEnum.Active } as CurrencyResponse," >> "$output_file"
done

# Close array
echo "];" >> "$output_file"
echo "✅ currencies.ts file generated successfully at $output_file"
