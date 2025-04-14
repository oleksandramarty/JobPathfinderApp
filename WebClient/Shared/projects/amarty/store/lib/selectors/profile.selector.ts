import { createSelector, createFeatureSelector } from '@ngrx/store';
import {IProfileState} from '../reducers/profile.reducer';

export const selectProfileState = createFeatureSelector<IProfileState>('profile');

export const selectProfile = createSelector(
  selectProfileState,
  (state: IProfileState) => state.profile
);
