import { ActionReducerMap } from '@ngrx/store';
import { authReducer, IAuthState, AuthState } from './reducers/auth.reducer';

export interface IAppState {
    auth: IAuthState;
}

export class AppState implements IAppState {
  auth: AuthState;

  constructor(data?: IAppState) {
    this.auth = new AuthState(data?.auth)
  }
}

export const reducers: ActionReducerMap<AppState> = {
    auth: authReducer
};
