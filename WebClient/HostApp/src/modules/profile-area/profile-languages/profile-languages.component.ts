import { Component, Input } from '@angular/core';
import { ProfileLanguagesDialogComponent } from '../../dialogs/profile-languages-dialog/profile-languages-dialog.component';
import { UserLanguageResponse } from '@amarty/models';
import { CommonDialogService, DictionaryService } from '@amarty/services';
import { SafeHtml } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { TranslationPipe } from '@amarty/pipes';
import { LOCALIZATION_KEYS } from '@amarty/localizations';
import { BaseUnsubscribeComponent } from '@amarty/common';

@Component({
  selector: 'app-profile-languages',
  imports: [
    CommonModule,
    TranslationPipe
  ],
  standalone: true,
  templateUrl: './profile-languages.component.html',
  styleUrl: '../profile-area.component.scss'
})
export class ProfileLanguagesComponent extends BaseUnsubscribeComponent {
  @Input() existingItems: UserLanguageResponse[] | undefined;

  constructor(
    private readonly dialogService: CommonDialogService,
    private readonly dictionaryService: DictionaryService
  ) {
    super();
  }

  get isEmptySection(): boolean {
    return !this.existingItems?.length;
  }

  public getItemTitle(language: UserLanguageResponse | undefined): SafeHtml | undefined {
    return this.dictionaryService.getLanguageTitle(language);
  }

  public openItemDialog(languageId?: string): void {
    this.dialogService.showDialog<ProfileLanguagesDialogComponent, UserLanguageResponse>(
      ProfileLanguagesDialogComponent,
      {
        data: { language: this.existingItems?.find(item => item.id === languageId) },
        width: '400px',
        maxWidth: '90vw',
      }
    );
  }

  public removeItem(id: string): void {
    console.log('removeItem', id);
  }

  protected readonly LOCALIZATION_KEYS = LOCALIZATION_KEYS;
}
