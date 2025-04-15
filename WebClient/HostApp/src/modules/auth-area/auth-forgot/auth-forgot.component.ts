import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { interval, takeUntil, tap } from 'rxjs';
import { Router, RouterLink } from '@angular/router';

import { fadeInOut } from '@amarty/animations';
import { generateRandomId } from '@amarty/utils';
import { TranslationPipe } from '@amarty/pipes';
import { BaseUnsubscribeComponent } from '@amarty/common';
import { GenericFormRendererComponent } from '@amarty/components';
import { InputForm } from '@amarty/models';
import { AuthFormFactory } from '../utils/form-renderer/auth-form.factory';
import { LOCALIZATION_KEYS } from '@amarty/localizations';

@Component({
  selector: 'app-auth-forgot',
  templateUrl: './auth-forgot.component.html',
  styleUrls: ['../auth-area/auth-area.component.scss'],
  standalone: true,
  host: { 'data-id': generateRandomId(12) },
  animations: [fadeInOut],
  imports: [
    CommonModule,
    TranslationPipe,
    MatSnackBarModule,
    RouterLink,
    GenericFormRendererComponent,
  ]
})
export class AuthForgotComponent extends BaseUnsubscribeComponent {
  public renderForm!: InputForm;
  public submitted = false;

  public langArray: string[] = [
    'Try \'password123\' (Just kidding, don\'t do that!)',
    'Have you tried turning it off and on again?',
    'Maybe it\'s written on a sticky note somewhere?',
    'Try \'admin\' – wait, no, that’s a security risk!',
    'Try reversing your email: \'moc.liamg@resu\'',
    'Your password is hidden in plain sight… somewhere.',
    'Did you check your browser’s saved passwords?',
    'The NSA probably knows it. Just saying.',
    'Did you whisper it to your coffee cup this morning?',
    'Try \'letmein\' – oh wait, that’s too common!',
    'Think like a hacker. What would **you** guess?',
    'If it\'s ‘123456’, we need to talk.',
    'Try using \'incorrect\' – then you’ll always be right!',
    'Maybe your subconscious remembers? Meditate on it.'
  ];
  public langIndex: number = 0;
  public showLang: boolean = true;

  constructor(
    private readonly snackBar: MatSnackBar,
    private readonly router: Router
  ) {
    super();
    this._startTimer();
  }

  override ngOnInit() {
    this.renderForm = AuthFormFactory.createForgotForm(
      () => this.router.navigate(['/auth/sign-in']),
      () => this.forgot()
    );
    super.ngOnInit();
  }

  public forgot(): void {
    this.submitted = true;
    if (this.renderForm.inputFormGroup?.invalid) {
      this.snackBar.open(
        LOCALIZATION_KEYS.COMMON.FIX_ERROR_BEFORE_CONTINUE,
        LOCALIZATION_KEYS.COMMON.BUTTON.OK,
        { duration: 5000, panelClass: ['error'] }
      );
      return;
    }

    console.log('Forgot form submitted:', this.renderForm.inputFormGroup?.value);
  }

  private _startTimer(): void {
    interval(3000)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        tap(() => {
          this.showLang = false;
          setTimeout(() => {
            this.langIndex = (this.langIndex + 1) % this.langArray.length;
            this.showLang = true;
          }, 100);
        })
      )
      .subscribe();
  }

  protected readonly LOCALIZATION_KEYS = LOCALIZATION_KEYS;
}
