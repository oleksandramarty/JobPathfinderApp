import { gql } from '@apollo/client';

export const AUTH_GATEWAY_SIGN_UP = gql`
  mutation SignUp($input: AuthSignUpInputType!) {
    auth_gateway_sign_up(input: $input) {
      id
    }
  }
`;
