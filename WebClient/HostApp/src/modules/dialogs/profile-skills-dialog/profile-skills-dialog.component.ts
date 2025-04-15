import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { takeUntil, tap } from 'rxjs';
import {
  UserSkillResponse,
  InputForm,
  DataItem,
  InputError
} from '@amarty/models';
import { UserApiClient } from '@amarty/api';
import { DictionaryService, LoaderService, LocalizationService } from '@amarty/services';
import { BaseUnsubscribeComponent } from '@amarty/common';
import { GenericFormRendererComponent } from '@amarty/components';
import { TranslationPipe } from '@amarty/pipes';
import { ProfileFormFactory } from '../../profile-area/utils/form-renderer/profile-form.factory';
import { LOCALIZATION_KEYS } from '@amarty/localizations';

@Component({
  selector: 'app-profile-skills-dialog',
  standalone: true,
  imports: [
    CommonModule,
    TranslationPipe,
    GenericFormRendererComponent,
    MatDialogTitle
  ],
  templateUrl: './profile-skills-dialog.component.html',
  styleUrl: './profile-skills-dialog.component.scss'
})
export class ProfileSkillsDialogComponent extends BaseUnsubscribeComponent {
  public renderForm: InputForm | undefined;
  public skill: UserSkillResponse | undefined;
  public existingIds: string[] | undefined;
  public submitted = false;
  public skillInputError: InputError[] | undefined;

  constructor(
    public dialogRef: MatDialogRef<ProfileSkillsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { skill: UserSkillResponse | undefined, existingIds: string[] | undefined },
    private readonly snackBar: MatSnackBar,
    private readonly localizationService: LocalizationService,
    private readonly loaderService: LoaderService,
    private readonly userApiClient: UserApiClient,
    private readonly dictionaryService: DictionaryService,
    private readonly store: Store
  ) {
    super();

    this.skill = data?.skill;
    this.existingIds = data?.existingIds;

    this.buildForm();
  }

  get skillLevels(): DataItem[] {
    return this.dictionaryService.skillLevelDataItems ?? [];
  }

  get skills(): DataItem[] {
    return this.dictionaryService.skillDataItems ?? [];
  }

  private buildForm(): void {
    this.renderForm = ProfileFormFactory.createSkillForm(
      () => this.submitForm(),
      () => this.dialogRef.close(false),
      this.skill,
      this.skills,
      this.skillLevels
    );

    if (!this.skill) {
      this.renderForm.inputFormGroup?.get('skillId')?.valueChanges
        .pipe(
          takeUntil(this.ngUnsubscribe),
          tap(skillId => {
            this.skillInputError =
              (this.existingIds?.includes(String(skillId)) ?? false)
                ? [{ error: LOCALIZATION_KEYS.ERROR.ALREADY_EXISTS }]
                : undefined;
          })
        ).subscribe();
    }
  }

  public submitForm(): void {
    this.submitted = true;

    if (!this.renderForm?.inputFormGroup || this.renderForm.inputFormGroup.invalid || this.skillInputError) {
      this.snackBar.open(
        LOCALIZATION_KEYS.COMMON.FIX_ERROR_BEFORE_CONTINUE,
        LOCALIZATION_KEYS.COMMON.BUTTON.OK,
        { duration: 5000, panelClass: ['error'] }
      );

      if (!!this.skillInputError) {
        this.skillInputError.forEach(error => {
          !!error.error && this.localizationService.showError(error.error);
        });
      }

      return;
    }

    this.dialogRef.close(this.renderForm.inputFormGroup.value);
  }

  protected readonly LOCALIZATION_KEYS = LOCALIZATION_KEYS;
}
