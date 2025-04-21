import { gql } from '@apollo/client';

export const PROFILE_DELETE_USER_SKILL = gql`
  mutation ProfileDeleteUserSkill($id: Guid!) {
    profile_delete_user_skill(id: $id) {
      success
    }
  }
`;
