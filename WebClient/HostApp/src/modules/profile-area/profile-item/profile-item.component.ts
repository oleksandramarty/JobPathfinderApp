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
import { TranslationPipe, MonthYearFormatPipe } from '@amarty/pipes';
import { ProfileItemDialogComponent } from '../../dialogs/profile-item-dialog/profile-item-dialog.component';
import { LOCALIZATION_KEYS } from '@amarty/localizations';
import { BaseUnsubscribeComponent } from '@amarty/common';

@Component({
  selector: 'app-profile-item',
  imports: [
    CommonModule,
    TranslationPipe,
    MonthYearFormatPipe
  ],
  standalone: true,
  templateUrl: './profile-item.component.html',
  styleUrl: '../profile-area.component.scss'
})
export class ProfileItemComponent extends BaseUnsubscribeComponent {
  @Input() itemType: UserProfileItemEnum | undefined;
  @Input() existingItems: UserProfileItemResponse[] | undefined;
  @Input() isCurrentUser: boolean | undefined;

  public title: string | undefined;

  constructor(
    private readonly dialogService: CommonDialogService,
    private readonly dictionaryService: DictionaryService
  ) {
    super();
  }

  get isEmptySection(): boolean {
    return !this.existingItems?.some(item => item.profileItemType === this.itemType);
  }

  override ngOnInit() {
    this.title = this._itemTypeTitle(this.itemType);
    super.ngOnInit();
  }

  public getSkillTitle(skill: UserSkillResponse | undefined): string {
    return this.dictionaryService.getSkillTitle(skill);
  }

  public getLanguageTitle(language: UserLanguageResponse | undefined): SafeHtml | undefined {
    return this.dictionaryService.getLanguageTitle(language);
  }

  public getItemTitle(skill: UserSkillResponse | undefined): string {
    return this.dictionaryService.getSkillTitle(skill);
  }

  public getCountry(id: number | undefined): string | undefined {
    return this.dictionaryService.countryData?.find(item => item.id === id)?.title;
  }

  public getJobType(id: number | undefined): string | undefined {
    return this.dictionaryService.jobTypeData?.find(item => item.id === id)?.title;
  }

  public getWorkArrangement(id: number | undefined): string | undefined {
    return this.dictionaryService.workArrangementData?.find(item => item.id === id)?.title;
  }

  public openItemDialog(itemId?: string): void {
    if (!this.isCurrentUser) {
      return;
    }

    this.dialogService.showDialog<ProfileItemDialogComponent, UserProfileItemResponse>(
      ProfileItemDialogComponent,
      {
        data: {
          profileItem: this.existingItems?.find(item => item.id === itemId),
          profileItemType: this.itemType,
          title: this.title,
        },
        width: '600px',
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
