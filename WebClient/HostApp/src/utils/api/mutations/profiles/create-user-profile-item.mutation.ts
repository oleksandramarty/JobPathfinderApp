import { gql } from '@apollo/client';

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
