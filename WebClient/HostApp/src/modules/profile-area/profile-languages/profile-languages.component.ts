import { Component, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProfileLanguagesDialogComponent } from '../../dialogs/profile-languages-dialog/profile-languages-dialog.component';
import { BaseUnsubscribeComponent } from '@amarty/shared/components';
import { UserLanguageResponse } from '@amarty/api';
import { CommonDialogService, DictionaryService } from '@amarty/services';
import { SafeHtml } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import {traceCreation} from '@amarty/utils';
import { TranslationPipe } from '@amarty/utils/pipes';

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
  @Input() existingLanguages: UserLanguageResponse[] | undefined;

  public languagesToAdd: UserLanguageResponse[] | undefined;
  public languageIdsToRemove: string[] | undefined;

  constructor(
    private readonly dialogService: CommonDialogService,
    private readonly snackBar: MatSnackBar,
    private readonly dictionaryService: DictionaryService
  ) {
    super();
    traceCreation(this);
  }

  public getLanguageTitle(language: UserLanguageResponse | undefined): SafeHtml | undefined {
    return this.dictionaryService.getLanguageTitle(language);
  }

  public openLanguagesDialog(languageId?: string, isNew: boolean = false): void {
    const executableAction = (model: UserLanguageResponse): void => {
      const targetList = isNew
        ? (this.languagesToAdd ??= [])
        : (this.existingLanguages ??= []);

      const index = targetList.findIndex(language => language.id === model.id);

      if (index > -1) {
        targetList[index] = model;
      } else {
        targetList.push(model);
      }
    };

    const findLanguage = (): UserLanguageResponse | undefined => {
      if (!languageId) return undefined;

      const languageList = isNew ? this.languagesToAdd : this.existingLanguages;
      const index = languageList?.findIndex(item => item.id === languageId) ?? -1;

      return index > -1 ? languageList?.[index] : undefined;
    };

    const languageToEdit = findLanguage();

    const existingIds = Array.from(new Set([
      ...(this.existingLanguages?.map(item => item.languageId) ?? []),
      ...(this.languagesToAdd?.map(item => item.languageId) ?? [])
    ].filter(id => !!id))).map(item => String(item));

    this.dialogService.showDialog<ProfileLanguagesDialogComponent, UserLanguageResponse>(
      ProfileLanguagesDialogComponent,
      {
        data: { language: languageToEdit, existingIds },
        width: '400px',
        maxWidth: '90vw',
      },
      executableAction
    );
  }

  public removeLanguage(languageId: string, isNew: boolean = false): void {
    this.languageIdsToRemove ??=[];

    const removeFromList = (list?: UserLanguageResponse[]): void => {
      const index = list?.findIndex(language => language.id === languageId);
      if (index !== undefined && index > -1) {
        list!.splice(index, 1);
      }
    };

    if (isNew) {
      removeFromList(this.languagesToAdd);
    } else {
      removeFromList(this.existingLanguages);
      this.languageIdsToRemove.push(languageId);
    }
  }
}
