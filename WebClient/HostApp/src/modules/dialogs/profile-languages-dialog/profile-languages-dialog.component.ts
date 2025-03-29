import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { takeUntil, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { BaseUnsubscribeComponent, GenericInputComponent } from '@amarty/shared/components';
import { UserApiClient, UserLanguageResponse } from '@amarty/api';
import { DataItem, InputError } from '@amarty/models';
import { DictionaryService, LoaderService, LocalizationService } from '@amarty/services';
import {generateGuid} from '@amarty/utils';
import { TranslationPipe } from '@amarty/utils/pipes';

@Component({
  selector: 'app-profile-languages-dialog',
  imports: [
    CommonModule,
    TranslationPipe,
    GenericInputComponent,
    MatDialogTitle
  ],
  standalone: true,
  templateUrl: './profile-languages-dialog.component.html',
  styleUrl: './profile-languages-dialog.component.scss'
})
export class ProfileLanguagesDialogComponent extends BaseUnsubscribeComponent{
  public profileItemForm: FormGroup | undefined;
  public language: UserLanguageResponse | undefined;
  public existingIds: string[] | undefined;
  public submitted: boolean = false;
  public languageInputError: InputError[] | undefined;

  constructor(
    public dialogRef: MatDialogRef<ProfileLanguagesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      language: UserLanguageResponse | undefined,
      existingIds: string[] | undefined
    } | undefined,
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
    this.createFormGroup();
  }

  get languageLevels(): DataItem[] {
    return this.dictionaryService.languageLevelDataItems ?? [];
  }
  get languages(): DataItem[] {
    return this.dictionaryService.languageDataItems ?? [];
  }

  createFormGroup(): void {
    if (!!this.profileItemForm) {
      return
    }

    this.profileItemForm = new FormGroup({
      id: new FormControl(this.language?.id ?? generateGuid()),
      languageId: new FormControl(this.language?.languageId, [Validators.required]),
      languageLevelId: new FormControl(this.language?.languageLevelId, [Validators.required])
    });

    if (!this.language) {
      this.profileItemForm?.get('languageId')?.valueChanges
        .pipe(
          takeUntil(this.ngUnsubscribe),
          tap(language => {
            console.log(language);
            this.languageInputError =
              (this.existingIds?.findIndex(item => item === String(language)) ?? -1) > -1 ?
                [{error: 'COMMON.ALREADY_EXISTS'}] :
                undefined;
            console.log(this.existingIds)
            console.log(this.languageInputError)
          })
        ).subscribe();
    }
  }

  public proceedLanguage(): void {
    this.submitted = true;
    if (this.profileItemForm?.invalid ||
      !this.profileItemForm?.value.languageId ||
      !this.profileItemForm?.value.languageLevelId ||
      !!this.languageInputError) {
      this.snackBar.open(
        'Fix the errors before submitting',
        'OK',
        {
          duration: 5000,
          panelClass: ['error']
        });
      return;
    }

    this.dialogRef.close(this.profileItemForm?.value);
  }
}
