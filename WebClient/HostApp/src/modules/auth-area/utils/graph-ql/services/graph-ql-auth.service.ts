import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApolloQueryResult } from '@apollo/client';
import {
  AUTH_GATEWAY_CURRENT_USER,
  AUTH_GATEWAY_SIGN_IN,
  AUTH_GATEWAY_SIGN_OUT, AUTH_GATEWAY_SIGN_UP, USER_INFO, USER_INFO_BY_LOGIN, USER_UPDATE_PREFERENCE
} from '../queries/graph-ql-auth.query';
import { Apollo, ApolloBase } from 'apollo-angular';
import {BaseBoolResponse, BaseIdEntityOfGuid, JwtTokenResponse, UserResponse} from '@amarty/models';
import {apolloEnvironments, apolloFetchPolicy} from '@amarty/utils';

@Injectable({
  providedIn: 'root',
})
export class GraphQlAuthService {
  constructor(
      private readonly _apollo: Apollo
  ) {
  }

  get apolloClient(): ApolloBase<any> {
    return this._apollo.use(apolloEnvironments.authGateway);
  }

  public signIn(login: string, password: string, rememberMe: boolean): Observable<ApolloQueryResult<{ auth_gateway_sign_in: JwtTokenResponse | undefined }>> {
    return this.apolloClient
      .watchQuery({
        query: AUTH_GATEWAY_SIGN_IN,
        variables: {
          input: {
            login,
            password,
            rememberMe
          }
        },
        fetchPolicy: 'network-only',
      }).valueChanges as Observable<ApolloQueryResult<{ auth_gateway_sign_in: JwtTokenResponse | undefined }>>;
  }

  public signUp(
    input: {
      login: string,
      email: string,
      password: string,
      passwordAgain: string,
      firstName?: string | undefined,
      lastName?: string | undefined
    }
    ): Observable<ApolloQueryResult<{ auth_gateway_sign_up: BaseIdEntityOfGuid | undefined }>> {
    return this.apolloClient
      .watchQuery({
        query: AUTH_GATEWAY_SIGN_UP,
        variables: {
          input: {
            ...input
          }
        },
        fetchPolicy: 'network-only',
      }).valueChanges as Observable<ApolloQueryResult<{ auth_gateway_sign_up: BaseIdEntityOfGuid | undefined }>>;
  }

  public signOut(): Observable<ApolloQueryResult<BaseBoolResponse>> {
    return this.apolloClient
      .watchQuery({
        query: AUTH_GATEWAY_SIGN_OUT,
        fetchPolicy: 'network-only',
      }).valueChanges as Observable<ApolloQueryResult<BaseBoolResponse>>;
  }

  public currentUser(): Observable<ApolloQueryResult<{ auth_gateway_current_user: UserResponse | undefined }>> {
    return this.apolloClient
      .watchQuery({
        query: AUTH_GATEWAY_CURRENT_USER,
        fetchPolicy: 'network-only',
      }).valueChanges as Observable<ApolloQueryResult<{ auth_gateway_current_user: UserResponse | undefined }>>;
  }

  public userById(id: string): Observable<ApolloQueryResult<{ user_info_by_id: UserResponse | undefined }>> {
    return this.apolloClient
      .watchQuery({
        query: USER_INFO,
        variables: {
          id
        },
        fetchPolicy: 'network-only',
      }).valueChanges as Observable<ApolloQueryResult<{ user_info_by_id: UserResponse | undefined }>>;
  }

  public userByLogin(login: string): Observable<ApolloQueryResult<{ user_info_by_login: UserResponse | undefined }>> {
    return this.apolloClient
      .watchQuery({
        query: USER_INFO_BY_LOGIN,
        variables: {
          login
        },
        fetchPolicy: 'cache-and-network',
      }).valueChanges as Observable<ApolloQueryResult<{ user_info_by_login: UserResponse | undefined }>>;
  }

  public updateUserPreferences(input: {
    login?: string;
    headline?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    defaultLocale?: string;
    timeZone?: number;
    countryId?: number;
    currencyId?: number;
    applicationAiPrompt: boolean;
    linkedInUrl?: string;
    npmUrl?: string;
    gitHubUrl?: string;
    portfolioUrl?: string;
    showCurrentPosition: boolean;
    showHighestEducation: boolean;
  }): Observable<ApolloQueryResult<BaseBoolResponse>> {
    return this.apolloClient.mutate({
      mutation: USER_UPDATE_PREFERENCE,
      variables: input
    }) as Observable<ApolloQueryResult<BaseBoolResponse>>;
  }
}
