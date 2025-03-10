import { createReducer, on } from '@ngrx/store';
import { auth_clearAll, auth_clearToken, auth_clearUser, auth_setToken, auth_setUser } from '../actions/auth.action';
import { IJwtTokenResponse, IUserResponse, JwtTokenResponse, UserResponse } from '@amarty/api';

export interface IAuthState {
  token: IJwtTokenResponse | undefined;
  user: IUserResponse | undefined;
}

export class AuthState implements IAuthState {
  token: JwtTokenResponse | undefined;
  user: UserResponse | undefined;

  constructor(data?: IAuthState) {
    this.token = new JwtTokenResponse(data?.token);
    this.user = new UserResponse(data?.user);
  }
}

export const initialState: AuthState = {
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
