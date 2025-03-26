import { createReducer, on } from '@ngrx/store';
import { auth_clearAll, auth_clearToken, auth_clearUser, auth_setToken, auth_setUser } from '../actions/auth.action';
import { JwtTokenResponse, UserResponse } from '@amarty/api';

export interface IAuthState {
  token: JwtTokenResponse | undefined;
  user: UserResponse | undefined;
}

export const initialState: IAuthState = {
  token: undefined,
  user: undefined,
};

export const authReducer = createReducer(
  initialState,
  on(auth_setToken, (state, { token }) => ({ ...state, token })),
  on(auth_clearToken, state => ({ ...state, token: undefined })),
  on(auth_setUser, (state, { user }) => ({ ...state, user })),
  on(auth_clearUser, state => ({ ...state, user: undefined })),
  on(auth_clearAll, state => ({ ...state, token: undefined, user: undefined }))
);
