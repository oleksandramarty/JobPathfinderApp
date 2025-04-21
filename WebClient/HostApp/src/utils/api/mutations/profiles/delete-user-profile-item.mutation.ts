import {gql} from '@apollo/client';

export const PROFILE_DELETE_USER_PROFILE_ITEM = gql`
  mutation ProfileDeleteUserProfileItem($id: Guid!) {
    profile_delete_user_profile_item(id: $id) {
      success
    }
  }
`;
