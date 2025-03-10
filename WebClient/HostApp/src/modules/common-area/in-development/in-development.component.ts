import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import {Store} from '@ngrx/store';
import {MatSnackBar} from '@angular/material/snack-bar';
import {BaseAuthorizeComponent} from '@amarty/shared/components';
import {AuthService} from '@amarty/services';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import { generateRandomId } from '@amarty/utils'

@Component({
    selector: 'app-in-development',
    imports: [
      CommonModule,
      ReactiveFormsModule,
      RouterLink
    ],
    templateUrl: './in-development.component.html',
    styleUrl: './in-development.component.scss',
    standalone: true,
  host: { 'data-id': generateRandomId(12) }
})
export class InDevelopmentComponent extends BaseAuthorizeComponent {
  constructor(
    protected override readonly authService: AuthService,
    protected override readonly store: Store,
    protected override readonly snackBar: MatSnackBar,
  ) {
    super(authService, store, snackBar);
  }
}
