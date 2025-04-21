import { Injectable } from '@angular/core';
import { Apollo, ApolloBase } from 'apollo-angular';
import { Observable } from 'rxjs';
import { ApolloQueryResult } from '@apollo/client';

import { apolloEnvironments } from '@amarty/utils';
import {BaseBoolResponse, BaseIdEntityOfGuid, UserProfileResponse, UserSkillResponse} from '@amarty/models';
import {PROFILE_CURRENT_USER_PROFILE} from '../queries/profiles/current-user-profile.mutation';
import {PROFILE_USER_SKILL_BY_ID} from '../queries/profiles/user-skill-by-id.query';
import {PROFILE_CREATE_USER_SKILL} from '../mutations/profiles/create-user-skill.mutation';
import {PROFILE_UPDATE_USER_SKILL} from '../mutations/profiles/update-user-skill.mutation';
import {PROFILE_DELETE_USER_SKILL} from '../mutations/profiles/delete-user-skill.mutation';
import {PROFILE_CREATE_USER_LANGUAGE} from '../mutations/profiles/create-user-language.mutation';
import {PROFILE_UPDATE_USER_LANGUAGE} from '../mutations/profiles/update-user-language.mutation';
import {PROFILE_DELETE_USER_LANGUAGE} from '../mutations/profiles/delete-user-language.mutatuion';
import {PROFILE_CREATE_USER_PROFILE_ITEM} from '../mutations/profiles/create-user-profile-item.mutation';
import {PROFILE_UPDATE_USER_PROFILE_ITEM} from '../mutations/profiles/update-user-profile-item.mutation';
import {PROFILE_DELETE_USER_PROFILE_ITEM} from '../mutations/profiles/delete-user-profile-item.mutation';
import {PROFILE_USER_PROFILE_BY_ID} from '../queries/profiles/user-profile-by-id.query';

@Injectable({
  providedIn: 'root',
})
export class GraphQlProfileService {
  constructor(private readonly _apollo: Apollo) {}

  private get apolloClient(): ApolloBase<any> {
    return this._apollo.use(apolloEnvironments.profile);
  }

  // === CURRENT USER PROFILE ===
  public currentUserProfile(): Observable<ApolloQueryResult<{ profile_current_user_profile: UserProfileResponse | undefined }>> {
    return this.apolloClient
      .watchQuery({
        query: PROFILE_CURRENT_USER_PROFILE,
        fetchPolicy: 'network-only',
      }).valueChanges as Observable<ApolloQueryResult<{ profile_current_user_profile: UserProfileResponse | undefined }>>;
  }

  // === SKILLS ===
  public userSkillById(): Observable<ApolloQueryResult<{ profile_user_skill_by_id: UserSkillResponse | undefined }>> {
    return this.apolloClient
      .watchQuery({
        query: PROFILE_USER_SKILL_BY_ID,
        fetchPolicy: 'network-only',
      }).valueChanges as Observable<ApolloQueryResult<{ profile_user_skill_by_id: UserSkillResponse | undefined }>>;
  }

  public createUserSkill(input: { skillId: number; skillLevelId: number }): Observable<ApolloQueryResult<{ profile_create_user_skill: BaseIdEntityOfGuid | undefined }>> {
    return this.apolloClient.mutate({
      mutation: PROFILE_CREATE_USER_SKILL,
      variables: input,
    }) as Observable<ApolloQueryResult<{ profile_create_user_skill: BaseIdEntityOfGuid | undefined }>>;
  }

  public updateUserSkill(id: string, input: { skillId: number; skillLevelId: number }): Observable<ApolloQueryResult<{ profile_update_user_skill: BaseBoolResponse | undefined }>> {
    return this.apolloClient.mutate({
      mutation: PROFILE_UPDATE_USER_SKILL,
      variables: { id, ...input },
    }) as Observable<ApolloQueryResult<{ profile_update_user_skill: BaseBoolResponse | undefined }>>;
  }

  public deleteUserSkill(id: string): Observable<ApolloQueryResult<{ profile_delete_user_skill: BaseBoolResponse | undefined }>> {
    return this.apolloClient.mutate({
      mutation: PROFILE_DELETE_USER_SKILL,
      variables: { id },
    }) as Observable<ApolloQueryResult<{ profile_delete_user_skill: BaseBoolResponse | undefined }>>;
  }

  // === LANGUAGES ===
  public createUserLanguage(input: { languageId: number; languageLevelId: number }): Observable<ApolloQueryResult<{ profile_create_user_language: BaseIdEntityOfGuid | undefined }>> {
    return this.apolloClient.mutate({
      mutation: PROFILE_CREATE_USER_LANGUAGE,
      variables: input,
    }) as Observable<ApolloQueryResult<{ profile_create_user_language: BaseIdEntityOfGuid | undefined }>>;
  }

  public updateUserLanguage(id: string, input: { languageId: number; languageLevelId: number }): Observable<ApolloQueryResult<{ profile_update_user_language: BaseBoolResponse | undefined }>> {
    return this.apolloClient.mutate({
      mutation: PROFILE_UPDATE_USER_LANGUAGE,
      variables: { id, ...input },
    }) as Observable<ApolloQueryResult<{ profile_update_user_language: BaseBoolResponse | undefined }>>;
  }

  public deleteUserLanguage(id: string): Observable<ApolloQueryResult<{ profile_delete_user_language: BaseBoolResponse | undefined }>> {
    return this.apolloClient.mutate({
      mutation: PROFILE_DELETE_USER_LANGUAGE,
      variables: { id },
    }) as Observable<ApolloQueryResult<{ profile_delete_user_language: BaseBoolResponse | undefined }>>;
  }

  // === PROFILE ITEMS ===
  public createUserProfileItem(input: {
    profileItemType: number;
    startDate: string;
    endDate?: string;
    position: string;
    description?: string;
    company?: string;
    location?: string;
    countryId?: number;
    jobTypeId?: number;
    workArrangementId?: number;
  }): Observable<ApolloQueryResult<{ profile_create_user_profile_item: BaseIdEntityOfGuid | undefined }>> {
    return this.apolloClient.mutate({
      mutation: PROFILE_CREATE_USER_PROFILE_ITEM,
      variables: input,
    }) as Observable<ApolloQueryResult<{ profile_create_user_profile_item: BaseIdEntityOfGuid | undefined }>>;
  }

  public updateUserProfileItem(id: string, input: {
    profileItemType: number;
    startDate: string;
    endDate?: string;
    position: string;
    description?: string;
    company?: string;
    location?: string;
    countryId?: number;
    jobTypeId?: number;
    workArrangementId?: number;
  }): Observable<ApolloQueryResult<{ profile_update_user_profile_item: BaseBoolResponse | undefined }>> {
    return this.apolloClient.mutate({
      mutation: PROFILE_UPDATE_USER_PROFILE_ITEM,
      variables: { id, ...input },
    }) as Observable<ApolloQueryResult<{ profile_update_user_profile_item: BaseBoolResponse | undefined }>>;
  }

  public deleteUserProfileItem(id: string): Observable<ApolloQueryResult<{ profile_delete_user_profile_item: BaseBoolResponse | undefined }>> {
    return this.apolloClient.mutate({
      mutation: PROFILE_DELETE_USER_PROFILE_ITEM,
      variables: { id },
    }) as Observable<ApolloQueryResult<{ profile_delete_user_profile_item: BaseBoolResponse | undefined }>>;
  }

  public userProfileById(id: string): Observable<ApolloQueryResult<{ profile_user_profile_by_id: UserProfileResponse | undefined }>> {
    return this.apolloClient
      .watchQuery({
        query: PROFILE_USER_PROFILE_BY_ID,
        variables: { id },
        fetchPolicy: 'cache-and-network',
      }).valueChanges as Observable<ApolloQueryResult<{ profile_user_profile_by_id: UserProfileResponse | undefined }>>;
  }
}
