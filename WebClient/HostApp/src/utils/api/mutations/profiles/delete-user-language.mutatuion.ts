import { gql } from '@apollo/client';

export const PROFILE_DELETE_USER_LANGUAGE = gql`
  mutation ProfileDeleteUserLanguage($id: Guid!) {
    profile_delete_user_language(id: $id) {
      success
    }
  }
`;
