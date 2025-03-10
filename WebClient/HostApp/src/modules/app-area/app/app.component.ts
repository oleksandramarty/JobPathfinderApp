import { UserApiClient, UserResponse } from '@amarty/api';
import { generateRandomId, handleApiError } from '@amarty/utils'
import {Component} from '@angular/core';
import { BaseAuthorizeComponent } from '@amarty/shared/components';
import {Store} from '@ngrx/store';
import {MatSnackBar} from '@angular/material/snack-bar';
import {of, switchMap, take, takeUntil, tap} from 'rxjs';
import { auth_setUser } from '@amarty/store';
import {AuthService} from '@amarty/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false,
  host: { 'data-id': generateRandomId(12) }
})
export class AppComponent extends BaseAuthorizeComponent{
  constructor(
    protected override readonly authService: AuthService,
    protected override readonly store: Store,
    protected override readonly snackBar: MatSnackBar,
    private readonly userApiClient: UserApiClient,
  ) {
    super(authService, store, snackBar);
    this.authService.initialize();

    this.isAuthorized$?.pipe(
      takeUntil(this.ngUnsubscribe),
      switchMap(isAuthorized => {
        if (isAuthorized) {
          return this.userApiClient.user_Current();
        }
        return of(undefined);
      }),
      tap((user: UserResponse | undefined) => {
        if (!!user) {
          this.store.dispatch(auth_setUser({ user }));
        }
      }),
      handleApiError(this.snackBar)
    ).subscribe();
  }
}
