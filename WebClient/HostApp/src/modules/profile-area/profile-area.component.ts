import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin, takeUntil, tap} from 'rxjs';
import { BaseUnsubscribeComponent } from '@amarty/common';
import {
  UserProfileItemEnum,
  UserProfileResponse,
  UserResponse,
} from '@amarty/models';
import { DictionaryService } from '@amarty/services';
import { ProfileInfoComponent } from './profile-info/profile-info.component';
import { ProfileSkillsComponent } from './profile-skills/profile-skills.component';
import { ProfileLanguagesComponent } from './profile-languages/profile-languages.component';
import { ProfileItemComponent } from './profile-item/profile-item.component';
import { LOCALIZATION_KEYS } from '@amarty/localizations';
import {TranslationPipe} from '@amarty/pipes';
import {Store} from '@ngrx/store';
import {selectProfile, selectUser} from '@amarty/store';

@Component({
  selector: 'app-profile-area',
  imports: [
    CommonModule,

    ProfileInfoComponent,
    ProfileSkillsComponent,
    ProfileLanguagesComponent,
    ProfileItemComponent,

    TranslationPipe
  ],
  standalone: true,
  templateUrl: './profile-area.component.html',
  styleUrl: './profile-area.component.scss'
})
export class ProfileAreaComponent extends BaseUnsubscribeComponent {
  public currentUser: UserResponse | undefined;
  public userProfile: UserProfileResponse | undefined;
  public countryCode: string | undefined;

  public profileItemEnum = UserProfileItemEnum;

  constructor(
    private readonly dictionaryService: DictionaryService,
    private readonly store: Store,
  ) {
    super();

    this.countryCode = this.dictionaryService.countryData?.find(item => item.id === this.currentUser?.userSetting?.countryId)?.code?.toLowerCase();
  }

  override ngOnInit(): void {
    forkJoin([
      this.store.select(selectUser),
      this.store.select(selectProfile)
    ]).pipe(
        takeUntil(this.ngUnsubscribe),
        tap(data => {
          this.currentUser = data[0];
          this.userProfile = data[1];
          this.countryCode = this.dictionaryService.countryData?.find(item => item.id === this.currentUser?.userSetting?.countryId)?.code?.toLowerCase();
        })
      )
      .subscribe();

    super.ngOnInit();
  }

  protected readonly LOCALIZATION_KEYS = LOCALIZATION_KEYS;
}
