import { JwtTokenResponse } from '@amarty/api';
import {Injectable} from '@angular/core';
import {filter, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Store} from '@ngrx/store';
import {auth_clearAll, auth_setToken, selectIsAdmin, selectIsSuperAdmin, selectIsUser, selectToken } from '@amarty/store';
import {getLocalStorageItem, removeLocalStorageItem, setLocalStorageItem, traceCreation} from '@amarty/utils';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly _tokenKey = 'honk-token';
  private _token$: Observable<JwtTokenResponse | undefined> | undefined;

  private _isUser$: Observable<boolean | undefined> | undefined;
  private _isAdmin$: Observable<boolean | undefined> | undefined;
  private _isSuperAdmin$: Observable<boolean | undefined> | undefined;

  get isAuthorized(): boolean {
    return !!this.getToken() || !!this.getTokenFromStore();
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

  constructor(
    private readonly store: Store
  ) {
    traceCreation(this);
    this._token$ = this.store.select(selectToken);
    this._isUser$ = this.store.select(selectIsUser);
    this._isAdmin$ = this.store.select(selectIsAdmin);
    this._isSuperAdmin$ = this.store.select(selectIsSuperAdmin);
  }

  public initialize(): void {
    const storedToken = this.getToken();
    if (storedToken) {
      this.store.dispatch(auth_setToken({token: storedToken}));
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

  private auth_setToken(token: JwtTokenResponse): void {
    setLocalStorageItem(this._tokenKey, token);
    this.store.dispatch(auth_setToken({token}));
  }

  private getToken(): JwtTokenResponse | undefined {
    const token = getLocalStorageItem<string>(this._tokenKey);
    return token ? JSON.parse(token) : undefined;
  }

  private clearAuthData(): void {
    removeLocalStorageItem(this._tokenKey);
    this.store.dispatch(auth_clearAll());
  }
}
