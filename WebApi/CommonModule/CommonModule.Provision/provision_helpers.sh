#!/bin/bash

# Define variables
localization_db="JP_LocalizationDb"
dictionary_db="JP_DictionaryDb"
users_db="JP_UserDb"
auditTrail_db="JP_AuditTrailDb"

# Function to get the database name based on the environment
getDbName() {
  local db=$1
  echo "$db"
}

getDbNameLocalization() {
  getDbName "$localization_db"
}

getDbNameDictionary() {
  getDbName "$dictionary_db"
}

getDbNameUser() {
  getDbName "$users_db"
}

getDbNameAuditTrail() {
  echo "$auditTrail_db"
}