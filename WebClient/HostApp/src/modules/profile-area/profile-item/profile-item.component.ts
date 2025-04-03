import { Component, Input } from '@angular/core';
import {
  UserLanguageResponse,
  UserProfileItemEnum,
  UserProfileItemResponse,
  UserResponse,
  UserSkillResponse
} from '@amarty/models';
import { BaseUnsubscribeComponent } from '@amarty/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonDialogService, DictionaryService } from '@amarty/services';
import { SafeHtml } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { TranslationPipe } from '@amarty/pipes';
import {BaseProfileSectionComponent} from '../base-profile-section.component';
import {ProfileSkillsDialogComponent} from '../../dialogs/profile-skills-dialog/profile-skills-dialog.component';

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

  get itemTypeTitle(): string {
    switch (this.itemType) {
      case UserProfileItemEnum.Experience:
        return 'EXPERIENCE';
      case UserProfileItemEnum.Education:
        return 'EDUCATION';
      case UserProfileItemEnum.Project:
        return 'PROJECTS';
      case UserProfileItemEnum.Achievement:
        return 'ACHIEVEMENTS';
      case UserProfileItemEnum.Certification:
        return 'CERTIFICATIONS';
      default:
        return '';
    }
  }

  override get isEmptySection(): boolean {
    return !this.existingItems?.some(item => item.profileItemType === this.itemType);
  }

  override ngOnInit() {
    this.title = `COMMON.${this.itemTypeTitle}`;
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
    const executableAction = this.openDialogExecutableAction(isNew);

    // this.dialogService.showDialog<ProfileSkillsDialogComponent, UserSkillResponse>(
    //   ProfileSkillsDialogComponent,
    //   {
    //     data: { item: this.findItem(isNew, itemId), existingIds: this.getExistingIds() },
    //     width: '400px',
    //     maxWidth: '90vw',
    //   },
    //   executableAction
    // );
  }
}
