import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing'; // For router-outlet
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { of, throwError, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { ApolloQueryResult } from '@apollo/client/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'; // To allow unknown elements like app-header

import { AppComponent } from './app.component';
import { AuthService } from '../../../utils/services/auth.service';
import { DictionaryApiClient } from '@amarty/api';
import {
  DictionaryService,
  LocalizationService,
  SiteSettingsService,
} from '@amarty/services';
import { GraphQlAuthService } from '../../../utils/api/services/graph-ql-auth.service';
import { GraphQlProfileService } from '../../../utils/api/services/graph-ql-profile.service';
import { UserResponse, UserProfileResponse, SiteSettingsResponse } from '@amarty/models';
import { auth_setUser, profile_setProfile } from '@amarty/store';

// Keep Jasmine spies for existing mocks for minimal changes to original file, or convert all to Jest
describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  let mockAuthService: Partial<AuthService>;
  let mockLocalizationService: Partial<LocalizationService>;
  let mockDictionaryApiService: Partial<DictionaryApiClient>;
  let mockSiteSettingsService: Partial<SiteSettingsService>;
  let mockDictionaryService: Partial<DictionaryService>;
  let mockStore: Partial<Store>;
  let mockGraphQlAuthService: Partial<GraphQlAuthService>;
  let mockGraphQlProfileService: Partial<GraphQlProfileService>;
  let mockSnackBar: Partial<MatSnackBar>;

  // Subjects to control observable emissions for some mocks
  const isAuthorizedSubject = new Subject<boolean>();


  beforeEach(async () => {
    mockAuthService = {
      initialize: jest.fn(),
      isAuthorized$: isAuthorizedSubject.asObservable(), // Use subject for dynamic control
    };

    mockLocalizationService = {
      initialize: jest.fn(),
      userLocaleChanged: jest.fn(),
      handleApiError: jest.fn(),
    };

    mockDictionaryApiService = {
      localization_DictionaryVersion: jest.fn().mockReturnValue(of({ version: '1.0' } as SiteSettingsResponse)),
    };

    mockSiteSettingsService = {
      siteSettings: undefined, // Initial state
    };

    mockDictionaryService = {
      initialize: jest.fn(),
    };

    mockStore = {
      dispatch: jest.fn(),
    };

    mockGraphQlAuthService = {
      currentUser: jest.fn().mockReturnValue(of({ data: { auth_gateway_current_user: { id: 'user1' } as UserResponse } } as ApolloQueryResult<{ auth_gateway_current_user: UserResponse | undefined; }>)),
    };

    mockGraphQlProfileService = {
      currentUserProfile: jest.fn().mockReturnValue(of({ data: { profile_current_user_profile: { userId: 'user1' } as UserProfileResponse } } as ApolloQueryResult<{ profile_current_user_profile: UserProfileResponse | undefined; }>)),
    };
    
    mockSnackBar = { // MatSnackBar is used by AppComponent indirectly via LocalizationService typically, but directly in some templates
        open: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [
        AppComponent, // AppComponent is standalone
        RouterTestingModule, // For router-outlet
        MatSnackBarModule, // AppComponent uses MatSnackBar, ensure it's available or mocked
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: LocalizationService, useValue: mockLocalizationService },
        { provide: DictionaryApiClient, useValue: mockDictionaryApiService },
        { provide: SiteSettingsService, useValue: mockSiteSettingsService },
        { provide: DictionaryService, useValue: mockDictionaryService },
        { provide: Store, useValue: mockStore },
        { provide: GraphQlAuthService, useValue: mockGraphQlAuthService },
        { provide: GraphQlProfileService, useValue: mockGraphQlProfileService },
        { provide: MatSnackBar, useValue: mockSnackBar } // Providing the mock
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // Add if app-header, app-footer, app-spinner are not imported/declared
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges(); // ngOnInit is called here. Moved to individual tests for more control.
  });

  it('should create the component and inject dependencies (original test adapted)', () => {
    fixture.detectChanges(); // ngOnInit
    expect(component).toBeTruthy();
    expect(mockAuthService.initialize).toHaveBeenCalled(); // Behavioral check
  });

  it('should initialize services on ngOnInit', () => {
    fixture.detectChanges(); // ngOnInit
    expect(mockAuthService.initialize).toHaveBeenCalled();
    expect(mockDictionaryService.initialize).toHaveBeenCalled();
    expect(mockLocalizationService.initialize).toHaveBeenCalled();
  });

  describe('ngOnInit - User and Profile Loading Logic', () => {
    it('should fetch current user and profile if authorized', fakeAsync(() => {
      fixture.detectChanges(); // Call ngOnInit

      isAuthorizedSubject.next(true); // Emit true for isAuthorized$
      tick(); // Process observables

      expect(mockGraphQlAuthService.currentUser).toHaveBeenCalled();
      expect(mockStore.dispatch).toHaveBeenCalledWith(auth_setUser({ user: { id: 'user1' } as UserResponse }));
      expect(mockLocalizationService.userLocaleChanged).toHaveBeenCalledWith({ id: 'user1' } as UserResponse);
      expect(mockGraphQlProfileService.currentUserProfile).toHaveBeenCalled();
      expect(mockStore.dispatch).toHaveBeenCalledWith(profile_setProfile({ profile: { userId: 'user1' } as UserProfileResponse }));
    }));

    it('should NOT attempt to fetch user/profile if not authorized', fakeAsync(() => {
      fixture.detectChanges(); // ngOnInit

      isAuthorizedSubject.next(false); // Emit false for isAuthorized$
      tick();

      expect(mockGraphQlAuthService.currentUser).not.toHaveBeenCalled();
      expect(mockGraphQlProfileService.currentUserProfile).not.toHaveBeenCalled();
      expect(mockStore.dispatch).not.toHaveBeenCalledWith(expect.objectContaining({ type: auth_setUser.type }));
      expect(mockStore.dispatch).not.toHaveBeenCalledWith(expect.objectContaining({ type: profile_setProfile.type }));
    }));
    
    it('should handle error from currentUser gracefully', fakeAsync(() => {
        (mockGraphQlAuthService.currentUser as jest.Mock).mockReturnValue(throwError(() => new Error('Auth Error')));
        fixture.detectChanges(); // ngOnInit
        isAuthorizedSubject.next(true);
        tick();

        expect(mockLocalizationService.handleApiError).toHaveBeenCalledWith(expect.any(Error));
        expect(mockStore.dispatch).not.toHaveBeenCalledWith(expect.objectContaining({ type: auth_setUser.type }));
    }));

    it('should handle error from currentUserProfile gracefully', fakeAsync(() => {
        (mockGraphQlProfileService.currentUserProfile as jest.Mock).mockReturnValue(throwError(() => new Error('Profile Error')));
        fixture.detectChanges(); // ngOnInit
        isAuthorizedSubject.next(true); // Assume previous steps in chain succeeded
        tick();
        
        expect(mockLocalizationService.handleApiError).toHaveBeenCalledWith(expect.any(Error));
        expect(mockStore.dispatch).not.toHaveBeenCalledWith(expect.objectContaining({ type: profile_setProfile.type }));
    }));
  });

  describe('ngOnInit - Dictionary Version Loading', () => {
    it('should fetch dictionary version and set siteSettings', fakeAsync(() => {
      const mockSiteSettings = { version: '1.1', someOtherProp: 'value' } as unknown as SiteSettingsResponse;
      (mockDictionaryApiService.localization_DictionaryVersion as jest.Mock).mockReturnValue(of(mockSiteSettings));
      
      fixture.detectChanges(); // ngOnInit
      tick(); // Process the observable from localization_DictionaryVersion

      expect(mockDictionaryApiService.localization_DictionaryVersion).toHaveBeenCalled();
      expect(mockSiteSettingsService.siteSettings).toEqual(mockSiteSettings);
    }));

    it('should handle error from localization_DictionaryVersion gracefully', fakeAsync(() => {
      (mockDictionaryApiService.localization_DictionaryVersion as jest.Mock).mockReturnValue(throwError(() => new Error('Dictionary Error')));
      fixture.detectChanges(); // ngOnInit
      tick(); // Process the observable

      expect(mockLocalizationService.handleApiError).toHaveBeenCalledWith(expect.any(Error));
    }));
  });
  
  describe('Template Structure', () => {
    beforeEach(() => {
        fixture.detectChanges(); // Ensure ngOnInit and template rendering
    });

    it('should render app-header', () => {
      const header = fixture.nativeElement.querySelector('app-header');
      expect(header).toBeTruthy();
    });

    it('should render router-outlet', () => {
      const routerOutlet = fixture.nativeElement.querySelector('router-outlet');
      expect(routerOutlet).toBeTruthy();
    });

    it('should render app-footer', () => {
      const footer = fixture.nativeElement.querySelector('app-footer');
      expect(footer).toBeTruthy();
    });
    
    it('should render app-spinner', () => {
      const spinner = fixture.nativeElement.querySelector('app-spinner');
      expect(spinner).toBeTruthy();
    });
  });
});
