import { gql } from '@apollo/client';

export const AUTH_GATEWAY_SIGN_IN = gql`
  query SignIn($input: AuthSignInRequestInputType!) {
    auth_gateway_sign_in(input: $input) {
      token
    }
  }
`;
