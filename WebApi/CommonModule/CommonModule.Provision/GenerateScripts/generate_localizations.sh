#!/bin/bash

echo "🔄 Extracting localizations data from CSVs..."

locales=("en" "es" "fr" "ua" "ru" "de" "it")
index=0

ANGULAR_BASE_DIR=$(cd "$(dirname "$0")" && pwd | sed 's|/WebApi/CommonModule/CommonModule.Provision/GenerateScripts||')
output_dir="$ANGULAR_BASE_DIR/WebClient/Shared/projects/amarty/localizations/lib"

mkdir -p "$output_dir"
rm -f "$output_dir/localization_"*.ts

for i in "${!locales[@]}"; do
  locale="${locales[$i]}"
  csv_file="$(cd "$(dirname "$0")" && pwd | sed 's|/GenerateScripts||')/InitData/Localizations/a$((i+1))-localizations_${locale}.csv"
  output_file="$output_dir/localization_${locale}.ts"

  if [[ ! -f "$csv_file" ]]; then
    echo "⚠️  Skipping missing file: $csv_file"
    continue
  fi

  echo "// Auto-generated file from a$((i+1))-localizations_${locale}.csv" > "$output_file"
  echo "" >> "$output_file"
  echo "export const localization_${locale}: Map<string, string> = new Map<string, string>([" >> "$output_file"

  {
    read  # Skip header
    while IFS=';' read -r id locale key valueEn value isPublic; do
      ((index++))
      value_cleaned=$(echo "$value" | sed "s/''/'/g" | sed "s/'/\\\'/g")
      echo "  ['$key', '$value_cleaned']," >> "$output_file"
    done
  } < "$csv_file"

  echo "]);" >> "$output_file"
done

echo "📦 $index record(s) processed in total."
