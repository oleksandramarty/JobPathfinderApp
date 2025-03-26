import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { selectToken } from '@amarty/store';
import {AuthService} from './services/auth.service';
import {traceCreation} from '@amarty/utils';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private store: Store,
    private router: Router) {
    traceCreation(this);
  }

  canActivate(): Observable<boolean> {
    return this.store.select(selectToken).pipe(
      map(token => {
        if (token || this.authService.isAuthorized) {
          return true;
        } else {
          this.router.navigate(['/auth/sign-in']);
          return false;
        }
      })
    );
  }
}
