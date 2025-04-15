import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { catchError, of, switchMap, take, tap, throwError } from 'rxjs';
import { RouterOutlet } from '@angular/router';
import { generateRandomId } from '@amarty/utils';
import { auth_setUser } from '@amarty/store';
import {
  DictionaryApiClient, ProfileApiClient,
  UserApiClient
} from '@amarty/api';
import {
  DictionaryService,
  LocalizationService,
  SiteSettingsService
} from '@amarty/services';
import { AuthService } from '../../../utils/services/auth.service';
import { HeaderComponent } from '../../common-area/header/header.component';
import { FooterComponent } from '../../common-area/footer/footer.component';
import { SpinnerComponent } from '../../common-area/spinner/spinner.component';
import {SiteSettingsResponse, UserProfileResponse, UserResponse} from '@amarty/models';
import {profile_setProfile} from '@amarty/store';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    SpinnerComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  host: { 'data-id': generateRandomId(12) }
})
export class AppComponent implements OnInit {
  constructor(
    private readonly userApiClient: UserApiClient,
    private readonly profileApiClient: ProfileApiClient,
    private readonly dictionaryApiService: DictionaryApiClient,
    private readonly authService: AuthService,
    private readonly localizationService: LocalizationService,
    private readonly siteSettingsService: SiteSettingsService,
    private readonly dictionaryService: DictionaryService,
    private readonly store: Store,
  ) {
  }

  ngOnInit(): void {
    this.authService.initialize();
    this.dictionaryService.initialize();
    this.localizationService.initialize();

    this.authService.isAuthorized$?.pipe(
      switchMap(isAuthorized => isAuthorized
        ? this.userApiClient.user_Current()
        : of(undefined)),
      switchMap((user: UserResponse | undefined) => {
        if (!!user) {
          this.store.dispatch(auth_setUser({ user }));
          this.localizationService.userLocaleChanged(user);
        }
        return !!user ? this.profileApiClient.profile_CurrentUserProfile() : of(undefined);
      }),
      tap((userProfile: UserProfileResponse | undefined) => {
        if (!!userProfile) {
          this.store.dispatch(profile_setProfile({ profile: userProfile }));
        }
      }),
      catchError((error: any) => {
        this.localizationService.handleApiError(error);
        return throwError(() => error);
      })
    ).subscribe();

    this.dictionaryApiService.localization_DictionaryVersion()
      .pipe(
        take(1),
        tap((result: SiteSettingsResponse) => {
          this.siteSettingsService.siteSettings = result;
        }),
        catchError((error: any) => {
          this.localizationService.handleApiError(error);
          return throwError(() => error);
        })
      ).subscribe();
  }
}
