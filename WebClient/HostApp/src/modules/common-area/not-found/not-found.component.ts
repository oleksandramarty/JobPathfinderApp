import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {generateRandomId} from '@amarty/utils'
import { BaseUnsubscribeComponent } from '@amarty/shared/components';
import {Observable, of} from 'rxjs';
import {AuthService} from '../../../utils/services/auth.service';

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
export class NotFoundComponent extends BaseUnsubscribeComponent {
  constructor(
    private readonly authService: AuthService
  ) {
    super();
  }

  get isAuthorized$(): Observable<boolean> {
    return this.authService.isAuthorized$ ?? of(false);
  }
}
