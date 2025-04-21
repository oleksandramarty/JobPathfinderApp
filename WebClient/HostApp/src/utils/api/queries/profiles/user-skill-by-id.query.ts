import { gql } from '@apollo/client';

export const PROFILE_USER_SKILL_BY_ID = gql`
  query UserProfile(
    $id: Guid!
  ) {
    profile_user_skill_by_id(
      id: $id
    ) {
      id
      userId
      skillId
      skillLevelId
      status
      version
      createdAt
      updatedAt
      userProfileItems {
        id
        userSkillId
        userProfileItemId
      }
    }
  }
`;
