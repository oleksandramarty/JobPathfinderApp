import {gql} from '@apollo/client';

export const USER_UPDATE_PREFERENCE = gql`
  mutation UpdateUserPreference(
    $login: String
    $headline: String
    $phone: String
    $firstName: String
    $lastName: String
    $defaultLocale: String
    $timeZone: Int
    $countryId: Int
    $currencyId: Int
    $applicationAiPrompt: Boolean!
    $linkedInUrl: String
    $npmUrl: String
    $gitHubUrl: String
    $portfolioUrl: String
    $showCurrentPosition: Boolean!
    $showHighestEducation: Boolean!
  ) {
    user_update_preference(
      input: {
        login: $login
        headline: $headline
        phone: $phone
        firstName: $firstName
        lastName: $lastName
        defaultLocale: $defaultLocale
        timeZone: $timeZone
        countryId: $countryId
        currencyId: $currencyId
        applicationAiPrompt: $applicationAiPrompt
        linkedInUrl: $linkedInUrl
        npmUrl: $npmUrl
        gitHubUrl: $gitHubUrl
        portfolioUrl: $portfolioUrl
        showCurrentPosition: $showCurrentPosition
        showHighestEducation: $showHighestEducation
      }
    ) {
      success
    }
  }
`;
