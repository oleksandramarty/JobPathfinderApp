import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { takeUntil, tap } from 'rxjs';
import { CommonModule } from '@angular/common';

import {
  UserLanguageResponse,
  DataItem,
  InputError,
  InputForm
} from '@amarty/models';

import { GenericFormRendererComponent } from '@amarty/components';
import { BaseUnsubscribeComponent } from '@amarty/common';
import { UserApiClient } from '@amarty/api';
import { DictionaryService, LoaderService, LocalizationService } from '@amarty/services';
import { TranslationPipe } from '@amarty/pipes';
import { ProfileFormFactory } from '../../../utils/profile-form.factory';
import {LOCALIZATION_KEYS} from "@amarty/localizations";

@Component({
  selector: 'app-profile-languages-dialog',
  standalone: true,
  imports: [
    CommonModule,
    TranslationPipe,
    GenericFormRendererComponent,
    MatDialogTitle
  ],
  templateUrl: './profile-languages-dialog.component.html',
  styleUrl: './profile-languages-dialog.component.scss'
})
export class ProfileLanguagesDialogComponent extends BaseUnsubscribeComponent {
  public renderForm: InputForm | undefined;
  public submitted: boolean = false;
  public language: UserLanguageResponse | undefined;
  public existingIds: string[] | undefined;
  public languageInputError: InputError[] | undefined;

  constructor(
    public dialogRef: MatDialogRef<ProfileLanguagesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      language: UserLanguageResponse | undefined,
      existingIds: string[] | undefined
    },
    private readonly snackBar: MatSnackBar,
    private readonly localizationService: LocalizationService,
    private readonly loaderService: LoaderService,
    private readonly userApiClient: UserApiClient,
    private readonly dictionaryService: DictionaryService,
    private readonly store: Store
  ) {
    super();

    this.language = data?.language;
    this.existingIds = data?.existingIds;
    this.buildForm();
  }

  get languageLevels(): DataItem[] {
    return this.dictionaryService.languageLevelDataItems ?? [];
  }

  get languages(): DataItem[] {
    return this.dictionaryService.languageDataItems ?? [];
  }

  private buildForm(): void {
    this.renderForm = ProfileFormFactory.createLanguageForm(
      () => this.submitForm(),
      () => this.dialogRef.close(false),
      this.language,
      this.languages,
      this.languageLevels
    );

    if (!this.language) {
      this.renderForm.inputFormGroup?.get('languageId')?.valueChanges
        .pipe(
          takeUntil(this.ngUnsubscribe),
          tap(languageId => {
            this.languageInputError =
              (this.existingIds?.includes(String(languageId)) ?? false)
                ? [{ error: LOCALIZATION_KEYS.ERROR.ALREADY_EXISTS }]
                : undefined;
          })
        ).subscribe();
    }
  }

  public submitForm(): void {
    this.submitted = true;

    if (!this.renderForm?.inputFormGroup || this.renderForm.inputFormGroup.invalid || this.languageInputError) {
      this.snackBar.open(
        LOCALIZATION_KEYS.COMMON.FIX_ERROR_BEFORE_CONTINUE,
        LOCALIZATION_KEYS.COMMON.BUTTON.OK,
        { duration: 5000, panelClass: ['error'] }
      );

      if (!!this.languageInputError) {
        this.languageInputError.forEach(error => {
          !!error.error && this.localizationService.showError(error.error);
        });
      }

      return;
    }

    this.dialogRef.close(this.renderForm.inputFormGroup.value);
  }

  protected readonly LOCALIZATION_KEYS = LOCALIZATION_KEYS;
}
