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
- If a specific translation for a locale exists, use it; otherwise, use the English version.
- No empty lines in the output.
- Append `;1;1` at the end of each record.

## **Example Input Data:**
```
AUTH.SIGN_IN.JOKE = Maybe we need back to
COMMON.LOGIN_OR_EMAIL = Login or Email
COMMON.PASSWORD = Password
COMMON.CONFIRM_PASSWORD = Password
COMMON.REMEMBER_ME = Remember me
COMMON.FORGOT = Forgot
COMMON.SIGN_IN = Sign In
COMMON.SIGN_UP = Sign Up
AUTH.NO_ACCOUNT.SIGN_UP = Don't have an account? Sign Up
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
```

## **Example Output (if the user sets `11` as the starting number and handling apostrophes):**
```
550e8400-e29b-41d4-a716-100000000011;en;AUTH.SIGN_IN.JOKE;Maybe we need back to;Maybe we need back to;1;1
550e8400-e29b-41d4-a716-100000000012;en;COMMON.LOGIN_OR_EMAIL;Login or Email;Login or Email;1;1
550e8400-e29b-41d4-a716-100000000013;en;COMMON.PASSWORD;Password;Password;1;1
...
550e8400-e29b-41d4-a716-300000000011;fr;COMMON.ADDRESS;avenue de l''Authion;avenue de l''Authion;1;1
```

### **6. Expected Output:**
A structured CSV file containing translations for all locales, ensuring:
- Unique IDs continue from the user-specified starting value.
- Apostrophes are correctly formatted as `''`.
- Translations are assigned per locale correctly.  
