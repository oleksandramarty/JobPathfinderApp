import { gql } from '@apollo/client';

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
