import { Injectable } from '@angular/core';
import { filter, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { LoaderService } from './loader.service';
import { auth_clearAll, auth_setToken, selectIsAdmin, selectIsSuperAdmin, selectIsUser, selectToken } from '@amarty/store';
import { JwtTokenResponse } from '@amarty/api';

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
        private readonly router: Router,
        private readonly snackBar: MatSnackBar,
        private readonly store: Store,
        private readonly loaderService: LoaderService
    ) {
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
        localStorage.setItem(this._tokenKey, JSON.stringify(token));
        this.store.dispatch(auth_setToken({token}));
    }

    private getToken(): JwtTokenResponse | undefined {
        const token = localStorage.getItem(this._tokenKey);
        return token ? JSON.parse(token) : undefined;
    }

    private clearAuthData(): void {
        localStorage.removeItem(this._tokenKey);
        this.store.dispatch(auth_clearAll());
    }
}


