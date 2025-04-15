import {gql} from "@apollo/client";

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
        defaultUserProject
        userId
        version
      }
      createdAt
      updatedAt
      status
      version
    }
  }
`;

