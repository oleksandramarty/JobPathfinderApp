import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import {
  UserResponse,
  InputForm,
  DataItem
} from '@amarty/models';
import { DictionaryService, LocalizationService } from '@amarty/services';
import { BaseUnsubscribeComponent } from '@amarty/common';
import { GenericFormRendererComponent } from '@amarty/components';
import { TranslationPipe } from '@amarty/pipes';
import { ProfileFormFactory } from '../../profile-area/utils/form-renderer/profile-form.factory';
import { LOCALIZATION_KEYS } from '@amarty/localizations';
import { GraphQlAuthService } from '../../auth-area/utils/graph-ql/services/graph-ql-auth.service';
import { catchError, takeUntil, tap, throwError } from 'rxjs';

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
    @Inject(MAT_DIALOG_DATA) public data: {
      user: UserResponse | undefined;
    } | undefined,
    private readonly snackBar: MatSnackBar,
    private readonly dictionaryService: DictionaryService,
    private readonly localizationService: LocalizationService,
    private readonly graphQlAuthService: GraphQlAuthService
  ) {
    super();

    this.user = data?.user;
    this._buildForm(this.user!);
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

  private _buildForm(user: UserResponse): void {
    const defaultLocaleId = this.dictionaryService.localeData?.find(
      item => item.isoCode === (user.userSetting?.defaultLocale ?? 'en')
    )?.id ?? 1;

    this.renderForm = ProfileFormFactory.createUserPreferencesForm(
      defaultLocaleId,
      user,
      this.locales,
      this.countries,
      this.currencies,
      () => this.onApplicationSubmit(),
      () => this.dialogRef.close(false)
    );
  }

  public onApplicationSubmit(): void {
    this.submitted = true;

    if (this.renderForm?.inputFormGroup?.invalid) {
      this.snackBar.open(
        LOCALIZATION_KEYS.COMMON.FIX_ERROR_BEFORE_CONTINUE,
        LOCALIZATION_KEYS.COMMON.BUTTON.OK,
        { duration: 5000, panelClass: ['error'] }
      );
      return;
    }

    const values = this.renderForm?.inputFormGroup?.value;
    const selectedLocale = this.dictionaryService.localeData?.find(item => item.id === values.defaultLocale);

    if (!this.user) {
      this.dialogRef.close(false);
      return;
    }

    this.graphQlAuthService.updateUserPreferences({
      login: values.login,
      headline: values.headline,
      phone: values.phone,
      firstName: values.firstName,
      lastName: values.lastName,
      defaultLocale: selectedLocale?.isoCode ?? 'en',
      timeZone: isNaN(values.timeZone) ? undefined : Number(values.timeZone),
      countryId: isNaN(values.countryId) ? undefined : Number(values.countryId),
      currencyId: isNaN(values.currencyId) ? undefined : Number(values.currencyId),
      applicationAiPrompt: values.applicationAiPrompt ?? false,
      linkedInUrl: values.linkedInUrl,
      npmUrl: values.npmUrl,
      gitHubUrl: values.gitHubUrl,
      portfolioUrl: values.portfolioUrl,
      showCurrentPosition: values.showCurrentPosition ?? false,
      showHighestEducation: values.showHighestEducation ?? false
    }).pipe(
      takeUntil(this.ngUnsubscribe),
      tap(() => {
        this.dialogRef.close(true);
      }),
      catchError((error: any) => {
        this.localizationService.handleApiError(error);
        return throwError(() => error);
      })
    ).subscribe();
  }

  protected readonly LOCALIZATION_KEYS = LOCALIZATION_KEYS;
}
