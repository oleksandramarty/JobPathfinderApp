import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { generateRandomId } from '@amarty/utils';
import { BaseUnsubscribeComponent } from '@amarty/common';
import { Observable, of } from 'rxjs';
import { AuthService } from '../../../utils/services/auth.service';
import { TranslationPipe } from '@amarty/pipes';
import { LOCALIZATION_KEYS } from '@amarty/localizations';

@Component({
  selector: 'app-in-development',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,

    TranslationPipe
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

  protected readonly LOCALIZATION_KEYS = LOCALIZATION_KEYS;
}
