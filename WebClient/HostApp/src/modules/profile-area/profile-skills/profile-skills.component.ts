import { Component, Input } from '@angular/core';
import { ProfileSkillsDialogComponent } from '../../dialogs/profile-skills-dialog/profile-skills-dialog.component';
import { UserSkillResponse } from '@amarty/models';
import { CommonDialogService, DictionaryService } from '@amarty/services';
import { CommonModule } from '@angular/common';
import { TranslationPipe } from '@amarty/pipes';
import { LOCALIZATION_KEYS } from '@amarty/localizations';
import { BaseUnsubscribeComponent } from '@amarty/common';

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
export class ProfileSkillsComponent extends BaseUnsubscribeComponent{
  @Input() existingItems: UserSkillResponse[] | undefined;
  @Input() isCurrentUser: boolean | undefined;

  constructor(
    private readonly dialogService: CommonDialogService,
    private readonly dictionaryService: DictionaryService
  ) {
    super();
  }

  get isEmptySection(): boolean {
    return !this.existingItems?.length;
  }

  public getItemTitle(skill: UserSkillResponse | undefined): string {
    return this.dictionaryService.getSkillTitle(skill);
  }

  public openItemDialog(id?: string): void {
    if (!this.isCurrentUser) {
      return;
    }

    this.dialogService.showDialog<ProfileSkillsDialogComponent, UserSkillResponse>(
      ProfileSkillsDialogComponent,
      {
        data: { skill: this.existingItems?.find(item => item.id == id) },
        width: '400px',
        maxWidth: '90vw',
      }
    );
  }

  public removeItem(id: string): void {
    if (!this.isCurrentUser) {
      return;
    }

    console.log('removeItem', id);
  }

  protected readonly LOCALIZATION_KEYS = LOCALIZATION_KEYS;
}
