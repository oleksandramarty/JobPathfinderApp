import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { catchError, filter, switchMap, takeUntil, tap, throwError } from 'rxjs';
import { BaseUnsubscribeComponent } from '@amarty/common';
import {
  UserProfileItemEnum,
  UserProfileResponse,
  UserResponse,
} from '@amarty/models';
import { DictionaryService, LocalizationService } from '@amarty/services';
import { ProfileInfoComponent } from './profile-info/profile-info.component';
import { ProfileSkillsComponent } from './profile-skills/profile-skills.component';
import { ProfileLanguagesComponent } from './profile-languages/profile-languages.component';
import { ProfileItemComponent } from './profile-item/profile-item.component';
import { LOCALIZATION_KEYS } from '@amarty/localizations';
import { Store } from '@ngrx/store';
import { selectProfile, selectUser } from '@amarty/store';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { GraphQlAuthService } from '../../utils/api/services/graph-ql-auth.service';
import { GraphQlProfileService } from '../../utils/api/services/graph-ql-profile.service';

@Component({
  selector: 'app-profile-area',
  imports: [
    CommonModule,
    RouterModule,

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
  public user: UserResponse | undefined;
  public userProfile: UserProfileResponse | undefined;
  public countryCode: string | undefined;
  public isCurrentUser: boolean | undefined;

  public profileItemEnum = UserProfileItemEnum;

  constructor(
    private readonly graphQlAuthService: GraphQlAuthService,
    private readonly graphQlProfileService: GraphQlProfileService,
    private readonly dictionaryService: DictionaryService,
    private readonly localizationService: LocalizationService,
    private readonly store: Store,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {
    super();
  }

  override ngOnInit(): void {
    this.store.select(selectUser)
      .pipe(
        filter(user => !!user),
        takeUntil(this.ngUnsubscribe),
        switchMap(data => {
          this.currentUser = data;

          return this.route.paramMap;
        }),
        tap(params => {
          const login = params.get('login');
          this.isCurrentUser = this.currentUser?.login === login;
          if (this.isCurrentUser) {
            this.user = this.currentUser;
            this.countryCode = this.dictionaryService.countryData?.find(item => item.id === this.user?.userSetting?.countryId)?.code?.toLowerCase();
            this._getCurrentUserProfile();
          } else {
            this._getUserByLogin(login ?? '');
          }
        })
      ).subscribe();

    this.route.paramMap.subscribe(params => {

    });

    super.ngOnInit();
  }

  private _getCurrentUserProfile(): void {
    this.store.select(selectProfile)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        tap(data => {
          this.userProfile = data;
        })
      ).subscribe();
  }

  private _getUserByLogin(login: string): void {
    this.graphQlAuthService.userByLogin(login)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        switchMap(result => {
          this.user = result.data.user_info_by_login;
          this.countryCode = this.dictionaryService.countryData?.find(item => item.id === this.user?.userSetting?.countryId)?.code?.toLowerCase();
          return this.graphQlProfileService.userProfileById(this.user!.id!);
        }),
        tap((result) => {
          this.userProfile = result.data.profile_user_profile_by_id;
        }),
        catchError((error: any) => {
          this.localizationService.handleApiError(error);
          return throwError(() => error);
        })
      ).subscribe();
  }

  protected readonly LOCALIZATION_KEYS = LOCALIZATION_KEYS;
}
