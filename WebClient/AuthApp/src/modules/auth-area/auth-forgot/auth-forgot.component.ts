import { fadeInOut } from '@amarty/shared/animations';
import { BaseUnsubscribeComponent } from '@amarty/shared/components';
import { generateRandomId } from '@amarty/utils';
import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {interval, takeUntil, tap} from 'rxjs';

@Component({
  selector: 'app-auth-forgot',
  templateUrl: './auth-forgot.component.html',
  styleUrl: './auth-forgot.component.scss',
  standalone: false,
  host: { 'data-id': generateRandomId(12) },
  animations: [fadeInOut]
})
export class AuthForgotComponent extends BaseUnsubscribeComponent {
  public authFormGroup: FormGroup | undefined;

  public langArray: string[] = [
    "Try 'password123' (Just kidding, don't do that!)",
    "Have you tried turning it off and on again?",
    "Maybe it's written on a sticky note somewhere?",
    "Try 'admin' – wait, no, that’s a security risk!",
    "Try reversing your email: 'moc.liamg@resu'",
    "Your password is hidden in plain sight… somewhere.",
    "Did you check your browser’s saved passwords?",
    "The NSA probably knows it. Just saying.",
    "Did you whisper it to your coffee cup this morning?",
    "Try 'letmein' – oh wait, that’s too common!",
    "Think like a hacker. What would **you** guess?",
    "If it's ‘123456’, we need to talk.",
    "Try using 'incorrect' – then you’ll always be right!",
    "Maybe your subconscious remembers? Meditate on it."
  ];

  public langIndex: number = 0;
  public showLang: boolean = true;
  public submitted: boolean = false;

  constructor(
    private readonly snackBar: MatSnackBar
  ) {
    super();

    this._startTimer();
  }

  override ngOnInit() {
    this.authFormGroup = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      login: new FormControl('', [Validators.required])
    });

    super.ngOnInit();
  }

  public forgot(): void {
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
    console.log(this.authFormGroup?.value);
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
}

