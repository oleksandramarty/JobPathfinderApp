#!/bin/bash

echo "🔍 Generating localization keys from first CSV..."

# First CSV file
locale="en"

ANGULAR_BASE_DIR=$(cd "$(dirname "$0")" && pwd | sed 's|/WebApi/CommonModule/CommonModule.Provision/GenerateScripts||')
output_dir="$ANGULAR_BASE_DIR/WebClient/Shared/projects/amarty/localizations/lib"
csv_file="$(cd "$(dirname "$0")" && pwd | sed 's|/GenerateScripts||')/InitData/Localizations/a1-localizations_${locale}.csv"
output_file="$output_dir/localization_keys.ts"

mkdir -p "$output_dir"
rm -f "$output_file"

if [[ ! -f "$csv_file" ]]; then
  echo "❌ Missing file: $csv_file"
  exit 1
fi

echo "// Auto-generated keys file from a1-localizations_${locale}.csv" > "$output_file"
echo "" >> "$output_file"
echo "export const localization_keys: string[] = [" >> "$output_file"

{
  read  # skip header
  while IFS=';' read -r id locale key valueEn value isPublic; do
    echo "  '$key'," >> "$output_file"
  done
} < "$csv_file"

echo "];" >> "$output_file"

echo "✅ Keys file generated at: $output_file"
