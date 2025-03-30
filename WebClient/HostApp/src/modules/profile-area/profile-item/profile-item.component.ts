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

  constructor(
    private readonly dialogService: CommonDialogService,
    private readonly snackBar: MatSnackBar,
    private readonly dictionaryService: DictionaryService
  ) {
    super();
  }

  override ngOnInit() {
    this.title = `COMMON.${String(this.itemType).toUpperCase()}`;
    this.addButtonTitle = `COMMON.ADD_${String(this.itemType).toUpperCase()}`;
    super.ngOnInit();
  }

  public getSkillTitle(skill: UserSkillResponse | undefined): string {
    return this.dictionaryService.getSkillTitle(skill);
  }

  public getLanguageTitle(language: UserLanguageResponse | undefined): SafeHtml | undefined {
    return this.dictionaryService.getLanguageTitle(language);
  }
}
