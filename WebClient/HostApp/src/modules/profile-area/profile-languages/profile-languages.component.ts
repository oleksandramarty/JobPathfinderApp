import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProfileLanguagesDialogComponent } from '../../dialogs/profile-languages-dialog/profile-languages-dialog.component';
import { UserLanguageResponse } from '@amarty/models';
import { CommonDialogService, DictionaryService } from '@amarty/services';
import { SafeHtml } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { TranslationPipe } from '@amarty/pipes';
import { BaseProfileSectionComponent } from '../base-profile-section.component';
import { generateGuid } from '@amarty/utils';
import { LOCALIZATION_KEYS } from '@amarty/localizations';

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
export class ProfileLanguagesComponent extends BaseProfileSectionComponent<UserLanguageResponse, string> {
  constructor(
    private readonly dialogService: CommonDialogService,
    private readonly snackBar: MatSnackBar,
    private readonly dictionaryService: DictionaryService
  ) {
    super();
  }

  protected override getItemTitle(language: UserLanguageResponse | undefined): SafeHtml | undefined {
    return this.dictionaryService.getLanguageTitle(language);
  }

  protected override getExistingIds(): string[] {
    return Array.from(new Set([
      ...(this.existingItems?.map(item => item.languageId) ?? []),
      ...(this.itemsToAdd?.map(item => item.languageId) ?? [])
    ].filter(id => !!id))).map(item => String(item));;
  }

  protected override openItemDialog(isNew: boolean, languageId?: string): void {
    const executableAction = this.openDialogExecutableAction(isNew, isNew && !languageId ? generateGuid() : languageId!);

    this.dialogService.showDialog<ProfileLanguagesDialogComponent, UserLanguageResponse>(
      ProfileLanguagesDialogComponent,
      {
        data: { language: this.findItem(isNew, languageId), existingIds: this.getExistingIds() },
        width: '400px',
        maxWidth: '90vw',
      },
      executableAction
    );
  }

  protected readonly LOCALIZATION_KEYS = LOCALIZATION_KEYS;
}
