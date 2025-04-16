import { UserProfileResponse } from '@amarty/models';
import { PROFILE_CURRENT_USER_PROFILE } from '../queries/graph-ql-profile.query';
import { Injectable } from '@angular/core';
import { Apollo, ApolloBase } from 'apollo-angular';
import { apolloEnvironments } from '@amarty/utils';
import { Observable } from 'rxjs';
import { ApolloQueryResult } from '@apollo/client';


@Injectable({
  providedIn: 'root',
})
export class GraphQlProfileService {
  constructor(
      private readonly _apollo: Apollo
  ) {
  }

  get apolloClient(): ApolloBase<any> {
    return this._apollo.use(apolloEnvironments.profile);
  }

  public currentUserProfile(): Observable<ApolloQueryResult<{ profile_current_user_profile: UserProfileResponse | undefined }>> {
    return this.apolloClient
      .watchQuery({
        query: PROFILE_CURRENT_USER_PROFILE,
        fetchPolicy: 'network-only',
      }).valueChanges as Observable<ApolloQueryResult<{ profile_current_user_profile: UserProfileResponse | undefined }>>;
  }
}
