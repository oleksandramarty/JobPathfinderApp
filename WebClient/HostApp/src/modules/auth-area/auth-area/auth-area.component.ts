import { Component } from '@angular/core';
import {generateRandomId, handleApiError} from '@amarty/utils';
import { takeUntil, tap } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BaseUnsubscribeComponent } from '@amarty/common';
import { AuthService } from '../../../utils/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth-area',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSnackBarModule
  ],
  templateUrl: './auth-area.component.html',
  styleUrls: ['./auth-area.component.scss'],
  host: { 'data-id': generateRandomId(12) }
})
export class AuthAreaComponent extends BaseUnsubscribeComponent {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar
  ) {
    super();

    this.authService.isAuthorized$?.pipe(
      takeUntil(this.ngUnsubscribe),
      tap(isAuthorized => {
        if (isAuthorized) {
          this.router.navigate(['/home']);
        }
      }),
      handleApiError(this.snackBar)
    ).subscribe();
  }
}
