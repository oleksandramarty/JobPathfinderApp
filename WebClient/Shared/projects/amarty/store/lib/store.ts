import { ActionReducerMap } from '@ngrx/store';
import { authReducer, IAuthState } from './reducers/auth.reducer';
import { IProfileState, profileReducer } from './reducers/profile.reducer';

export interface IAppState {
  auth: IAuthState;
  profile: IProfileState;
}

export const reducers: ActionReducerMap<IAppState> = {
  auth: authReducer,
  profile: profileReducer
};
