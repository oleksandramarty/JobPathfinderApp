import { Component, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProfileSkillsDialogComponent } from '../../dialogs/profile-skills-dialog/profile-skills-dialog.component';
import { UserSkillResponse } from '@amarty/models';
import { CommonDialogService, DictionaryService } from '@amarty/services';
import { BaseUnsubscribeComponent } from '@amarty/common';
import { CommonModule } from '@angular/common';
import { TranslationPipe } from '@amarty/pipes';

@Component({
  selector: 'app-profile-skills',
  imports: [
    CommonModule,
    TranslationPipe
  ],
  standalone: true,
  templateUrl: './profile-skills.component.html',
  styleUrl: '../profile-area.component.scss'
})
export class ProfileSkillsComponent extends BaseUnsubscribeComponent {
  @Input() existingSkills: UserSkillResponse[] | undefined;

  public skillsToAdd: UserSkillResponse[] | undefined;
  public skillIdsToRemove: string[] | undefined;

  constructor(
    private readonly dialogService: CommonDialogService,
    private readonly snackBar: MatSnackBar,
    private readonly dictionaryService: DictionaryService
  ) {
    super();
  }

  public getSkillTitle(skill: UserSkillResponse | undefined): string {
    return this.dictionaryService.getSkillTitle(skill);
  }

  public openSkillsDialog(skillId?: string, isNew: boolean = false): void {
    const executableAction = (model: UserSkillResponse): void => {
      const targetList = isNew
        ? (this.skillsToAdd ??= [])
        : (this.existingSkills ??= []);

      const index = targetList.findIndex(skill => skill.id === model.id);

      if (index > -1) {
        targetList[index] = model;
      } else {
        targetList.push(model);
      }
    };

    const findSkill = (): UserSkillResponse | undefined => {
      if (!skillId) return undefined;

      const skillList = isNew ? this.skillsToAdd : this.existingSkills;
      const index = skillList?.findIndex(item => item.id === skillId) ?? -1;

      return index > -1 ? skillList?.[index] : undefined;
    };

    const skillToEdit = findSkill();

    const existingIds = Array.from(new Set([
      ...(this.existingSkills?.map(item => item.skillId) ?? []),
      ...(this.skillsToAdd?.map(item => item.skillId) ?? [])
    ].filter(id => !!id))).map(item => String(item));

    this.dialogService.showDialog<ProfileSkillsDialogComponent, UserSkillResponse>(
      ProfileSkillsDialogComponent,
      {
        data: { skill: skillToEdit, existingIds },
        width: '400px',
        maxWidth: '90vw',
      },
      executableAction
    );
  }

  public removeSkill(skillId: string, isNew: boolean = false): void {
    this.skillIdsToRemove ??=[];

    const removeFromList = (list?: UserSkillResponse[]): void => {
      const index = list?.findIndex(skill => skill.id === skillId);
      if (index !== undefined && index > -1) {
        list!.splice(index, 1);
      }
    };

    if (isNew) {
      removeFromList(this.skillsToAdd);
    } else {
      removeFromList(this.existingSkills);
      this.skillIdsToRemove.push(skillId);
    }
  }
}
