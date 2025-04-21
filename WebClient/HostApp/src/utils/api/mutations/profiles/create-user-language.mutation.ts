import { gql } from '@apollo/client';

export const PROFILE_CREATE_USER_LANGUAGE = gql`
  mutation ProfileCreateUserLANGUAGE(
    $languageId: Int!,
    $languageLevelId: Int!
  ) {
    profile_create_user_language(
      input: {
        languageId: $languageId,
        languageLevelId: $languageLevelId
      }
    ) {
      id
    }
  }
`;
