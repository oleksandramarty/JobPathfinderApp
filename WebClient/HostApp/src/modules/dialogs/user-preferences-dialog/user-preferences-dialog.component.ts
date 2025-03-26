import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { finalize, switchMap, takeUntil, tap } from 'rxjs';
import { BaseUnsubscribeComponent, GenericInputComponent } from '@amarty/shared/components';
import { UpdateUserPreferencesCommand, UserApiClient, UserResponse } from '@amarty/api';
import { auth_setUser, selectUser } from '@amarty/store';
import { DictionaryService, LoaderService, LocalizationService } from '@amarty/services';
import { DataItem } from '@amarty/models';
import {handleApiError, traceCreation} from '@amarty/utils';
import {CommonModule} from '@angular/common';
import { TranslationPipe } from '@amarty/utils/pipes';

@Component({
  selector: 'app-user-preferences-dialog',
  imports: [
    CommonModule,
    TranslationPipe,
    GenericInputComponent,
    MatDialogTitle
  ],
  standalone: true,
  templateUrl: './user-preferences-dialog.component.html',
  styleUrl: './user-preferences-dialog.component.scss'
})
export class UserPreferencesDialogComponent extends BaseUnsubscribeComponent{
  public userPreferencesForm: FormGroup | undefined;
  public submitted: boolean = false;
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
    traceCreation(this);

    this.store.select(selectUser)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        tap(user => {
          this.user = user;

          if (!this.user) {
            this.snackBar.open(
              this.localizationService.getTranslation('ERROR.USER_NOT_FOUND')!,
              this.localizationService.getTranslation('COMMON.OK'),
              {
                duration: 5000,
                panelClass: ['error']
              });
            this.dialogRef.close();
          } else {
            this.createFormGroup();
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

  createFormGroup(): void {
    if (!this.user || !!this.userPreferencesForm) {
      return
    }

    const index = this.dictionaryService.localeData?.findIndex(item => item.isoCode === (this.user!.userSetting?.defaultLocale ?? "en")) ?? -1;
    const defaultLocale = index > -1 ? this.dictionaryService.localeData![index] : undefined;

    this.userPreferencesForm = new FormGroup({
      email: new FormControl({value: this.user.email, disabled: true}, [Validators.required]),
      login: new FormControl(this.user.login, [Validators.required]),
      firstName: new FormControl(this.user.firstName),
      lastName: new FormControl(this.user.lastName),
      defaultLocale: new FormControl(defaultLocale?.id ?? 1, [Validators.required]),
      timeZone: new FormControl(this.user.userSetting?.timeZone),
      countryId: new FormControl(this.user.userSetting?.countryId),
      currencyId: new FormControl(this.user.userSetting?.currencyId),
      linkedInUrl: new FormControl(this.user.userSetting?.linkedInUrl),
      npmUrl: new FormControl(this.user.userSetting?.npmUrl),
      gitHubUrl: new FormControl(this.user.userSetting?.gitHubUrl),
      phone: new FormControl(this.user.phone),
      applicationAiPrompt: new FormControl(this.user.userSetting?.applicationAiPrompt ?? false)
    });
  }

  public onApplicationSubmit(): void {
    this.submitted = true;
    if (this.userPreferencesForm?.invalid) {
      this.snackBar.open(
        'Fix the errors before submitting',
        'OK',
        {
          duration: 5000,
          panelClass: ['error']
        });
      return;
    }

    this.loaderService.isBusy = true;

    const index = this.dictionaryService.localeData?.findIndex(item => item.id === Number(this.userPreferencesForm?.value.defaultLocale ?? 0)) ?? -1
    const defaultLocale = index > -1 ? this.dictionaryService.localeData![index] : undefined;

    const temp = new UpdateUserPreferencesCommand();
    temp.login = this.userPreferencesForm?.value.login;
    temp.firstName = this.userPreferencesForm?.value.firstName;
    temp.lastName = this.userPreferencesForm?.value.lastName;
    temp.defaultLocale = defaultLocale?.isoCode ?? 'en';
    temp.timeZone = Number(this.userPreferencesForm?.value.timeZone) > 0 ?
      Number(this.userPreferencesForm?.value.timeZone) : undefined;
    temp.countryId = Number(this.userPreferencesForm?.value.countryId) > 0 ?
      Number(this.userPreferencesForm?.value.countryId) : undefined;
    temp.currencyId = Number(this.userPreferencesForm?.value.currencyId) > 0 ?
      Number(this.userPreferencesForm?.value.currencyId) : undefined;
    temp.applicationAiPrompt = this.userPreferencesForm?.value.applicationAiPrompt;
    temp.linkedInUrl = this.userPreferencesForm?.value.linkedInUrl;
    temp.npmUrl = this.userPreferencesForm?.value.npmUrl;
    temp.gitHubUrl = this.userPreferencesForm?.value.gitHubUrl;
    temp.phone = this.userPreferencesForm?.value.phone;

    this.userApiClient.user_UpdateSettings(temp).pipe(
      takeUntil(this.ngUnsubscribe),
      switchMap(() => {
        return this.userApiClient.user_Current()
      }),
      tap((user: UserResponse | undefined) => {
        if (!!user) {
          this.store.dispatch(auth_setUser({ user }));
          this.localizationService.userLocaleChanged(user);
        }

        this.snackBar.open(
          this.localizationService.getTranslation('MESSAGES.CHANGES_SUCCESSFULLY_SAVED')!,
          this.localizationService.getTranslation('COMMON.OK'),
          {
            duration: 5000,
            panelClass: ['error']
          });

        this.loaderService.isBusy = false;
        this.dialogRef.close(true);
      }),
      handleApiError(this.snackBar),
      finalize(() => {
        this.loaderService.isBusy = false;
      })
    ).subscribe();
  }
}
