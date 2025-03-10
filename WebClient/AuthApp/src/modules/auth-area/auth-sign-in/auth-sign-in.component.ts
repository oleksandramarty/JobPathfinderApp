import { Component } from '@angular/core';
import { BaseUnsubscribeComponent } from '@amarty/shared/components';
import { fadeInOut } from '@amarty/shared/animations';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { generateRandomId, handleApiError } from '@amarty/utils'
import { auth_setToken } from '@amarty/store'
import { UserApiClient, AuthSignInRequest, JwtTokenResponse } from '@amarty/api'
import {interval, takeUntil, tap} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Store} from '@ngrx/store';
import {Router} from '@angular/router';

@Component({
  selector: 'app-auth-sign-in',
  templateUrl: './auth-sign-in.component.html',
  styleUrl: '../auth-area/auth-area.component.scss',
  standalone: false,
  host: { 'data-id': generateRandomId(12) },
  animations: [fadeInOut]
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

  private _tokenKey: string = 'honk-token';

  constructor(
    private readonly snackBar: MatSnackBar,
    private readonly userApiClient: UserApiClient,
    private readonly store: Store,
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
        {
          duration: 5000,
          panelClass: ['error']
        });
      return;
    }

    this.userApiClient.auth_SignIn(new AuthSignInRequest({
      login: this.authFormGroup?.value.loginEmail,
      password: this.authFormGroup?.value.password,
      rememberMe: this.authFormGroup?.value.rememberMe
    })).pipe(
      takeUntil(this.ngUnsubscribe),
      tap((token: JwtTokenResponse | undefined) => {
        if (!!token) {
          this.auth_setToken(token);
          this.router.navigate(['/home']);
        }
      }),
      handleApiError(this.snackBar)
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

  private auth_setToken(token: JwtTokenResponse): void {
    localStorage.setItem(this._tokenKey, JSON.stringify(token));
    this.store.dispatch(auth_setToken({token}));
  }
}
