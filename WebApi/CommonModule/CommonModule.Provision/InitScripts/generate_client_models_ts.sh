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
  outputClientFile="$ANGULAR_BASE_DIR/WebClient/Shared/projects/amarty/api/lib/$microserviceClientApiName"

  # ✅ Create folder if not exist
  mkdir -p "$outputDir"

# Write the content to the specified file
cat <<EOL > "$outputDir/$outputFileName"
{
  "runtime": "Net90",
  "documentGenerator": {
    "aspNetCoreToOpenApi": {
      "project": "$microserviceName.ClientApi.csproj",
      "msBuildProjectExtensionsPath": null,
      "configuration": null,
      "runtime": null,
      "targetFramework": null,
      "noBuild": false,
      "verbose": true,
      "workingDirectory": null,
      "requireParametersWithoutDefault": false,
      "apiGroupNames": null,
      "defaultPropertyNameHandling": "Default",
      "defaultReferenceTypeNullHandling": "Null",
      "defaultDictionaryValueReferenceTypeNullHandling": "NotNull",
      "defaultResponseReferenceTypeNullHandling": "NotNull",
      "defaultEnumHandling": "Integer",
      "flattenInheritanceHierarchy": false,
      "generateKnownTypes": true,
      "generateEnumMappingDescription": false,
      "generateXmlObjects": false,
      "generateAbstractProperties": false,
      "generateAbstractSchemas": true,
      "ignoreObsoleteProperties": false,
      "allowReferencesWithProperties": false,
      "excludedTypeNames": [],
      "serviceHost": null,
      "serviceBasePath": null,
      "serviceSchemes": [],
      "infoTitle": "My Title",
      "infoDescription": null,
      "infoVersion": "1.0.0",
      "documentTemplate": null,
      "documentProcessorTypes": [],
      "operationProcessorTypes": [],
      "typeNameGeneratorType": null,
      "schemaNameGeneratorType": null,
      "contractResolverType": null,
      "serializerSettingsType": null,
      "useDocumentProvider": true,
      "documentName": "v1",
      "aspNetCoreEnvironment": null,
      "createWebHostBuilderMethod": null,
      "startupType": null,
      "allowNullableBodyParameters": true,
      "output": null,
      "outputType": "Swagger2",
      "newLineBehavior": "Auto",
      "assemblyPaths": [],
      "assemblyConfig": null,
      "referencePaths": [],
      "useNuGetCache": false
    }
  },
  "codeGenerators": {
    "openApiToTypeScriptClient": {
      "className": "$microserviceClientApiClassName",
      "moduleName": "",
      "namespace": "",
      "typeScriptVersion": 5.4,
      "template": "Angular",
      "promiseType": "Promise",
      "httpClass": "HttpClient",
      "withCredentials": false,
      "useSingletonProvider": true,
      "injectionTokenType": "InjectionToken",
      "rxJsVersion": 7.8,
      "dateTimeType": "Date",
      "nullValue": "Undefined",
      "generateClientClasses": true,
      "generateClientInterfaces": false,
      "generateOptionalParameters": true,
      "exportTypes": true,
      "wrapDtoExceptions": false,
      "exceptionClass": "ApiException",
      "clientBaseClass": null,
      "wrapResponses": false,
      "wrapResponseMethods": [],
      "generateResponseClasses": true,
      "responseClass": "SwaggerResponse",
      "protectedMethods": [],
      "configurationClass": null,
      "useTransformOptionsMethod": false,
      "useTransformResultMethod": false,
      "generateDtoTypes": $([ "$microserviceName" == "CommonModule" ] && echo true || echo false),
      "operationGenerationMode": "SingleClientFromOperationId",
      "markOptionalProperties": true,
      "generateCloneMethod": false,
      "typeStyle": "Class",
      "enumStyle": "Enum",
      "useLeafType": false,
      "classTypes": [],
      "extendedClasses": [],
      "extensionCode": null,
      "generateDefaultValues": true,
      "excludedTypeNames": [],
      "excludedParameterNames": [],
      "handleReferences": false,
      "generateConstructorInterface": true,
      "convertConstructorInterfaceData": false,
      "importRequiredTypes": true,
      "useGetBaseUrlMethod": false,
      "baseUrlTokenName": "API_BASE_URL_$microserviceName",
      "queryNullValue": "",
      "useAbortSignal": false,
      "inlineNamedDictionaries": false,
      "inlineNamedAny": false,
      "templateDirectory": null,
      "typeNameGeneratorType": "null",
      "propertyNameGeneratorType": null,
      "enumNameGeneratorType": null,
      "serviceHost": null,
      "serviceSchemes": null,
      "output": "$outputClientFile",
      "newLineBehavior": "Auto"
    }
  }
}
EOL

  # ✅ Removing all clients
  rm -f "$outputClientFile"

  # ✅ Grant access to write clients
  chmod -R u+w "$outputDir"

  # ✅ Launching clients configs 
  cd "$outputDir" && nswag run "$outputFileName"

  # ✅ Removing temp files
  rm -f "$outputFileName"
  
# ✅ Path to generated client file
  CLIENT_FILE="$outputClientFile"
  
  # ✅ Skip processing if file is api.model.ts
  if [[ "$CLIENT_FILE" != *"api.model.ts" ]]; then
  
      # ✅ Remove ApiException class and throwException from generated file
      sed -E -i '' '/^export class ApiException/,/^}/d' "$CLIENT_FILE"
      sed -E -i '' '/^function throwException/,/^}/d' "$CLIENT_FILE"
    
      # ✅ Add import for shared exception (at the very top)
      sed -i '' '1s|^|import { ApiException, throwException } from "@amarty/models";\n|' "$CLIENT_FILE"
    
      # ✅ Insert api.model import as the second line (after the first import)
      sed -i '' '1a\
    import {\
      AuthSignInRequest,\
      ErrorMessageModel,\
      JwtTokenResponse,\
      UpdateUserPreferencesCommand,\
      LocalizationsResponse,\
      SiteSettingsResponse,\
      UserResponse\
    } from "@amarty/models";
    ' "$CLIENT_FILE"
  
  fi

  echo "Client API for $microserviceName successfully generated."
done

echo "Client API configuration for all microservices completed successfully."
