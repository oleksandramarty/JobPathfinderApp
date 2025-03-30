import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { debounceTime, filter, interval, takeUntil, tap } from 'rxjs';

import { fadeInOut } from '@amarty/animations';
import {generateRandomId} from '@amarty/utils';
import { InputError } from '@amarty/models';
import { TranslationPipe } from '@amarty/pipes';
import {BaseUnsubscribeComponent} from '@amarty/common';
import {GenericInputComponent} from '@amarty/components';

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
    ReactiveFormsModule,
    MatSnackBarModule,

    GenericInputComponent
  ]
})
export class AuthSignUpComponent extends BaseUnsubscribeComponent {
  public authFormGroup: FormGroup | undefined;

  public langArray: string[] = [
    `console.log('Hello World!');`, // JavaScript
    `print('Hello World!')`, // Python
    `System.out.println("Hello World!");`, // Java
    `Console.WriteLine("Hello World!");`, // C#
    `printf("Hello World!\\n");`, // C
    `std::cout << "Hello World!" << std::endl;`, // C++
    `console.log('Hello World!');`, // TypeScript
    `fmt.Println("Hello World!")`, // Go
    `fn main() { println!("Hello World!"); }`, // Rust
    `fun main() { println("Hello World!") }`, // Kotlin
    `print("Hello World!")`, // Swift
    `echo "Hello World!";`, // PHP
    `puts "Hello World!"`, // Ruby
    `void main() { print("Hello World!"); }`, // Dart
    `cat("Hello World!\\n")`, // R
    `object Hello extends App { println("Hello World!") }`, // Scala
    `print "Hello World!\\n";`, // Perl
    `main = putStrLn "Hello World!"`, // Haskell
    `print("Hello World!")`, // Lua
    `IO.puts "Hello World!"` // Elixir
  ];

  public langIndex: number = 0;

  public emailInputError: InputError[] | undefined;
  public passwordInputError: InputError[] | undefined;
  public submitted: boolean = false;

  constructor(private readonly snackBar: MatSnackBar) {
    super();

    this._startTimer();
  }

  override ngOnInit() {
    this.authFormGroup = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl(''),
      email: new FormControl('', [Validators.required, Validators.email]),
      confirmEmail: new FormControl('', [Validators.required, Validators.email]),
      newPassword: new FormControl('', [Validators.required]),
      confirmNewPassword: new FormControl('', [Validators.required]),
      noComplaints: new FormControl(false, [Validators.required, Validators.requiredTrue])
    });

    this.authFormGroup.valueChanges
      .pipe(
        takeUntil(this.ngUnsubscribe),
        debounceTime(100),
        filter(changes =>
          ['email', 'confirmEmail', 'newPassword', 'confirmNewPassword'].some(key => changes[key] !== undefined)
        )
      )
      .subscribe(value => {
        this.passwordInputError = value.newPassword !== value.confirmNewPassword
          ? [{ error: 'ERROR.PASSWORDS_DO_NOT_MATCH' }]
          : undefined;

        this.emailInputError = value.email !== value.confirmEmail
          ? [{ error: 'ERROR.EMAILS_DO_NOT_MATCH' }]
          : undefined;
      });

    super.ngOnInit();
  }

  public register(): void {
    this.submitted = true;
    if (this.authFormGroup?.invalid) {
      this.snackBar.open(
        'Fix the errors before submitting',
        'OK',
        {
          duration: 5000,
          panelClass: ['error']
        }
      );
      return;
    }

    console.log(this.authFormGroup?.value);
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
}
