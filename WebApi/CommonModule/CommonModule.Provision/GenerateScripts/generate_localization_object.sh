#!/bin/bash

echo "🧠 Generating LOCALIZATION_KEYS object from CSV..."

# Config
SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
ANGULAR_BASE_DIR=$(echo "$SCRIPT_DIR" | sed 's|/WebApi/CommonModule/CommonModule.Provision/GenerateScripts||')
CSV_FILE="$ANGULAR_BASE_DIR/WebApi/CommonModule/CommonModule.Provision/InitData/Localizations/a1-localizations_en.csv"
OUTPUT_FILE="$ANGULAR_BASE_DIR/WebClient/Shared/projects/amarty/localizations/lib/localization_keys_object.ts"
TMP_KEYS_FILE="/tmp/localization_keys_list.txt"

# Validate input
if [[ ! -f "$CSV_FILE" ]]; then
  echo "❌ CSV file not found: $CSV_FILE"
  exit 1
fi

# Extract keys from CSV (skip header)
tail -n +2 "$CSV_FILE" | awk -F ';' '{ print $3 }' | grep -v '^$' | sort -u > "$TMP_KEYS_FILE"

key_count=$(cat "$TMP_KEYS_FILE" | wc -l | xargs)
echo "✅ Found $key_count unique keys"

# Start writing output
echo "// Auto-generated from a1-localizations_en.csv" > "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# 1. Generate object and write export in Python (no newline between = and {)
python3 <<EOF >> "$OUTPUT_FILE"
import sys
from collections import defaultdict

def nested(): return defaultdict(nested)
root = nested()

with open("$TMP_KEYS_FILE", "r") as f:
    keys = [line.strip() for line in f.readlines() if line.strip()]

for key in keys:
    parts = key.split('.')
    d = root
    for part in parts[:-1]:
        d = d[part]
    d[parts[-1]] = key

def convert(obj):
    if isinstance(obj, defaultdict):
        return {k: convert(v) for k, v in obj.items()}
    return obj

def to_ts(obj, indent=1):
    space = '  ' * indent
    if isinstance(obj, dict):
        lines = []
        for k, v in sorted(obj.items()):
            lines.append(f"{space}{k}: {to_ts(v, indent + 1)},")
        return "{\n" + '\\n'.join(lines) + f"\n{'  ' * (indent - 1)}}}"
    return f"'{obj}'"

print("export const LOCALIZATION_KEYS = " + to_ts(convert(root)) + " as const;")
EOF

# 2. Append union type
echo "" >> "$OUTPUT_FILE"
echo "export type LocalizationKey =" >> "$OUTPUT_FILE"
awk '{ print "  | \x27"$0"\x27" }' "$TMP_KEYS_FILE" >> "$OUTPUT_FILE"
echo ";" >> "$OUTPUT_FILE"

# Clean up
rm -f "$TMP_KEYS_FILE"
echo "✅ localization_keys_object.ts generated with $key_count keys and perfect formatting"
