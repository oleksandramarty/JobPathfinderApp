import { UserProfileResponse } from '@amarty/models';
import { createReducer, on } from '@ngrx/store';
import { profile_clearAll, profile_clearProfile, profile_setProfile } from '../actions/profile.action';

export interface IProfileState {
  profile: UserProfileResponse | undefined;
}

export const initialProfileState: IProfileState = {
  profile: undefined
};

export const profileReducer = createReducer(
  initialProfileState,
  on(profile_setProfile, (state, { profile }) => ({ ...state, profile })),
  on(profile_clearProfile, state => ({ ...state, profile: undefined })),
  on(profile_clearAll, state => ({ ...state, profile: undefined }))
);
