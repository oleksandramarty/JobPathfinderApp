import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, Observable, switchMap, take, throwError } from 'rxjs';
import { Store } from '@ngrx/store';
import { environment } from './environments/environment';
import { auth_clearAll, selectToken } from '@amarty/store';
import {clearLocalStorageAndRefresh, getLocalStorageItem} from '@amarty/utils';
import {AuthService} from './services/auth.service';
import {JwtTokenResponse} from '@amarty/models';

export const HTTP_METHODS = {
  GET: 'GET',
  HEAD: 'HEAD',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
  CONNECT: 'CONNECT',
  OPTIONS: 'OPTIONS',
  TRACE: 'TRACE',
};

@Injectable()
export class BaseUrlInterceptor implements HttpInterceptor {
  private sso_req = null;

  constructor(
    private readonly authService: AuthService,
    private router: Router,
    private readonly store: Store) {
  }

  intercept(
      request: HttpRequest<any>,
      next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (request.url.includes('images')) {
      return next.handle(request);
    }

    let token = this.authService.localToken;
    if (!token) {
      token = getLocalStorageItem<JwtTokenResponse>('honk_token');
    }

    return next.handle(request.clone({
      setHeaders: {
        Authorization: `${environment.authSchema} ${token?.token}`
      }
    })).pipe(
      catchError((error: HttpErrorResponse) => {
        if (typeof error === 'string') {
          error = JSON.parse(error);
        }

        if (error.status === 401) {
          this.store.dispatch(auth_clearAll());
          clearLocalStorageAndRefresh(true);
        } else if (error.status === 404) {
          // Handle EntityNotFoundException
          console.error('Entity not found:', error.message);
        } else {
          // Handle other errors
          console.error('An error occurred:', error.message);
        }
        return throwError(error);
      })
    );
  }
}
