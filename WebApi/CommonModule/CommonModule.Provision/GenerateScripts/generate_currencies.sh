#!/bin/bash

echo "Extracting currency data from CSV..."

# Path to the CSV file
csv_file="$(cd "$(dirname "$0")" && pwd | sed 's|/GenerateScripts||')/InitData/currencies.csv"

# Path to output TypeScript file
ANGULAR_BASE_DIR=$(cd "$(dirname "$0")" && pwd | sed 's|/WebApi/CommonModule/CommonModule.Provision/GenerateScripts||')
output_file="$ANGULAR_BASE_DIR/WebClient/Shared/projects/amarty/api/lib/dictionaries/currencies.ts"

# Start writing TypeScript file
echo "// Auto-generated TypeScript file with currency data" > "$output_file"
echo "" >> "$output_file"
echo "import { CurrencyResponse, StatusEnum } from '../api.model';" >> "$output_file"
echo "" >> "$output_file"

# Start array declaration
echo "export const CurrencyData: CurrencyResponse[] = [" >> "$output_file"

# Read CSV file and process each line
tail -n +2 "$csv_file" | while IFS=';' read -r id titleEn title code symbol status; do  
  echo "  { id: $id, titleEn: \`$titleEn\`, title: \`$title\`, code: \`$code\`, symbol: \`$symbol\`, status: StatusEnum.Active } as CurrencyResponse," >> "$output_file"
done

# Close array
echo "];" >> "$output_file"
echo "✅ currencies.ts file generated successfully at $output_file"
