#!/bin/bash

echo "Extracting simple dictionaries data from CSVs..."

file_names=("experience_levels" "job_types" "job_sources" "skill_levels" "language_levels" "work_arrangements")
class_names=("ExperienceLevel" "JobType" "JobSource" "SkillLevel" "LanguageLevel" "WorkArrangement")

for i in "${!file_names[@]}"; do
  # Path to the CSV file
  csv_file="$(cd "$(dirname "$0")" && pwd | sed 's|/GenerateScripts||')/InitData/${file_names[$i]}.csv"
  
  # Path to output TypeScript file
  ANGULAR_BASE_DIR=$(cd "$(dirname "$0")" && pwd | sed 's|/WebApi/CommonModule/CommonModule.Provision/GenerateScripts||')
  output_file="$ANGULAR_BASE_DIR/WebClient/Shared/projects/amarty/dictionaries/lib/${file_names[$i]}.ts"
  
  # Start writing TypeScript file
  echo "// Auto-generated TypeScript file with ${file_names[$i]} data" > "$output_file"
  echo "" >> "$output_file"
  echo "import { ${class_names[$i]}Response, StatusEnum } from '@amarty/models';" >> "$output_file"
  echo "" >> "$output_file"
  
  # Start array declaration
  echo "export const ${class_names[$i]}Data: ${class_names[$i]}Response[] = [" >> "$output_file"
  # Read CSV file and process each line
  tail -n +2 "$csv_file" | while IFS=';' read -r id title titleEn status; do      
    echo "  { id: $id, title: \`$title\`, titleEn: \`$titleEn\`, status: StatusEnum.Active } as ${class_names[$i]}Response," >> "$output_file"
  done
  echo "];" >> "$output_file"
  echo "✅ ${file_names[$i]}.ts file generated successfully at $output_file"
done
