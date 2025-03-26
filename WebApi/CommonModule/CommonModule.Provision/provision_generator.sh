#!/bin/bash

SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)

echo "Provision generator running..."

# Make each script executable and run it
chmod +x "$SCRIPT_DIR/GenerateScripts/generate_countries.sh"
"$SCRIPT_DIR/GenerateScripts/generate_countries.sh"

chmod +x "$SCRIPT_DIR/GenerateScripts/generate_currencies.sh"
"$SCRIPT_DIR/GenerateScripts/generate_currencies.sh"

chmod +x "$SCRIPT_DIR/GenerateScripts/generate_languages.sh"
"$SCRIPT_DIR/GenerateScripts/generate_languages.sh"

chmod +x "$SCRIPT_DIR/GenerateScripts/generate_locales.sh"
"$SCRIPT_DIR/GenerateScripts/generate_locales.sh"

chmod +x "$SCRIPT_DIR/GenerateScripts/generate_localizations.sh"
"$SCRIPT_DIR/GenerateScripts/generate_localizations.sh"

chmod +x "$SCRIPT_DIR/GenerateScripts/generate_roles.sh"
"$SCRIPT_DIR/GenerateScripts/generate_roles.sh"

chmod +x "$SCRIPT_DIR/GenerateScripts/generate_simple_dictionaries.sh"
"$SCRIPT_DIR/GenerateScripts/generate_simple_dictionaries.sh"

chmod +x "$SCRIPT_DIR/GenerateScripts/generate_skills.sh"
"$SCRIPT_DIR/GenerateScripts/generate_skills.sh"


