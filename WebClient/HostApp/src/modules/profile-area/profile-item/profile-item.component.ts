import { Component, Input } from '@angular/core';
import {
  UserLanguageResponse,
  UserProfileItemEnum,
  UserProfileItemResponse,
  UserSkillResponse
} from '@amarty/models';
import { CommonDialogService, DictionaryService } from '@amarty/services';
import { SafeHtml } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { TranslationPipe } from '@amarty/pipes';
import { ProfileItemDialogComponent } from '../../dialogs/profile-item-dialog/profile-item-dialog.component';
import { generateGuid } from '@amarty/utils';
import { LOCALIZATION_KEYS } from '@amarty/localizations';
import {BaseUnsubscribeComponent} from '@amarty/common';

@Component({
  selector: 'app-profile-item',
  imports: [
    CommonModule,
    TranslationPipe
  ],
  standalone: true,
  templateUrl: './profile-item.component.html',
  styleUrl: '../profile-area.component.scss'
})
export class ProfileItemComponent extends BaseUnsubscribeComponent {
  @Input() itemType: UserProfileItemEnum | undefined;

  public profileItems: UserProfileItemResponse[] | undefined;

  public title: string | undefined;

  constructor(
    private readonly dialogService: CommonDialogService,
    private readonly dictionaryService: DictionaryService
  ) {
    super();
  }

  override get isEmptySection(): boolean {
    return !this.existingItems?.some(item => item.profileItemType === this.itemType);
  }

  override ngOnInit() {
    this.title = itemTypeTitle(this.itemType);
    super.ngOnInit();
  }

  public getSkillTitle(skill: UserSkillResponse | undefined): string {
    return this.dictionaryService.getSkillTitle(skill);
  }

  public getLanguageTitle(language: UserLanguageResponse | undefined): SafeHtml | undefined {
    return this.dictionaryService.getLanguageTitle(language);
  }

  protected override getItemTitle(skill: UserSkillResponse | undefined): string {
    return this.dictionaryService.getSkillTitle(skill);
  }

  protected override getExistingIds(): string[] {
    return Array.from(new Set([
      ...(this.existingItems?.map(item => item.id) ?? []),
      ...(this.itemsToAdd?.map(item => item.id) ?? [])
    ].filter(id => !!id))).map(item => String(item));
  }

  protected override openItemDialog(isNew: boolean, itemId?: string): void {
    const executableAction = this.openDialogExecutableAction(isNew, isNew && !itemId ? generateGuid() : itemId!);

    this.dialogService.showDialog<ProfileItemDialogComponent, UserProfileItemResponse>(
      ProfileItemDialogComponent,
      {
        data: { profileItem: this.findItem(isNew, itemId), profileItemType: this.itemType },
        width: '600px',
        maxWidth: '90vw',
      },
      executableAction
    );
  }

  private _itemTypeTitle(itemType: UserProfileItemEnum | undefined): string {
    switch (itemType) {
      case UserProfileItemEnum.Experience:
        return LOCALIZATION_KEYS.PROFILE.SECTION.WORK_EXPERIENCE;
      case UserProfileItemEnum.Education:
        return LOCALIZATION_KEYS.PROFILE.SECTION.EDUCATION;
      case UserProfileItemEnum.Project:
        return LOCALIZATION_KEYS.PROFILE.SECTION.PROJECTS;
      case UserProfileItemEnum.Achievement:
        return LOCALIZATION_KEYS.PROFILE.SECTION.ACHIEVEMENTS;
      case UserProfileItemEnum.Certification:
        return LOCALIZATION_KEYS.PROFILE.SECTION.CERTIFICATIONS;
      default:
        return '';
    }
  }

  protected readonly LOCALIZATION_KEYS = LOCALIZATION_KEYS;
}
