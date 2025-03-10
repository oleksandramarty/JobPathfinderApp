#!/bin/bash

# Получаем базовые директории
BASE_DIR=$(cd "$(dirname "$0")" && pwd | sed 's|/CommonModule/CommonModule.Provision/InitScripts||')
ANGULAR_BASE_DIR=$(cd "$(dirname "$0")" && pwd | sed 's|/WebApi/CommonModule/CommonModule.Provision/InitScripts||')

# Определяем микросервисы и их соответствующие файлы API-клиентов
microserviceNames=("AuthGateway" "Dictionaries" "AuditTrail" "Localizations" "CommonModule")
microserviceClientApiNames=("user-api.service.ts" "dictionary-api.service.ts" "audit-trail-api.service.ts" "localization-api.service.ts" "api.model.ts")
microserviceClientApiClassNames=("UserApiClient" "DictionaryApiClient" "AuditTrailApiClient" "LocalizationApiClient" "ApiModel")

# 🔄 Генерируем API-клиенты
for i in "${!microserviceNames[@]}"; do
  microserviceName="${microserviceNames[$i]}"
  microserviceClientApiName="${microserviceClientApiNames[$i]}"
  microserviceClientApiClassName="${microserviceClientApiClassNames[$i]}"

  outputDir="$BASE_DIR/$microserviceName/$microserviceName.ClientApi"
  outputFileName="nswagconfig.nswag"
  outputClientFile="$ANGULAR_BASE_DIR/WebClient/Shared/projects/amarty/api/lib/$microserviceClientApiName"

  # ✅ Создаем папку, если она отсутствует
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
      "useSingletonProvider": false,
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

  # ✅ Удаляем старый API-клиент перед генерацией
  rm -f "$outputClientFile"

  # ✅ Разрешаем запись в нужную папку
  chmod -R u+w "$outputDir"

  # ✅ Запускаем генерацию клиента
  cd "$outputDir" && nswag run "$outputFileName"

  # ✅ Удаляем временный файл конфигурации
  rm -f "$outputFileName"

  echo "Client API for $microserviceName successfully generated."
done

echo "Client API configuration for all microservices completed successfully."
