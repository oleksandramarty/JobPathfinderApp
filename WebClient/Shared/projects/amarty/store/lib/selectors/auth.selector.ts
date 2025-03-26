import { createSelector, createFeatureSelector } from '@ngrx/store';
import { IAuthState } from '../reducers/auth.reducer';
import { UserRoleEnum } from '@amarty/api';

export const selectAuthState = createFeatureSelector<IAuthState>('auth');

export const selectToken = createSelector(
  selectAuthState,
  (state: IAuthState) => state.token
);

export const selectUser = createSelector(
  selectAuthState,
  (state: IAuthState) => state.user
);

export const selectIsAdmin = createSelector(
  selectAuthState,
  (state: IAuthState) => (state.user?.roles?.findIndex(role => role.id === UserRoleEnum.Admin) ?? -1) > -1
);

export const selectIsSuperAdmin = createSelector(
  selectAuthState,
  (state: IAuthState) => (state.user?.roles?.findIndex(role => role.id === UserRoleEnum.SuperAdmin) ?? -1) > -1
);

export const selectIsUser = createSelector(
  selectAuthState,
  (state: IAuthState) => (state.user?.roles?.findIndex(role => role.id === 1) ?? -1) > -1
);
