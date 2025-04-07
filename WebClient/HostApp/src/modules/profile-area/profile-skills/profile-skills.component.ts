import { Component } from '@angular/core';
import { ProfileSkillsDialogComponent } from '../../dialogs/profile-skills-dialog/profile-skills-dialog.component';
import { UserSkillResponse } from '@amarty/models';
import { CommonDialogService, DictionaryService } from '@amarty/services';
import { CommonModule } from '@angular/common';
import { TranslationPipe } from '@amarty/pipes';
import { BaseProfileSectionComponent } from '../base-profile-section.component';
import { generateGuid } from '@amarty/utils';

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
export class ProfileSkillsComponent extends BaseProfileSectionComponent<UserSkillResponse, string> {
  constructor(
    private readonly dialogService: CommonDialogService,
    private readonly dictionaryService: DictionaryService
  ) {
    super();
  }

  protected override getItemTitle(skill: UserSkillResponse | undefined): string {
    return this.dictionaryService.getSkillTitle(skill);
  }

  protected override getExistingIds(): string[] {
    return Array.from(new Set([
      ...(this.existingItems?.map(item => item.skillId) ?? []),
      ...(this.itemsToAdd?.map(item => item.skillId) ?? [])
    ].filter(id => !!id))).map(item => String(item));;
  }

  protected override openItemDialog(isNew: boolean, skillId?: string): void {
    const executableAction = this.openDialogExecutableAction(isNew, isNew && !skillId ? generateGuid() : skillId!);

    this.dialogService.showDialog<ProfileSkillsDialogComponent, UserSkillResponse>(
      ProfileSkillsDialogComponent,
      {
        data: { skill: this.findItem(isNew, skillId), existingIds: this.getExistingIds() },
        width: '400px',
        maxWidth: '90vw',
      },
      executableAction
    );
  }
}
