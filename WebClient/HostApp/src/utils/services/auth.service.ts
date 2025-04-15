import { JwtTokenResponse } from '@amarty/models';
import { Injectable } from '@angular/core';
import { filter, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import {
  auth_clearAll,
  auth_setToken,
  profile_clearAll,
  selectIsAdmin,
  selectIsSuperAdmin,
  selectIsUser,
  selectToken
} from '@amarty/store';
import { getLocalStorageItem, removeLocalStorageItem, setLocalStorageItem } from '@amarty/utils';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly _tokenKey = 'honk_token';
  private _token$: Observable<JwtTokenResponse | undefined> | undefined;
  private _localToken: JwtTokenResponse | undefined;

  private _isUser$: Observable<boolean | undefined> | undefined;
  private _isAdmin$: Observable<boolean | undefined> | undefined;
  private _isSuperAdmin$: Observable<boolean | undefined> | undefined;

  get isAuthorized(): boolean {
    return !!this.localToken || !!this.getTokenFromStore();
  }

  get isAuthorized$(): Observable<boolean> | undefined {
    return this._token$?.pipe(
      filter(token => token !== undefined),
      map(token => !!token));
  }

  get isUser$(): Observable<boolean> | undefined {
    return this._isUser$?.pipe(
      filter(isUser => isUser !== undefined),
      map(isUser => !!isUser));
  }

  get isAdmin$(): Observable<boolean> | undefined {
    return this._isAdmin$?.pipe(
      filter(isAdmin => isAdmin !== undefined),
      map(isAdmin => !!isAdmin));
  }

  get isSuperAdmin$(): Observable<boolean> | undefined {
    return this._isSuperAdmin$?.pipe(
      filter(isSuperAdmin => isSuperAdmin !== undefined),
      map(isSuperAdmin => !!isSuperAdmin));
  }

  get localToken(): JwtTokenResponse | undefined {
    if (!!this._localToken) {
      return this._localToken;
    }

    this._localToken = getLocalStorageItem<JwtTokenResponse>('honk_token');
    return this._localToken;
  }

  constructor(
    private readonly store: Store
  ) {
    this._token$ = this.store.select(selectToken);
    this._isUser$ = this.store.select(selectIsUser);
    this._isAdmin$ = this.store.select(selectIsAdmin);
    this._isSuperAdmin$ = this.store.select(selectIsSuperAdmin);
  }

  public initialize(): void {
    if (this.localToken) {
      this.store.dispatch(auth_setToken({ token: this.localToken }));
    }

    if (!this.isAuthorized) {
      this.clearAuthData();
    }
  }

  private getTokenFromStore(): JwtTokenResponse | undefined {
    let token: JwtTokenResponse | undefined;
    this.store.select(selectToken).subscribe(authState => {
      token = authState;
    }).unsubscribe();
    return token ?? undefined;
  }

  public updateToken(token: JwtTokenResponse): void {
    setLocalStorageItem(this._tokenKey, token);
    this.store.dispatch(auth_setToken({ token }));
  }

  private clearAuthData(): void {
    removeLocalStorageItem(this._tokenKey);
    this._localToken = undefined;
    this.store.dispatch(auth_clearAll());
    this.store.dispatch(profile_clearAll());
  }
}
