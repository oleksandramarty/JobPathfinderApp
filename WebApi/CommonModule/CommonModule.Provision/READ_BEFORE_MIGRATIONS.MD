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

## Copilot locale promt
```plaintext
# Copilot locale promt
Based on this example:
550e8400-e29b-41d4-a716-100000000286;en;FAVORITE_EXPENSES.CREATE_NEW;Create New Favorite Expense;Create New Favorite Expense;
and this pattern:
id;locale;key;valueEn;value;

create the same records for locales:
en, es, fr, ua, ru, de, it

for each record increment GUID id +1
like 1 new record will be 550e8400-e29b-41d4-a716-100000000287
2 new - 550e8400-e29b-41d4-a716-100000000288 etc

also keep in mind that:
for en we use GUID pattern 550e8400-e29b-41d4-a716-100000000286
for es - 550e8400-e29b-41d4-a716-200000000287
etc
for each new locale we use different digit

keep in mind that for each locale we have GUID LOCALE CODE KEY TRANSLATION_EN TRANSLATION_CURRENT_LOCALE

do it for:
I will provide you KEY and English TRANSLATIONS use this translation for english for all and translate only my provided translation to all locales

for example: USER.MENU = Menu
in this example KEY is USER.MENU
translation is Menu
Please use translation for all locales
if you dont see translation after = create your own

START from 312

    public const string StatusNew = "STATUS.NEW";
    public const string StatusActive = "STATUS.ACTIVE";
    public const string StatusInactive = "STATUS.INACTIVE";
    public const string StatusBlocked = "STATUS.BLOCKED";
    public const string StatusDeleted = "STATUS.DELETED";
    public const string StatusPending = "STATUS.PENDING";
    public const string StatusApproved = "STATUS.APPROVED";
    public const string StatusRejected = "STATUS.REJECTED";
    public const string StatusCompleted = "STATUS.COMPLETED";
    public const string StatusCancelled = "STATUS.CANCELLED";
    public const string StatusArchived = "STATUS.ARCHIVED";

do all for en after all for es etc
do without empty lines

do it in one file
```