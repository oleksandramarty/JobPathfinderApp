import {gql} from '@apollo/client';

export const USER_INFO_BY_LOGIN = gql`
  query UserInfoByLogin($login: String!) {
    user_info_by_login(input: { login: $login }) {
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
