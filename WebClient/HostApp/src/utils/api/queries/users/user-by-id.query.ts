import {gql} from '@apollo/client';

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
