import { gql } from '@apollo/client';

export const PROFILE_UPDATE_USER_LANGUAGE = gql`
  mutation ProfileUpdateUserLanguage(
    $id: Guid!,
    $languageId: Int!,
    $languageLevelId: Int!
  ) {
    profile_update_user_language(
      id: $id,
      input: {
        languageId: $languageId,
        languageLevelId: $languageLevelId
      }
    ) {
      success
    }
  }
`;
