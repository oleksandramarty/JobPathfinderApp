import { UserProfileResponse } from '@amarty/models';
import { createAction, props } from '@ngrx/store';

export const profile_setProfile = createAction('[Profile] Set Profile', props<{ profile: UserProfileResponse }>());
export const profile_clearProfile = createAction('[Profile] Clear Profile');
export const profile_clearAll = createAction('[Profile] Clear All');
