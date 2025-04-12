import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, finalize, takeUntil, tap, throwError } from 'rxjs';
import { BaseUnsubscribeComponent } from '@amarty/common';
import {
  AddOrUpdateUserLanguageCommand,
  AddOrUpdateUserProfileItemCommand,
  AddOrUpdateUserSkillCommand,
  UpdateUserPreferencesCommand,
  UserLanguageResponse,
  UserProfileItemEnum,
  UserProfileItemResponse,
  UserResponse,
  UserSkillResponse
} from '@amarty/models';
import { CommonDialogService, DictionaryService, LoaderService, LocalizationService } from '@amarty/services';
import { selectUser } from '@amarty/store';
import { ProfileInfoComponent } from './profile-info/profile-info.component';
import { ProfileSkillsComponent } from './profile-skills/profile-skills.component';
import { ProfileLanguagesComponent } from './profile-languages/profile-languages.component';
import { ProfileItemComponent } from './profile-item/profile-item.component';
import { UserApiClient } from '@amarty/api';
import { LOCALIZATION_KEYS } from '@amarty/localizations';

@Component({
  selector: 'app-profile-area',
  imports: [
    CommonModule,

    ProfileInfoComponent,
    ProfileSkillsComponent,
    ProfileLanguagesComponent,
    ProfileItemComponent
  ],
  standalone: true,
  templateUrl: './profile-area.component.html',
  styleUrl: './profile-area.component.scss'
})
export class ProfileAreaComponent extends BaseUnsubscribeComponent {
  public currentUser: UserResponse | undefined;
  public countryCode: string | undefined;

  public profileItemEnum = UserProfileItemEnum;

  public skillsToAdd: UserSkillResponse[] = [];
  public skillsToRemove: string[] = [];
  public languagesToAdd: UserLanguageResponse[] = [];
  public languagesToRemove: string[] = [];
  public experienceToAdd: UserProfileItemResponse[] = [];
  public educationToAdd: UserProfileItemResponse[] = [];
  public certificationToAdd: UserProfileItemResponse[] = [];
  public projectToAdd: UserProfileItemResponse[] = [];
  public achievementToAdd: UserProfileItemResponse[] = [];
  public experienceToRemove: string[] = [];
  public educationToRemove: string[] = [];
  public certificationToRemove: string[] = [];
  public projectToRemove: string[] = [];
  public achievementToRemove: string[] = [];

  constructor(
    private readonly dialogService: CommonDialogService,
    private readonly dictionaryService: DictionaryService,
    private readonly store: Store,
    private readonly snackBar: MatSnackBar,
    private readonly userApiClient: UserApiClient,
    private readonly loaderService: LoaderService,
    private readonly localizationService: LocalizationService
  ) {
    super();

    this.countryCode = this.dictionaryService.countryData?.find(item => item.id === this.currentUser?.userSetting?.countryId)?.code?.toLowerCase();
  }

  override ngOnInit(): void {
    this.store.select(selectUser)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        tap((user) => {
          this.currentUser = user;
          this.countryCode = this.dictionaryService.countryData?.find(item => item.id === this.currentUser?.userSetting?.countryId)?.code?.toLowerCase();
        })
      ).subscribe();
    super.ngOnInit();
  }

  public updateProfile(): void {
    this.userApiClient.user_UpdateSettings({
      login: this.currentUser?.login,
      headline: this.currentUser?.headline,
      phone: this.currentUser?.phone,
      firstName: this.currentUser?.firstName,
      lastName: this.currentUser?.lastName,
      defaultLocale: this.currentUser?.userSetting?.defaultLocale,
      timeZone: this.currentUser?.userSetting?.timeZone,
      countryId: this.currentUser?.userSetting?.countryId,
      currencyId: this.currentUser?.userSetting?.currencyId,
      applicationAiPrompt: this.currentUser?.userSetting?.applicationAiPrompt,
      linkedInUrl: this.currentUser?.userSetting?.linkedInUrl,
      npmUrl: this.currentUser?.userSetting?.npmUrl,
      gitHubUrl: this.currentUser?.userSetting?.gitHubUrl,
      portfolioUrl: this.currentUser?.userSetting?.portfolioUrl,
      languageIdsToRemove: this.languagesToRemove,
      skillIdsToRemove: this.skillsToRemove,
      profileItemIdsToRemove: [
        ...this.experienceToRemove,
        ...this.educationToRemove,
        ...this.certificationToRemove,
        ...this.projectToRemove,
        ...this.achievementToRemove
      ],
      addOrUpdateUserSkills: this.skillsToAdd.map(skill => ({
        id: skill.id,
        skillId: skill.skillId,
        skillLevelId: skill.skillLevelId
      } as AddOrUpdateUserSkillCommand)),
      addOrUpdateUserLanguages: this.languagesToAdd.map(language => ({
        id: language.id,
        languageId: language.languageId,
        languageLevelId: language.languageLevelId
      } as AddOrUpdateUserLanguageCommand)),
      addOrUpdateProfileItems: [
        ...this.experienceToAdd,
        ...this.educationToAdd,
        ...this.certificationToAdd,
        ...this.projectToAdd,
        ...this.achievementToAdd
      ].map(item => ({
        id: item.id,
        profileItemType: item.profileItemType,
        startDate: item.startDate,
        endDate: item.endDate,
        position: item.position,
        description: item.description,
        company: item.company,
        location: item.location,
        countryId: item.countryId,
        jobTypeId: item.jobTypeId,
        workArrangementId: item.workArrangementId
      } as AddOrUpdateUserProfileItemCommand))
    } as UpdateUserPreferencesCommand).pipe(
      takeUntil(this.ngUnsubscribe),
      tap(() => {
        this.snackBar.open(
          this.localizationService.getTranslation(LOCALIZATION_KEYS.MESSAGES.CHANGES_SUCCESSFULLY_SAVED)!,
          this.localizationService.getTranslation(LOCALIZATION_KEYS.COMMON.BUTTON.OK),
          { duration: 5000, panelClass: ['error'] }
        );
      }),
      catchError((error: any) => {
        this.localizationService.handleApiError(error);
        return throwError(() => error);
      }),
      finalize(() => {
        this.loaderService.isBusy = false;
      })
    );
  }
}
