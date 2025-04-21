import {gql} from '@apollo/client';

export const AUTH_GATEWAY_SIGN_OUT = gql`
  query SignOut {
    auth_gateway_sign_out {
      success
    }
  }
`;
