import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { interval, takeUntil, tap, finalize, catchError, throwError } from 'rxjs';
import { GenericFormRendererComponent } from '@amarty/components';
import { fadeInOut } from '@amarty/animations';
import { generateRandomId } from '@amarty/utils';
import { UserApiClient } from '@amarty/api';
import { LoaderService, LocalizationService } from '@amarty/services';
import { TranslationPipe } from '@amarty/pipes';
import { BaseUnsubscribeComponent } from '@amarty/common';
import { AuthSignInRequest, InputForm, JwtTokenResponse } from '@amarty/models';
import { AuthService } from '../../../utils/services/auth.service';
import { AuthFormFactory } from '../../../utils/auth-form.factory';
import { LOCALIZATION_KEYS } from '@amarty/localizations';

@Component({
  selector: 'app-auth-sign-in',
  templateUrl: './auth-sign-in.component.html',
  styleUrls: ['../auth-area/auth-area.component.scss'],
  standalone: true,
  host: { 'data-id': generateRandomId(12) },
  animations: [fadeInOut],
  imports: [
    CommonModule,
    TranslationPipe,
    ReactiveFormsModule,
    MatSnackBarModule,
    RouterLink,

    GenericFormRendererComponent
  ]
})
export class AuthSignInComponent extends BaseUnsubscribeComponent {
  public renderForm!: InputForm;

  public langArray: string[] = [
    'JavaScript', 'Python', 'Java', 'C#', 'C', 'C++',
    'TypeScript', 'Go', 'Rust', 'Kotlin', 'Swift', 'PHP', 'Ruby', 'Dart',
    'R', 'Scala', 'Perl', 'Haskell', 'Lua', 'Elixir'
  ];
  public langIndex: number = 0;
  public showLang: boolean = true;

  constructor(
    private readonly authService: AuthService,
    private readonly snackBar: MatSnackBar,
    private readonly userApiClient: UserApiClient,
    private readonly loaderService: LoaderService,
    private readonly localizationService: LocalizationService,
    private readonly router: Router,
  ) {
    super();

    this._startTimer();
  }

  override ngOnInit() {
    this.renderForm = AuthFormFactory.createSignInForm(
      () => this.router.navigate(['/auth/forgot']),
      () => this.login()
    );

    super.ngOnInit();
  }

  public login(): void {
    this.renderForm.submitted = true;
    if (this.renderForm.inputFormGroup?.invalid) {
      this.snackBar.open(
        LOCALIZATION_KEYS.COMMON.FIX_ERROR_BEFORE_CONTINUE,
        LOCALIZATION_KEYS.COMMON.BUTTON.OK,
        { duration: 5000, panelClass: ['error'] }
      );
      return;
    }

    this.loaderService.isBusy = true;

    this.userApiClient.auth_SignIn(new AuthSignInRequest({
      login: this.renderForm.inputFormGroup?.value.loginEmail,
      password: this.renderForm.inputFormGroup?.value.password,
      rememberMe: this.renderForm.inputFormGroup?.value.rememberMe
    })).pipe(
      takeUntil(this.ngUnsubscribe),
      tap((token: JwtTokenResponse | undefined) => {
        if (!!token) {
          this.authService.updateToken(token);
          this.router.navigate(['/home']);
        }
      }),
      catchError((error: any) => {
        this.localizationService.handleApiError(error);
        return throwError(() => error);
      }),
      finalize(() => {
        this.loaderService.isBusy = false;
      })
    ).subscribe();
  }

  private _startTimer(): void {
    interval(1000)
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
