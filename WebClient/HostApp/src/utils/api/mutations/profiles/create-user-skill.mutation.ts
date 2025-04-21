import { gql } from '@apollo/client';

export const PROFILE_CREATE_USER_SKILL = gql`
  mutation ProfileCreateUserSkill(
    $skillId: Int!,
    $skillLevelId: Int!
  ) {
    profile_create_user_skill(
      input: {
        skillId: $skillId,
        skillLevelId: $skillLevelId
      }
    ) {
      id
    }
  }
`;
