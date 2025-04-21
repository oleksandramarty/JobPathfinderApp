import {gql} from '@apollo/client';

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
