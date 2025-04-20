import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { interval, takeUntil, tap, finalize, catchError, throwError } from 'rxjs';
import { GenericConfirmationMessageDialogComponent, GenericFormRendererComponent } from '@amarty/components';
import { fadeInOut } from '@amarty/animations';
import { generateRandomId } from '@amarty/utils';
import { CommonDialogService, LoaderService, LocalizationService } from '@amarty/services';
import { TranslationPipe } from '@amarty/pipes';
import { BaseUnsubscribeComponent } from '@amarty/common';
import { InputForm, JwtTokenResponse } from '@amarty/models';
import { AuthService } from '../../../utils/services/auth.service';
import { AuthFormFactory } from '../utils/form-renderer/auth-form.factory';
import { LOCALIZATION_KEYS } from '@amarty/localizations';
import { GraphQlAuthService } from '../utils/graph-ql/services/graph-ql-auth.service';

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
    private readonly snackBar: MatSnackBar,
    private readonly authService: AuthService,
    private readonly dialogService: CommonDialogService,
    private readonly loaderService: LoaderService,
    private readonly localizationService: LocalizationService,
    private readonly graphQlAuthService: GraphQlAuthService,
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

    const loginActon = () => {
      this.loaderService.isBusy = true;

      this.graphQlAuthService.signIn(
        this.renderForm.inputFormGroup?.value.loginEmail,
        this.renderForm.inputFormGroup?.value.password,
        this.renderForm.inputFormGroup?.value.rememberMe).pipe(
        takeUntil(this.ngUnsubscribe),
        tap((result) => {
          const token = result?.data?.auth_gateway_sign_in as JwtTokenResponse;
          this.authService.updateToken(token);
          this.router.navigate(['/home']);
          this.loaderService.isBusy = false;
        }),
        catchError((error: any) => {
          this.localizationService.handleApiError(error);
          return throwError(() => error);
        }),
        finalize(() => {
          this.loaderService.isBusy = false;
        })
      ).subscribe();
    };

    this.dialogService.showDialog<GenericConfirmationMessageDialogComponent, boolean>(
      GenericConfirmationMessageDialogComponent,
      {
        width: '400px',
        maxWidth: '80vw',
        data: {
          yesBtn: LOCALIZATION_KEYS.COMMON.BUTTON.PROCEED,
          noBtn: LOCALIZATION_KEYS.COMMON.BUTTON.CANCEL,
          title: LOCALIZATION_KEYS.AUTH.SIGN_IN.SIGN_IN,
          htmlBlock: `
        <h2 style="color: #dc3545; text-align: center;">${this.localizationService.getTranslation(LOCALIZATION_KEYS.COMMON.DO_NOT_STORE_ANY_SENSITIVE_DATA)}</h2>
        <p style="text-align: center"><u>${this.localizationService.getTranslation(LOCALIZATION_KEYS.COMMON.NO_COMPLAINTS)}</u></p>
        `
        }
      },
      loginActon
    );
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
