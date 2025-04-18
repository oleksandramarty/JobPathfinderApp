import { gql } from '@apollo/client';

export const PROFILE_DELETE_USER_SKILL = gql`
  mutation ProfileDeleteUserSkill($id: Guid!) {
    profile_delete_user_skill(id: $id) {
      success
    }
  }
`;

export const PROFILE_DELETE_USER_LANGUAGE = gql`
  mutation ProfileDeleteUserLanguage($id: Guid!) {
    profile_delete_user_language(id: $id) {
      success
    }
  }
`;

export const PROFILE_DELETE_USER_PROFILE_ITEM = gql`
  mutation ProfileDeleteUserProfileItem($id: Guid!) {
    profile_delete_user_profile_item(id: $id) {
      success
    }
  }
`;

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

export const PROFILE_CREATE_USER_PROFILE_ITEM = gql`
  mutation ProfileCreateUserProfileItem(
    $profileItemType: Int!,
    $startDate: Date!,
    $endDate: Date,
    $position: String!,
    $description: String,
    $company: String,
    $location: String,
    $countryId: Int,
    $jobTypeId: Int,
    $workArrangementId: Int
  ) {
    profile_create_user_profile_item(
      input: {
        profileItemType: $profileItemType,
        startDate: $startDate,
        endDate: $endDate,
        position: $position,
        description: $description,
        company: $company,
        location: $location,
        countryId: $countryId,
        jobTypeId: $jobTypeId,
        workArrangementId: $workArrangementId
      }
    ) {
      id
    }
  }
`;

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

export const PROFILE_UPDATE_USER_PROFILE_ITEM = gql`
  mutation ProfileUpdateUserProfileItem(
    $id: Guid!,
    $profileItemType: Int!,
    $startDate: Date!,
    $endDate: Date,
    $position: String!,
    $description: String,
    $company: String,
    $location: String,
    $countryId: Int,
    $jobTypeId: Int,
    $workArrangementId: Int
  ) {
    profile_update_user_profile_item(
      id: $id,
      input: {
        profileItemType: $profileItemType,
        startDate: $startDate,
        endDate: $endDate,
        position: $position,
        description: $description,
        company: $company,
        location: $location,
        countryId: $countryId,
        jobTypeId: $jobTypeId,
        workArrangementId: $workArrangementId
      }
    ) {
      success
    }
  }
`;

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
