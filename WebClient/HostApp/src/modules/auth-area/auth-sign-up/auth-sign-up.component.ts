import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {catchError, interval, takeUntil, tap, throwError} from 'rxjs';
import { fadeInOut } from '@amarty/animations';
import { generateRandomId } from '@amarty/utils';
import { TranslationPipe } from '@amarty/pipes';
import { BaseUnsubscribeComponent } from '@amarty/common';
import { GenericFormRendererComponent } from '@amarty/components';
import { InputForm } from '@amarty/models';
import { Router, RouterLink } from '@angular/router';
import { AuthFormFactory } from '../utils/form-renderer/auth-form.factory';
import { LOCALIZATION_KEYS } from '@amarty/localizations';
import {GraphQlAuthService} from '../utils/graph-ql/services/graph-ql-auth.service';
import {LocalizationService} from '@amarty/services';

@Component({
  selector: 'app-auth-sign-up',
  templateUrl: './auth-sign-up.component.html',
  styleUrls: ['../auth-area/auth-area.component.scss'],
  standalone: true,
  host: { 'data-id': generateRandomId(12) },
  animations: [fadeInOut],
  imports: [
    CommonModule,
    TranslationPipe,
    MatSnackBarModule,
    RouterLink,
    GenericFormRendererComponent
  ]
})
export class AuthSignUpComponent extends BaseUnsubscribeComponent {
  public renderForm!: InputForm;
  public submitted = false;

  public langArray: string[] = [
    'console.log(\'Hello World!\');', // JavaScript
    'print(\'Hello World!\')', // Python
    'System.out.println("Hello World!");', // Java
    'Console.WriteLine("Hello World!");', // C#
    'printf("Hello World!\\n");', // C
    'std::cout << "Hello World!" << std::endl;', // C++
    'console.log(\'Hello World!\');', // TypeScript
    'fmt.Println("Hello World!")', // Go
    'fn main() { println!("Hello World!"); }', // Rust
    'fun main() { println("Hello World!") }', // Kotlin
    'print("Hello World!")', // Swift
    'echo "Hello World!";', // PHP
    'puts "Hello World!"', // Ruby
    'void main() { print("Hello World!"); }', // Dart
    'cat("Hello World!\\n")', // R
    'object Hello extends App { println("Hello World!") }', // Scala
    'print "Hello World!\\n";', // Perl
    'main = putStrLn "Hello World!"', // Haskell
    'print("Hello World!")', // Lua
    'IO.puts "Hello World!"' // Elixir
  ];
  public langIndex = 0;

  constructor(
    private readonly graphQlAuthService: GraphQlAuthService,
    private readonly localizationService: LocalizationService,
    private readonly snackBar: MatSnackBar,
    private readonly router: Router
  ) {
    super();
    this._startTimer();
  }

  override ngOnInit() {
    this.renderForm = AuthFormFactory.createSignUpForm(
      () => this.signUp()
    );
    super.ngOnInit();
  }

  public signUp(): void {
    this.submitted = true;
    if (this.renderForm.inputFormGroup?.invalid) {
      this.snackBar.open(
        LOCALIZATION_KEYS.COMMON.FIX_ERROR_BEFORE_CONTINUE,
        LOCALIZATION_KEYS.COMMON.BUTTON.OK,
        { duration: 5000, panelClass: ['error'] }
      );
      return;
    }

    this.graphQlAuthService.signUp({
      firstName: this.renderForm.inputFormGroup?.value?.firstName,
      lastName: this.renderForm.inputFormGroup?.value?.lastName,
      login: this.renderForm.inputFormGroup?.value?.login,
      email: this.renderForm.inputFormGroup?.value?.email,
      password: this.renderForm.inputFormGroup?.value?.newPassword,
      passwordAgain: this.renderForm.inputFormGroup?.value?.confirmNewPassword
    }).pipe(
      takeUntil(this.ngUnsubscribe),
      tap(() => {
        this.router.navigate(['/auth/sign-in']);
      }),
      catchError((error: any) => {
        this.localizationService.handleApiError(error);
        return throwError(() => error);
      })
    ).subscribe();

    console.log('Sign-up form submitted:', this.renderForm.inputFormGroup?.value);
  }

  private _startTimer(): void {
    interval(1000)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        tap(() => {
          this.langIndex = (this.langIndex + 1) % this.langArray.length;
        })
      )
      .subscribe();
  }

  protected readonly LOCALIZATION_KEYS = LOCALIZATION_KEYS;
}
