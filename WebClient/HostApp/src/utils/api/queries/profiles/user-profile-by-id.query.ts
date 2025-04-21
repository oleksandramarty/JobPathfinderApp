import { gql } from '@apollo/client';

export const PROFILE_USER_PROFILE_BY_ID = gql`
  query ProfileUserProfileById(
    $id: Guid!
  ) {
    profile_user_profile_by_id(
      id: $id
    ) {
      skills {
        id
        skillId
        skillLevelId
      }
      languages {
        id
        languageId
        languageLevelId
      }
      items {
        id
        profileItemType
        startDate
        endDate
        position
        description
        company
        location
        countryId
        jobTypeId
        workArrangementId
        status
        skills {
          id
          userSkillId
          userProfileItemId
        }
        languages {
          id
          userSkillId
          userProfileItemId
        }
      }
    }
  }
`;
