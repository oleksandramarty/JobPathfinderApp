# !!!DO NOT FORGET TO UPDATE MIGRATION NAME!!!

## Replace ' to ''

## GUIDS FOR LOCALIZATIONS
`550e8400-e29b-41d4-a716-100000000000`

Follow the rule `a{LOCALE_ID}` where `LOCALE_ID` is a locale identifier. 
For example, `a3` for French means all IDs should be `550e8400-e29b-41d4-a716-{ID}00000000000` and follow the increment rule:

- `550e8400-e29b-41d4-a716-{ID}00000000001`
- `550e8400-e29b-41d4-a716-{ID}00000000002`
- `550e8400-e29b-41d4-a716-{ID}00000000003`
- ...
- `550e8400-e29b-41d4-a716-{ID}..........n`

## For new locale update `check_localizations.sh`
```shell
csv_files=(
"a1_localizations_en.csv" 
"a2_localizations_es.csv"
"a2_localizations_fr.csv"
"a2_localizations_ua.csv"
"a2_localizations_ru.csv"
"a2_localizations_de.csv"
)
  ```

## Provision flags
```shell
# Set the dropMigrations parameter
dropMigrations=false
# Set the addNewMigration parameter
addNewMigration=false
# Set the isBulkUpdate parameter
isBulkUpdate=false
```

## New Microservice
```shell
#Check DataBaseScripts Arrays for microservices
```

### GET Localization default key
```sql
SELECT
    "Id" || ';en;' || "Key" || ';' AS Result
FROM "JP_LocalizationDb"."Locales"."Localizations"
WHERE "LocaleId" = 1
ORDER BY "Id";
```

### Localizations SQL
```sql
SELECT
    Localizations."Id" || ';' ||
    Locales."IsoCode"  || ';' ||
    REPLACE(Localizations."Key", '.', '_') || ';' ||
    Localizations."ValueEn" || ';' ||
    Localizations."Value" || ';' ||
    CASE
        WHEN Localizations."IsPublic" = true THEN '1'
        ELSE '0'
        END || ';' AS "ConcatenatedColumn"
FROM "Locales"."Localizations" AS Localizations
         LEFT JOIN "Locales"."Locales" AS Locales ON Locales."Id" = Localizations."LocaleId"
WHERE "LocaleId" = 1;
```