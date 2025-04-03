import { Component, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProfileLanguagesDialogComponent } from '../../dialogs/profile-languages-dialog/profile-languages-dialog.component';
import { BaseUnsubscribeComponent } from '@amarty/common';
import {UserLanguageResponse, UserSkillResponse} from '@amarty/models';
import { CommonDialogService, DictionaryService } from '@amarty/services';
import { SafeHtml } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { TranslationPipe } from '@amarty/pipes';
import {BaseProfileSectionComponent} from '../base-profile-section.component';
import {ProfileSkillsDialogComponent} from '../../dialogs/profile-skills-dialog/profile-skills-dialog.component';

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
    const executableAction = this.openDialogExecutableAction(isNew);

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
}
