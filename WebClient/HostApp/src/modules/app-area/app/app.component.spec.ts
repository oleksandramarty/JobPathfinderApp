import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { provideRouter } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { of } from 'rxjs';

import { AuthService } from '../../../utils/services/auth.service';
import { UserApiClient, DictionaryApiClient } from '@amarty/api';
import {
  DictionaryService,
  LocalizationService,
  SiteSettingsService,
} from '@amarty/services';
import { Store } from '@ngrx/store';

describe('AppComponent', () => {
  let authServiceMock: Partial<AuthService>;
  let userApiClientMock: Partial<UserApiClient>;
  let localizationServiceMock: Partial<LocalizationService>;
  let dictionaryApiServiceMock: Partial<DictionaryApiClient>;
  let siteSettingsServiceMock: Partial<SiteSettingsService>;
  let dictionaryServiceMock: Partial<DictionaryService>;
  let storeMock: Partial<Store>;

  beforeEach(async () => {
    authServiceMock = {
      initialize: jasmine.createSpy('initialize'),
      isAuthorized$: of(false),
    };

    userApiClientMock = {
      user_Current: jasmine.createSpy('user_Current').and.returnValue(of({ id: 1, name: 'Test' })),
    };

    localizationServiceMock = {
      userLocaleChanged: jasmine.createSpy('userLocaleChanged'),
    };

    dictionaryApiServiceMock = {
      localization_DictionaryVersion: jasmine.createSpy('localization_DictionaryVersion').and.returnValue(of({ version: '1.0' })),
    };

    siteSettingsServiceMock = {
      siteSettings: undefined,
    };

    dictionaryServiceMock = {
      initialize: jasmine.createSpy('initialize'),
    };

    storeMock = {
      dispatch: jasmine.createSpy('dispatch'),
    };

    await TestBed.configureTestingModule({
      imports: [MatSnackBarModule, provideRouter([])],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: UserApiClient, useValue: userApiClientMock },
        { provide: LocalizationService, useValue: localizationServiceMock },
        { provide: DictionaryApiClient, useValue: dictionaryApiServiceMock },
        { provide: SiteSettingsService, useValue: siteSettingsServiceMock },
        { provide: DictionaryService, useValue: dictionaryServiceMock },
        { provide: Store, useValue: storeMock },
      ],
    }).compileComponents();
  });

  it('should create the component and inject all dependencies', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;

    expect(component).toBeTruthy();

    // Injection check
    expect((component as any).authService).toBeTruthy();
    expect((component as any).userApiClient).toBeTruthy();
    expect((component as any).localizationService).toBeTruthy();
    expect((component as any).dictionaryApiService).toBeTruthy();
    expect((component as any).siteSettingsService).toBeTruthy();
    expect((component as any).dictionaryService).toBeTruthy();
    expect((component as any).snackBar).toBeTruthy();
    expect((component as any).store).toBeTruthy();
  });
});
