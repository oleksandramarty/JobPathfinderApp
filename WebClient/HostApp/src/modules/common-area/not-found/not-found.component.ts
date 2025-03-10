import { Component } from '@angular/core';
import {Store} from "@ngrx/store";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AuthService} from '@amarty/services';
import {BaseAuthorizeComponent} from '@amarty/shared/components';
import {ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';
import { generateRandomId } from '@amarty/utils'

@Component({
    selector: 'app-not-found',
    imports: [
      CommonModule,
      ReactiveFormsModule,
      RouterLink
    ],
    templateUrl: './not-found.component.html',
    styleUrl: './not-found.component.scss',
    standalone: true,
  host: { 'data-id': generateRandomId(12) }
})
export class NotFoundComponent extends BaseAuthorizeComponent {
  constructor(
      protected override readonly authService: AuthService,
      protected override readonly store: Store,
      protected override readonly snackBar: MatSnackBar,
  ) {
    super(authService, store, snackBar);
  }
}
