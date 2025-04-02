import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { interval, takeUntil, tap, finalize } from 'rxjs';
import {GenericInputComponent} from '@amarty/components';
import { fadeInOut } from '@amarty/animations';
import {generateRandomId} from '@amarty/utils';
import {UserApiClient} from '@amarty/api';
import { LoaderService } from '@amarty/services';
import { TranslationPipe } from '@amarty/pipes';
import {BaseUnsubscribeComponent} from '@amarty/common';
import {AuthSignInRequest, JwtTokenResponse} from '@amarty/models';
import {AuthService} from '../../../utils/services/auth.service';

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

    GenericInputComponent
  ]
})
export class AuthSignInComponent extends BaseUnsubscribeComponent {
  public authFormGroup: FormGroup | undefined;

  public langArray: string[] = [
    "JavaScript", "Python", "Java", "C#", "C", "C++",
    "TypeScript", "Go", "Rust", "Kotlin", "Swift", "PHP", "Ruby", "Dart",
    "R", "Scala", "Perl", "Haskell", "Lua", "Elixir"
  ];
  public langIndex: number = 0;
  public showLang: boolean = true;
  public submitted: boolean = false;

  constructor(
    private readonly authService: AuthService,
    private readonly snackBar: MatSnackBar,
    private readonly userApiClient: UserApiClient,
    private readonly loaderService: LoaderService,
    private readonly router: Router,
  ) {
    super();

    this._startTimer();
  }

  override ngOnInit() {
    this.authFormGroup = new FormGroup({
      loginEmail: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      rememberMe: new FormControl(false)
    });

    super.ngOnInit();
  }

  public login(): void {
    this.submitted = true;
    if (this.authFormGroup?.invalid) {
      this.snackBar.open(
        'Fix the errors before submitting',
        'OK',
        { duration: 5000, panelClass: ['error'] }
      );
      return;
    }

    this.loaderService.isBusy = true;

    this.userApiClient.auth_SignIn(new AuthSignInRequest({
      login: this.authFormGroup?.value.loginEmail,
      password: this.authFormGroup?.value.password,
      rememberMe: this.authFormGroup?.value.rememberMe
    })).pipe(
      takeUntil(this.ngUnsubscribe),
      tap((token: JwtTokenResponse | undefined) => {
        if (!!token) {
          this.authService.updateToken(token);
          this.router.navigate(['/home']);
        }
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
}
