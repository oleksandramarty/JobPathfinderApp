import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { catchError, finalize, switchMap, takeUntil, tap, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';

import {
  UpdateUserPreferencesCommand,
  UserResponse,
  InputForm,
  DataItem
} from '@amarty/models';

import { UserApiClient } from '@amarty/api';
import { auth_setUser, selectUser } from '@amarty/store';
import { DictionaryService, LoaderService, LocalizationService } from '@amarty/services';
import { BaseUnsubscribeComponent } from '@amarty/common';
import { GenericFormRendererComponent } from '@amarty/components';
import { TranslationPipe } from '@amarty/pipes';
import { ProfileFormFactory } from '../../../utils/profile-form.factory';

@Component({
  selector: 'app-user-preferences-dialog',
  standalone: true,
  imports: [
    CommonModule,
    TranslationPipe,
    GenericFormRendererComponent,
    MatDialogTitle
  ],
  templateUrl: './user-preferences-dialog.component.html',
  styleUrl: './user-preferences-dialog.component.scss'
})
export class UserPreferencesDialogComponent extends BaseUnsubscribeComponent {
  public renderForm: InputForm | undefined;
  public submitted = false;
  public user: UserResponse | undefined;

  constructor(
    public dialogRef: MatDialogRef<UserPreferencesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: undefined,
    private readonly snackBar: MatSnackBar,
    private readonly localizationService: LocalizationService,
    private readonly loaderService: LoaderService,
    private readonly userApiClient: UserApiClient,
    private readonly dictionaryService: DictionaryService,
    private readonly store: Store
  ) {
    super();

    this.store.select(selectUser)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        tap(user => {
          this.user = user;
          if (!user) {
            this.snackBar.open(
              this.localizationService.getTranslation('ERROR.USER_NOT_FOUND')!,
              this.localizationService.getTranslation('COMMON.OK'),
              { duration: 5000, panelClass: ['error'] }
            );
            this.dialogRef.close();
          } else {
            this.buildForm(user);
          }
        })
      ).subscribe();
  }

  get countries(): DataItem[] {
    return this.dictionaryService.countryDataItems ?? [];
  }
  get currencies(): DataItem[] {
    return this.dictionaryService.currencyDataItems ?? [];
  }
  get locales(): DataItem[] {
    return this.dictionaryService.localeDataItems ?? [];
  }

  private buildForm(user: UserResponse): void {
    const defaultLocaleId = this.dictionaryService.localeData?.find(
      item => item.isoCode === (user.userSetting?.defaultLocale ?? 'en')
    )?.id ?? 1;

    this.renderForm = ProfileFormFactory.createUserPreferencesForm(
      defaultLocaleId,
      user,
      this.locales,
      this.countries,
      this.currencies,
      () => this.dialogRef.close(false),
      () => this.onApplicationSubmit()
    );
  }

  public onApplicationSubmit(): void {
    this.submitted = true;

    if (this.renderForm?.inputFormGroup?.invalid) {
      this.snackBar.open(
        'Fix the errors before submitting',
        'OK',
        { duration: 5000, panelClass: ['error'] }
      );
      return;
    }

    this.loaderService.isBusy = true;

    const values = this.renderForm?.inputFormGroup?.value;
    const selectedLocale = this.dictionaryService.localeData?.find(item => item.id === values.defaultLocale);

    const cmd = new UpdateUserPreferencesCommand();
    cmd.login = values.login;
    cmd.firstName = values.firstName;
    cmd.lastName = values.lastName;
    cmd.defaultLocale = selectedLocale?.isoCode ?? 'en';
    cmd.timeZone = values.timeZone || undefined;
    cmd.countryId = values.countryId || undefined;
    cmd.currencyId = values.currencyId || undefined;
    cmd.linkedInUrl = values.linkedInUrl;
    cmd.npmUrl = values.npmUrl;
    cmd.gitHubUrl = values.gitHubUrl;
    cmd.phone = values.phone;
    cmd.applicationAiPrompt = values.applicationAiPrompt;

    this.userApiClient.user_UpdateSettings(cmd).pipe(
      takeUntil(this.ngUnsubscribe),
      switchMap(() => this.userApiClient.user_Current()),
      tap(user => {
        if (user) {
          this.store.dispatch(auth_setUser({ user }));
          this.localizationService.userLocaleChanged(user);
        }
        this.snackBar.open(
          this.localizationService.getTranslation('MESSAGES.CHANGES_SUCCESSFULLY_SAVED')!,
          this.localizationService.getTranslation('COMMON.OK'),
          { duration: 5000, panelClass: ['error'] }
        );
        this.dialogRef.close(true);
      }),
      catchError(err => {
        this.localizationService.handleApiError(err);
        return throwError(() => err);
      }),
      finalize(() => this.loaderService.isBusy = false)
    ).subscribe();
  }
}
