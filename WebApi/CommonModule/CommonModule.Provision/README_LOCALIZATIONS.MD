# Localization CSV Generation Guide

## **Pattern:**
```
GUID;LOCALE;KEY;TRANSLATION_EN;TRANSLATION_CURRENT_LOCALE;1;1
```

## **Requirements:**

### **1. GUID Generation:**
- The GUID follows this pattern: `550e8400-e29b-41d4-a716-XXXXXXXXXXXX`.
- Each locale starts numbering **from a user-defined value**:
    - If the user sets `1`, English starts from `100000000001`, Spanish from `200000000001`, etc.
    - If the user sets `11`, English starts from `100000000011`, Spanish from `200000000011`, etc.
- The number increases sequentially for each key in a specific locale.

### **2. Locales:**
Generate translations for the following locales:
- **English (en) → GUID pattern starts from `100000000XXX`**
- **Spanish (es) → GUID pattern starts from `200000000XXX`**
- **French (fr) → GUID pattern starts from `300000000XXX`**
- **Ukrainian (ua) → GUID pattern starts from `400000000XXX`**
- **Russian (ru) → GUID pattern starts from `500000000XXX`**
- **German (de) → GUID pattern starts from `600000000XXX`**
- **Italian (it) → GUID pattern starts from `700000000XXX`**

*(Replace `XXX` with the user-defined starting value.)*

### **3. User-Defined Starting Value:**
- The user specifies the starting number (e.g., `1`, `11`, `101`, etc.).
- If `1` is provided, IDs will start from `100000000001`, `200000000001`, etc.
- If `11` is provided, IDs will start from `100000000011`, `200000000011`, etc.

### **4. Handling Apostrophes (`'`):**
- If a translation contains a **single quote (`'`)**, it should be replaced with **two single quotes (`''`)**.
- **Example:**
  ```
  Original:  avenue de l'Authion  
  Processed: avenue de l''Authion
  ```

### **5. Translation Rules:**
- The **English translation** is the default if no translation is available for a locale.
- If a specific translation for a locale exists, use it; otherwise, use translate the English version to locale.
- No empty lines in the output.
- Append `;1;1` at the end of each record.

## **Example Input Data:**
```
AUTH.GREETINGS = Greetings fellow, Honkler!
AUTH.SIGN_IN.JOKE = Maybe we need back to
COMMON.LOGIN_OR_EMAIL = Login or Email
COMMON.PASSWORD = Password
COMMON.CONFIRM_PASSWORD = Password
COMMON.REMEMBER_ME = Remember me
COMMON.FORGOT = Forgot
COMMON.SIGN_IN = Sign In
COMMON.SIGN_UP = Sign Up
AUTH.NO_ACCOUNT.SIGN_UP = Don''''t have an account? Sign Up
AUTH.HAS_ACCOUNT.SIGN_IN = Already have an account? Sign In
COMMON.LOGIN = Login
COMMON.EMAIL = Email
COMMON.CONFIRM_EMAIL = Confirm email
COMMON.PROCEED = Proceed
COMMON.FIRST_NAME = First Name
COMMON.LAST_NAME = Last Name
COMMON.NO_COMPLAINTS = No complaints
COMMON.WE_ARE_HONKING = We are honking since 2024!
COMMON.DO_NOT_STORE_SENS_DATA = DO NOT STORE ANY SENSITIVE DATA HERE!
COMMON.LIGHT_THEME = Light theme
COMMON.DARK_THEME = Dark theme
ERROR.PASSWORDS_DO_NOT_MATCH = Passwords do not match
ERROR.EMAILS_DO_NOT_MATCH = Emails do not match
ERROR.FIELD_REQUIRED = The field is required!
ERROR.CHECK_CHECKBOX = Please check the box!
ERROR.INVALID_EMAIL = Invalid email format!
MENU.HOME = Home
MENU.JOBS = Jobs
MENU.COMPANIES = Companies
MENU.KARMA = Karma
COMMON.WELCOME_BACK = Welcome back
MENU.ACTIVE_APPLICATIONS = Active Applications
MENU.TODOS = TODOs
MENU.RESPONSE_RATE = Response Rate
MENU.UPCOMING_INTERVIEWS = Upcoming Interviews
COMMON.NEW_APPLICATION = New Application
STATS.JOB_APPLICATIONS_TREND = Job Applications Trend
STATS.TOP_COMPANIES = Top Companies (Applications)
STATS.NEW_JOB_LISTINGS_PER_DAY = New Job Listings per Day
STATS.APPLICATION_STATUS_DISTRIBUTION = Application Status Distribution
STATUS.APPLIED = Applied
STATUS.REJECTED = Rejected
STATUS.OFFER = Offer
STATUS.INTERVIEW = Interview
STATUS.IN_REVIEW = In Review
COMMON.CREATE = Create
COMMON.EDIT = Edit
COMMON.APPLICATION_LINK = Application Link
COMMON.JOB_TITLE = Job Title
COMMON.COMPANY = Company
COMMON.LOCATION = Location
COMMON.EXPERIENCE_LEVEL = Experience Level
COMMON.JOB_TYPE = Job Type
COMMON.SOURCE = Source
COMMON.SALARY_RANGE = Salary range
COMMON.FROM = From
COMMON.TO = To
COMMON.CURRENCY = Currency
COMMON.POSTED_DATE = Posted Date
COMMON.APPLICATION_DEADLINE = Application Deadline
COMMON.Contact_EMAIL = Contact Email
COMMON.DESCRIPTION = Description
COMMON.NOTES = Notes
COMMON.CANCEL = Cancel
COMMON.UPDATE = Update
COMMON.EDIT_PROFILE = Edit profile
COMMON.EDIT_SKILLS = Edit skills
COMMON.ADD_EXPERIENCE = Add experience
COMMON.SKILLS = Skills
COMMON.EXPERIENCE = Experience
COMMON.EDUCATION = Education
COMMON.CERTIFICATIONS = Certifications
ROLE.USER = User
ROLE.TECHNICAL_SUPPORT = Technical Support
ROLE.ADMIN = Admin
ROLE.SUPER_ADMIN = Super Admin
JOB_TYPE.FULL_TIME = Full-time
JOB_TYPE.PART_TIME = Part-time
JOB_TYPE.CONTRACT = Contract
JOB_TYPE.TEMPORARY = Temporary
JOB_TYPE.INTERN = Intern
JOB_TYPE.VOLUNTEER = Volunteer
JOB_TYPE.FREELANCE = Freelance
JOB_TYPE.STARTUP = Startup
JOB_TYPE.OTHER = Other
JOB_SOURCE.JOB_BOARD = Job Board
JOB_SOURCE.COMPANY_WEBSITE = Company Website
JOB_SOURCE.RECOMMENDATION = Recommendation
JOB_SOURCE.OTHER = Other
EXPERIENCE_LEVEL.INTERNSHIP = Internship
EXPERIENCE_LEVEL.ENTRY_LEVEL = Entry Level
EXPERIENCE_LEVEL.JUNIOR = Junior
EXPERIENCE_LEVEL.MID_LEVEL = Mid Level
EXPERIENCE_LEVEL.SENIOR = Senior
EXPERIENCE_LEVEL.EXECUTIVE = Executive
COMMON.APPLICATIONS = Applications
DATES.JANUARY_SHORT = Jan
DATES.FEBRUARY_SHORT = Feb
DATES.MARCH_SHORT = Mar
DATES.APRIL_SHORT = Apr
DATES.MAY_SHORT = May
DATES.JUNE_SHORT = Jun
DATES.JULY_SHORT = Jul
DATES.AUGUST_SHORT = Aug
DATES.SEPTEMBER_SHORT = Sep
DATES.OCTOBER_SHORT = Oct
DATES.NOVEMBER_SHORT = Nov
DATES.DECEMBER_SHORT = Dec
DATES.MONDAY_SHORT = Mon
DATES.TUESDAY_SHORT = Tue
DATES.WEDNESDAY_SHORT = Wed
DATES.THURSDAY_SHORT = Thu
DATES.FRIDAY_SHORT = Fri
DATES.SATURDAY_SHORT = Sat
DATES.SUNDAY_SHORT = Sun
ERROR.USER_NOT_FOUND = User not found
COMMON.OK = Ok
COMMON.USER_PREFERENCES = User preferences
ERROR.UPDATE_ONLY_OWN_SETTINGS = User can update only own settings
COMMON.FIRST_NAME = First Name
COMMON.LAST_NAME = Last Name
COMMON.LANGUAGE = Language
COMMON.TIME_ZONE = Time Zone
COMMON.COUNTRY = Country
COMMON.APPLICATION_AI_TEXTAREA = Application AI textarea
MESSAGES.CHANGES_SUCCESSFULLY_SAVED = Changes have been saved successfully
INPUT.TO_MANY_ITEMS.START_TYPING = Too many items. Please start typing
ERROR.INVALID_URL = Invalid URL format
ERROR.URL_NOT_HTTPS = URL is not using HTTPS
ERROR.UNKNOWN_URL_TYPE = URL is safe but does not match a known username pattern
COMMON.PHONE = Phone
SKILL_LEVEL.BEGINNER = Beginner
SKILL_LEVEL.BASIC = Basic
SKILL_LEVEL.INTERMEDIATE = Intermediate
SKILL_LEVEL.ADVANCED = Advanced
SKILL_LEVEL.EXPERT = Expert
SKILL_LEVEL.MASTER = Master
SKILL_LEVEL.WORLD_CLASS = World-Class
WORK_ARRANGEMENT.ON_SITE = On-site
WORK_ARRANGEMENT.REMOTE = Remote
WORK_ARRANGEMENT.HYBRID = Hybrid
WORK_ARRANGEMENT.FLEXIBLE = Flexible
WORK_ARRANGEMENT.TRAVEL_REQUIRED = Travel Required
WORK_ARRANGEMENT.SHIFT_BASED = Shift-based
COMMON.ADD = Add
COMMON.REMOVE = Remove
COMMON.ALREADY_EXISTS = Already exists
COMMON.LANGUAGE_LEVEL = Language Level
COMMON.LANGUAGES = Languages
COMMON.EDIT_LANGUAGES = Edit languages
ERROR.COMMON_ERROR = Unexpected error occurred.
ERROR.NOT_FOUND = Not found
ERROR.ENTITY_NOT_FOUND = Entity not found
ERROR.ENTITY_WITH_ID_NOT_FOUND = Entity with this ID not found
ERROR.ENTITY_WITH_EMAIL_ALREADY_EXISTS = Entity with this email already exists
ERROR.ENTITY_WITH_LOGIN_ALREADY_EXISTS = Entity with this login already exists
ERROR.VALIDATION_ERROR = Validation error
ERROR.ENTITY_ALREADY_EXISTS = Entity already exists
ERROR.INTERNAL_SERVER_ERROR = Internal server error
ERROR.BLOCKED = Blocked
ERROR.RESOURCE_NOT_FOUND = Resource not found
ERROR.ENTITY_BLOCKED = Entity is blocked
ERROR.ENTITY_PESSIMISTIC_LOCKED = Entity is pessimistically locked
ERROR.WRONG_AUTH = Wrong credentials
ERROR.FORBIDDEN = Access denied
ERROR.USER_BLOCKED = User is blocked
ERROR.POTENTIAL_HARMFUL_CONTENT = Potential harmful content detected
ERROR.JWT_MIN_LENGTH = JWT token is too short
ERROR.JWT_INVALID_FORMAT = Invalid JWT format
ERROR.JWT_USER_CLAIM_NOT_FOUND = User claim not found in JWT
ERROR.JWT_USER_CLAIM_INVALID_CONVERSION = Cannot convert user claim in JWT
ERROR.FORGOT_PASSWORD_REQUEST_TOO_SOON = Forgot password requested too soon
ERROR.RESTORE_PASSWORD_PROCESSING_ISSUE = An issue occurred during password restoration
ERROR.VERSION_NOT_SPECIFIED = Version not specified
ERROR.USER_PROJECT_LIMIT_EXCEEDED = User has exceeded project limit
ERROR.ROLE_NOT_SUPPORTED = This role is not supported
STATUS.NEW = New
STATUS.ACTIVE = Active
STATUS.INACTIVE = Inactive
STATUS.BLOCKED = Blocked
STATUS.DELETED = Deleted
STATUS.PENDING = Pending
STATUS.APPROVED = Approved
STATUS.COMPLETED = Completed
STATUS.CANCELLED = Cancelled
```

## **Example Output (if the user sets `11` as the starting number and handling apostrophes):**
```
550e8400-e29b-41d4-a716-100000000011;en;AUTH.SIGN_IN.JOKE;Maybe we need back to;Maybe we need back to;1;1
550e8400-e29b-41d4-a716-100000000012;en;COMMON.LOGIN_OR_EMAIL;Login or Email;Login or Email;1;1
550e8400-e29b-41d4-a716-100000000013;en;COMMON.PASSWORD;Password;Password;1;1
...
550e8400-e29b-41d4-a716-300000000011;fr;COMMON.ADDRESS;avenue de l''Authion;avenue de l''Authion;1;1
```
For en because en and english version the same
titleEn = ENGLISH VERSION eg = Maybe we need back to
title = LOCALE VERSION eg = Maybe we need back to

But for other locales(fro example fr FRANCE)
titleEn = ENGLISH VERSION eg = Maybe we need back to
title = LOCALE VERSION eg = Peut-être devons-nous revenir à

title EN AFTER KEY = ENGLISH VERSION eg Address
title after titleEn = Адрес
550e8400-e29b-41d4-a716-500000000011;ru;COMMON.ADDRESS;Address;Адрес;1;1

### **6. Expected Output:**
A structured CSV file containing translations for all locales, ensuring:
- Unique IDs continue from the user-specified starting value.
- Apostrophes are correctly formatted as `''`.
- Translations are assigned per locale correctly.  
