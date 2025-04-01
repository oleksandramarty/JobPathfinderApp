import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { GenericInputComponent } from '@amarty/components';
import { BaseUnsubscribeComponent } from '@amarty/common';
import { UserApiClient } from '@amarty/api';
import { UserSkillResponse } from '@amarty/models';
import { DictionaryService, LoaderService, LocalizationService } from '@amarty/services';
import { DataItem, InputError } from '@amarty/models';
import { CommonModule } from '@angular/common';
import {generateGuid} from '@amarty/utils';
import { takeUntil, tap } from 'rxjs';
import { TranslationPipe } from '@amarty/pipes';

@Component({
  selector: 'app-profile-skills-dialog',
  imports: [
    CommonModule,
    TranslationPipe,
    GenericInputComponent,
    MatDialogTitle
  ],
  standalone: true,
  templateUrl: './profile-skills-dialog.component.html',
  styleUrl: './profile-skills-dialog.component.scss'
})
export class ProfileSkillsDialogComponent extends BaseUnsubscribeComponent{
  public profileItemForm: FormGroup | undefined;
  public skill: UserSkillResponse | undefined;
  public existingIds: string[] | undefined;
  public submitted: boolean = false;
  public skillInputError: InputError[] | undefined;

  constructor(
    public dialogRef: MatDialogRef<ProfileSkillsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      skill: UserSkillResponse | undefined,
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

    this.skill = data?.skill;
    this.existingIds = data?.existingIds;
    this.createFormGroup();
  }

  get skillLevels(): DataItem[] {
    return this.dictionaryService.skillLevelDataItems ?? [];
  }
  get skills(): DataItem[] {
    return this.dictionaryService.skillDataItems ?? [];
  }

  createFormGroup(): void {
    if (!!this.profileItemForm) {
      return
    }

    this.profileItemForm = new FormGroup({
      id: new FormControl(this.skill?.id ?? generateGuid()),
      skillId: new FormControl(this.skill?.skillId, [Validators.required]),
      skillLevelId: new FormControl(this.skill?.skillLevelId, [Validators.required])
    });

    if (!this.skill) {
      this.profileItemForm?.get('skillId')?.valueChanges
        .pipe(
          takeUntil(this.ngUnsubscribe),
          tap(skill => {
            this.skillInputError =
              (this.existingIds?.findIndex(item => item === String(skill)) ?? -1) > -1 ?
                [{error: 'COMMON.ALREADY_EXISTS'}] :
                undefined;
          })
        ).subscribe();
    }
  }

  public proceedSkill(): void {
    this.submitted = true;
    if (this.profileItemForm?.invalid ||
      !this.profileItemForm?.value.skillId ||
      !this.profileItemForm?.value.skillLevelId ||
      !!this.skillInputError) {
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
