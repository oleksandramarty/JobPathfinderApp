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
  @Input() currentUser: UserResponse | undefined;
  @Input() itemType: UserProfileItemEnum | undefined;

  public itemsToAdd: UserProfileItemResponse[] | undefined;
  public itemIdsToRemove: string[] | undefined;
  public title: string | undefined;
  public addButtonTitle: string | undefined;

  public isEditMode: boolean = false;

  constructor(
    private readonly dialogService: CommonDialogService,
    private readonly snackBar: MatSnackBar,
    private readonly dictionaryService: DictionaryService
  ) {
    super();
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

  get isEmptySection(): boolean {
    return !this.currentUser?.profileItems?.some(item => item.profileItemType === this.itemType);
  }

  override ngOnInit() {
    this.title = `COMMON.${this.itemTypeTitle}`;
    this.addButtonTitle = `COMMON.ADD_${this.itemTypeTitle}`;
    super.ngOnInit();
  }



  public getSkillTitle(skill: UserSkillResponse | undefined): string {
    return this.dictionaryService.getSkillTitle(skill);
  }

  public getLanguageTitle(language: UserLanguageResponse | undefined): SafeHtml | undefined {
    return this.dictionaryService.getLanguageTitle(language);
  }
}
