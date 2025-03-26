import { ActionReducerMap } from '@ngrx/store';
import { authReducer, IAuthState } from './reducers/auth.reducer';

export interface IAppState {
  auth: IAuthState;
}

export const reducers: ActionReducerMap<IAppState> = {
  auth: authReducer
};
