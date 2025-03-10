import { JwtTokenResponse, UserResponse } from '@amarty/api';
import { createAction, props } from '@ngrx/store';

export const auth_setToken = createAction('[Auth] Set Token', props<{ token: JwtTokenResponse }>());
export const auth_clearToken = createAction('[Auth] Clear Token');
export const auth_setUser = createAction('[Auth] Set User', props<{ user: UserResponse }>());
export const auth_clearUser = createAction('[Auth] Clear User');
export const auth_clearAll = createAction('[Auth] Clear All');
