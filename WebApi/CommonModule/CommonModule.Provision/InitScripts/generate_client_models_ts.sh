#!/bin/bash

# Get base dir
BASE_DIR=$(cd "$(dirname "$0")" && pwd | sed 's|/CommonModule/CommonModule.Provision/InitScripts||')
ANGULAR_BASE_DIR=$(cd "$(dirname "$0")" && pwd | sed 's|/WebApi/CommonModule/CommonModule.Provision/InitScripts||')

# Microservices arrays
microserviceNames=("AuthGateway" "Dictionaries" "AuditTrail" "Localizations" "CommonModule")
microserviceClientApiNames=("user-api.service.ts" "dictionary-api.service.ts" "audit-trail-api.service.ts" "localization-api.service.ts" "api.model.ts")
microserviceClientApiClassNames=("UserApiClient" "DictionaryApiClient" "AuditTrailApiClient" "LocalizationApiClient" "ApiModel")

# 🔄 Generating API clients
for i in "${!microserviceNames[@]}"; do
  microserviceName="${microserviceNames[$i]}"
  microserviceClientApiName="${microserviceClientApiNames[$i]}"
  microserviceClientApiClassName="${microserviceClientApiClassNames[$i]}"

  outputDir="$BASE_DIR/$microserviceName/$microserviceName.ClientApi"
  outputFileName="nswagconfig.nswag"
  if [[ "$microserviceClientApiClassName" == "ApiModel" ]]; then
    outputClientFile="$ANGULAR_BASE_DIR/WebClient/Shared/projects/amarty/models/lib/$microserviceClientApiName"
  else
    outputClientFile="$ANGULAR_BASE_DIR/WebClient/Shared/projects/amarty/api/lib/$microserviceClientApiName"
  fi
  # ✅ Create folder if not exist
  mkdir -p "$outputDir"

  # Write NSwag config
  cat <<EOL > "$outputDir/$outputFileName"
{
  "runtime": "Net90",
  "documentGenerator": {
    "aspNetCoreToOpenApi": {
      "project": "$microserviceName.ClientApi.csproj",
      "noBuild": false,
      "verbose": true,
      "useDocumentProvider": true,
      "documentName": "v1",
      "allowNullableBodyParameters": true,
      "outputType": "Swagger2"
    }
  },
  "codeGenerators": {
    "openApiToTypeScriptClient": {
      "className": "$microserviceClientApiClassName",
      "template": "Angular",
      "typeScriptVersion": 5.4,
      "httpClass": "HttpClient",
      "useSingletonProvider": true,
      "injectionTokenType": "InjectionToken",
      "rxJsVersion": 7.8,
      "nullValue": "Undefined",
      "generateClientClasses": true,
      "generateOptionalParameters": true,
      "exportTypes": true,
      "wrapDtoExceptions": false,
      "exceptionClass": "ApiException",
      "generateResponseClasses": true,
      "responseClass": "SwaggerResponse",
      "generateDtoTypes": $([ "$microserviceName" == "CommonModule" ] && echo true || echo false),
      "operationGenerationMode": "SingleClientFromOperationId",
      "markOptionalProperties": true,
      "typeStyle": "Class",
      "enumStyle": "Enum",
      "baseUrlTokenName": "API_BASE_URL_$microserviceName",
      "importRequiredTypes": true,
      "generateConstructorInterface": true,
      "output": "$outputClientFile"
    }
  }
}
EOL

  # ✅ Remove old client
  rm -f "$outputClientFile"

  # ✅ Set write access
  chmod -R u+w "$outputDir"

  # ✅ Run NSwag
  cd "$outputDir" && nswag run "$outputFileName"

  # ✅ Remove temporary config
  rm -f "$outputFileName"

  # ✅ Post-processing client
  CLIENT_FILE="$outputClientFile"
  if [[ "$CLIENT_FILE" != *"api.model.ts" ]]; then

    # Remove unwanted generated code
    sed -E -i '' '/^export class ApiException/,/^}/d' "$CLIENT_FILE"
    sed -E -i '' '/^function throwException/,/^}/d' "$CLIENT_FILE"

    # Define classes to optionally import
    classesToAdd=(
      "ApiException"
      "throwException"
      "AuthSignInRequest"
      "ErrorMessageModel"
      "JwtTokenResponse"
      "UpdateUserPreferencesCommand"
      "LocalizationsResponse"
      "SiteSettingsResponse"
      "UserResponse"
    )

    # Detect used classes
    usedClasses=()
    for className in "${classesToAdd[@]}"; do
      if grep -q "\b$className\b" "$CLIENT_FILE"; then
        usedClasses+=("$className")
      fi
    done

    # Insert import if needed
    if [[ ${#usedClasses[@]} -gt 0 ]]; then
      importBlock="import {\n"
      for idx in "${!usedClasses[@]}"; do
        class="${usedClasses[$idx]}"
        if [[ $idx -eq $((${#usedClasses[@]} - 1)) ]]; then
          importBlock+="  $class\n"
        else
          importBlock+="  $class,\n"
        fi
      done
      importBlock+="} from '@amarty/models';\n"

      # Insert at line 10
      awk -v insert="$importBlock" 'NR==10 { printf "%s", insert } { print }' "$CLIENT_FILE" > "$CLIENT_FILE.tmp" && mv "$CLIENT_FILE.tmp" "$CLIENT_FILE"
    fi
  fi

  echo "✅ Client API for $microserviceName successfully generated."
done

echo "🎉 Client API configuration for all microservices completed successfully."
