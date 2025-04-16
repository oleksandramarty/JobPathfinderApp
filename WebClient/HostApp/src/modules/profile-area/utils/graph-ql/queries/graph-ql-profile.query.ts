import { gql } from '@apollo/client';

export const PROFILE_CURRENT_USER_PROFILE = gql`
  query UserProfile {
    profile_current_user_profile {
      skills {
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
      languages {
        id
        userId
        languageId
        languageLevelId
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
      items {
        id
        userId
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
        version
        createdAt
        updatedAt
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
