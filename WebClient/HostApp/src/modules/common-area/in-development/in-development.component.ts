import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {generateRandomId} from '@amarty/utils'
import { BaseUnsubscribeComponent } from '@amarty/shared/components';
import {Observable, of} from 'rxjs';
import {AuthService} from '../../../utils/services/auth.service';

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
export class InDevelopmentComponent extends BaseUnsubscribeComponent {
  constructor(
    private readonly authService: AuthService
  ) {
    super();
  }

  get isAuthorized$(): Observable<boolean> {
    return this.authService.isAuthorized$ ?? of(false);
  }
}
