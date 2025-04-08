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
import { BaseProfileSectionComponent, itemTypeTitle } from '../base-profile-section.component';
import { ProfileItemDialogComponent } from '../../dialogs/profile-item-dialog/profile-item-dialog.component';
import { generateGuid } from '@amarty/utils';

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
export class ProfileItemComponent extends BaseProfileSectionComponent<UserProfileItemResponse, string> {
  @Input() itemType: UserProfileItemEnum | undefined;

  public title: string | undefined;

  constructor(
    private readonly dialogService: CommonDialogService,
    private readonly dictionaryService: DictionaryService
  ) {
    super();
  }

  get existingSectionItems(): UserProfileItemResponse[] {
    return this.existingItems?.filter(item => item.profileItemType === this.itemType) ?? [];
  }

  set existingSectionItems(value: UserProfileItemResponse[]) {
    if (!this.existingItems) {
      return;
    }

    this.existingSectionItems = [
      ...(this.existingItems ?? []),
      ...value
    ];
  }

  override get isEmptySection(): boolean {
    return !this.existingItems?.some(item => item.profileItemType === this.itemType);
  }

  override ngOnInit() {
    this.title = `COMMON.${itemTypeTitle(this.itemType)}`;
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
}
