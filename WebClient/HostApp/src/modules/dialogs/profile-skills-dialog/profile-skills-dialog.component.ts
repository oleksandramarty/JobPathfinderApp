import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import {UserSkillResponse, DataItem, BaseIdEntityOfGuid, BaseBoolResponse} from '@amarty/models';
import { DictionaryService, LocalizationService } from '@amarty/services';
import { GenericFormRendererComponent } from '@amarty/components';
import { TranslationPipe } from '@amarty/pipes';
import { ProfileFormFactory } from '../../profile-area/utils/form-renderer/profile-form.factory';
import { GraphQlProfileService } from '../../../utils/api/services/graph-ql-profile.service';
import { ProfileUserGenericProfileItem } from '../../profile-area/utils/profile-user-generic-profile-item';
import { ApolloQueryResult } from '@apollo/client';
import {Observable} from 'rxjs';

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
export class ProfileSkillsDialogComponent
  extends
    ProfileUserGenericProfileItem<
      UserSkillResponse,
      ProfileSkillsDialogComponent,
      { profile_create_user_skill: BaseIdEntityOfGuid | undefined },
      { profile_update_user_skill: BaseBoolResponse | undefined }
    >
{
  constructor(
    override readonly dialogRef: MatDialogRef<ProfileSkillsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { skill: UserSkillResponse | undefined, existingIds: string[] | undefined },
    override readonly snackBar: MatSnackBar,
    override readonly localizationService: LocalizationService,
    private readonly dictionaryService: DictionaryService,
    private readonly graphQlProfileService: GraphQlProfileService
  ) {
    super(
      dialogRef,
      snackBar,
      localizationService,
      'profile_create_user_skill',
      'profile_update_user_skill'
    );

    this.genericItem = data?.skill;
    this.existingIds = data?.existingIds;

    this.buildForm();
  }

  protected override buildForm(): void {
    this.renderForm = ProfileFormFactory.createSkillForm(
      () => this.submitForm(),
      () => this.dialogRef.close(false),
      this.genericItem,
      this.skills,
      this.skillLevels
    );

    this.onExistingIdValueChange('skillId');
  }

  protected override userProfileGenericInput(): { skillId: number; skillLevelId: number } {
    return {
      skillId: Number(this.renderForm!.inputFormGroup!.value.skillId),
      skillLevelId: Number(this.renderForm!.inputFormGroup!.value.skillLevelId)
    };
  }

  protected override createMutation$(): Observable<ApolloQueryResult<{ profile_create_user_skill: BaseIdEntityOfGuid | undefined }>> {
    return this.graphQlProfileService.createUserSkill(this.userProfileGenericInput());
  }

  protected override updateMutation$(): Observable<ApolloQueryResult<{ profile_update_user_skill: BaseBoolResponse | undefined }>> {
    return this.graphQlProfileService.updateUserSkill(this.genericItem!.id!, this.userProfileGenericInput());
  }

  get skillLevels(): DataItem[] {
    return this.dictionaryService.skillLevelDataItems ?? [];
  }

  get skills(): DataItem[] {
    return this.dictionaryService.skillDataItems ?? [];
  }
}
