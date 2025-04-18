import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { ApolloQueryResult } from '@apollo/client';

import { UserLanguageResponse, DataItem, BaseIdEntityOfGuid, BaseBoolResponse } from '@amarty/models';
import { DictionaryService, LocalizationService } from '@amarty/services';
import { GenericFormRendererComponent } from '@amarty/components';
import { TranslationPipe } from '@amarty/pipes';
import { ProfileFormFactory } from '../../profile-area/utils/form-renderer/profile-form.factory';
import { GraphQlProfileService } from '../../profile-area/utils/graph-ql/services/graph-ql-profile.service';
import { ProfileUserGenericProfileItem } from '../../profile-area/utils/profile-user-generic-profile-item';

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
export class ProfileLanguagesDialogComponent
  extends
    ProfileUserGenericProfileItem<
      UserLanguageResponse,
      ProfileLanguagesDialogComponent,
      { profile_create_user_language: BaseIdEntityOfGuid | undefined },
      { profile_update_user_language: BaseBoolResponse | undefined }
    >
{
  constructor(
    override readonly dialogRef: MatDialogRef<ProfileLanguagesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { language: UserLanguageResponse | undefined, existingIds: string[] | undefined },
    override readonly snackBar: MatSnackBar,
    override readonly localizationService: LocalizationService,
    private readonly dictionaryService: DictionaryService,
    private readonly graphQlProfileService: GraphQlProfileService
  ) {
    super(
      dialogRef,
      snackBar,
      localizationService,
      'profile_create_user_language',
      'profile_update_user_language'
    );

    this.genericItem = data?.language;
    this.existingIds = data?.existingIds;

    this.buildForm();
  }

  protected override buildForm(): void {
    this.renderForm = ProfileFormFactory.createLanguageForm(
      () => this.submitForm(),
      () => this.dialogRef.close(false),
      this.genericItem,
      this.languages,
      this.languageLevels
    );

    this.onExistingIdValueChange('languageId');
  }

  protected override userProfileGenericInput(): { languageId: number; languageLevelId: number } {
    return {
      languageId: Number(this.renderForm!.inputFormGroup!.value.languageId),
      languageLevelId: Number(this.renderForm!.inputFormGroup!.value.languageLevelId)
    };
  }

  protected override createMutation$(): Observable<ApolloQueryResult<{ profile_create_user_language: BaseIdEntityOfGuid | undefined }>> {
    return this.graphQlProfileService.createUserLanguage(this.userProfileGenericInput());
  }

  protected override updateMutation$(): Observable<ApolloQueryResult<{ profile_update_user_language: BaseBoolResponse | undefined }>> {
    return this.graphQlProfileService.updateUserLanguage(this.genericItem!.id!, this.userProfileGenericInput());
  }

  get languageLevels(): DataItem[] {
    return this.dictionaryService.languageLevelDataItems ?? [];
  }

  get languages(): DataItem[] {
    return this.dictionaryService.languageDataItems ?? [];
  }
}
