import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {AuthService} from './services/auth.service';
import {Store} from '@ngrx/store';
import {catchError, Observable, throwError} from 'rxjs';
import {clearLocalStorageAndRefresh, getLocalStorageItem} from '@amarty/utils';
import {JwtTokenResponse} from '@amarty/models';
import {environment} from './environments/environment';
import {auth_clearAll} from '@amarty/store';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable()
export class BaseUrlInterceptor implements HttpInterceptor {
  constructor(
    private readonly authService: AuthService,
    private readonly store: Store
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.localToken || getLocalStorageItem<JwtTokenResponse>('honk_token');

    const clonedRequest = token?.token
      ? request.clone({
        setHeaders: {
          Authorization: `${environment.authSchema} ${token.token}`
        }
      })
      : request;

    return next.handle(clonedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        console.warn('[BaseUrlInterceptor]', error);

        if (error.status === 401) {
          this.store.dispatch(auth_clearAll());
          clearLocalStorageAndRefresh(true);
        } else if (error.status === 404) {
          console.warn('Entity not found:', error.message);
        } else {
          console.error('An error occurred:', error.message);
        }

        return throwError(() => error);
      })
    );
  }
}
