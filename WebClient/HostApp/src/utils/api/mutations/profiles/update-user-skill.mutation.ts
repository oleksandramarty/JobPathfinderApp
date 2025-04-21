import {gql} from '@apollo/client';

export const PROFILE_UPDATE_USER_SKILL = gql`
  mutation ProfileUpdateUserSkill(
    $id: Guid!,
    $skillId: Int!,
    $skillLevelId: Int!
  ) {
    profile_update_user_skill(
      id: $id,
      input: {
        skillId: $skillId,
        skillLevelId: $skillLevelId
      }
    ) {
      success
    }
  }
`;
