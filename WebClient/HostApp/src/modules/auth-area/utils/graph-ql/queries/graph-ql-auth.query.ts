import { gql } from '@apollo/client';

export const AUTH_GATEWAY_SIGN_IN = gql`
    query SignIn($input: AuthSignInRequestInputType!) {
        auth_gateway_sign_in(input: $input) {
            token
        }
    }
`;

export const AUTH_GATEWAY_SIGN_OUT = gql`
    query SignOut {
        auth_gateway_sign_out {
            success
        }
    }
`;

export const AUTH_GATEWAY_CURRENT_USER = gql`
  query UserDetails {
    auth_gateway_current_user {
      id
      login
      firstName
      lastName
      headline
      email
      phone
      status
      isTemporaryPassword
      authType
      lastForgotPassword
      lastForgotPasswordRequest
      roles {
        id
        title
        userRole
      }
      userSetting {
        id
        defaultLocale
        timeZone
        countryId
        currencyId
        applicationAiPrompt
        userId
        linkedInUrl
        npmUrl
        gitHubUrl
        portfolioUrl
        showCurrentPosition
        showHighestEducation
        version
      }
      createdAt
      updatedAt
      status
      version
    }
  }
`;

export const USER_INFO = gql`
  query UserInfoById($id: Guid) {
    user_info_by_id(id: $id) {
      id
      login
      firstName
      lastName
      headline
      email
      phone
      status
      isTemporaryPassword
      authType
      lastForgotPassword
      lastForgotPasswordRequest
      roles {
        id
        title
        userRole
      }
      userSetting {
        id
        defaultLocale
        timeZone
        countryId
        currencyId
        applicationAiPrompt
        userId
        linkedInUrl
        npmUrl
        gitHubUrl
        portfolioUrl
        showCurrentPosition
        showHighestEducation
        version
      }
      createdAt
      updatedAt
      status
      version
    }
  }
`;

export const USER_INFO_BY_LOGIN = gql`
  query UserInfoByLogin($login: String) {
    user_info_by_login(login: $login) {
      id
      login
      firstName
      lastName
      headline
      email
      phone
      status
      userSetting {
        timeZone
        countryId
        currencyId
        linkedInUrl
        npmUrl
        gitHubUrl
        portfolioUrl
        showCurrentPosition
        showHighestEducation
        version
      }
      createdAt
      updatedAt
      status
      version
    }
  }
`;

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
