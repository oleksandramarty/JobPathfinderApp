import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { ActivatedRoute, Router,convertToParamMap } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, Subject, throwError } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { ProfileAreaComponent } from './profile-area.component';
import { DictionaryService, LocalizationService, CommonDialogService } from '@amarty/services';
import { GraphQlAuthService } from '../../utils/api/services/graph-ql-auth.service';
import { GraphQlProfileService } from '../../utils/api/services/graph-ql-profile.service';
import { selectProfile, selectUser } from '@amarty/store';
import { UserResponse, UserProfileResponse, DataItem, UserProfileItemEnum } from '@amarty/models'; 
import { mockUserResponse } from '../../test/mock/user.mock'; 
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ProfileAreaComponent', () => {
  let component: ProfileAreaComponent;
  let fixture: ComponentFixture<ProfileAreaComponent>;
  let store: MockStore;
  let mockDictionaryService: Partial<DictionaryService>;
  let mockLocalizationService: Partial<LocalizationService>;
  let mockGraphQlAuthService: Partial<GraphQlAuthService>;
  let mockGraphQlProfileService: Partial<GraphQlProfileService>;
  let mockActivatedRoute: Partial<ActivatedRoute>;
  
  const currentTestUser: UserResponse = { ...mockUserResponse, login: 'currentUserLogin', id:'currentUserGUID', userSetting: { countryId: 1 } };
  const otherTestUser: UserResponse = { id: 'otherUserGUID', login: 'otherUserLogin', email: '', userSetting: { countryId: 2 } };
  const testUserProfile: UserProfileResponse = { id: 'up1', userId: currentTestUser.id!, items: [] };
  const otherTestUserProfile: UserProfileResponse = { id: 'up2', userId: otherTestUser.id!, items: [] };

  const mockCountryData: DataItem[] = [
    { id: '1', name: 'Testland', code: 'TL' },
    { id: '2', name: 'Otherland', code: 'OL' },
  ];
  
  let paramMapSubject: Subject<any>;


  beforeEach(async () => {
    paramMapSubject = new Subject<any>();
    mockDictionaryService = {
      countryData: mockCountryData,
    };
    mockLocalizationService = { handleApiError: jest.fn() };
    mockGraphQlAuthService = {
      userByLogin: jest.fn().mockReturnValue(of({ data: { user_info_by_login: otherTestUser } })),
    };
    mockGraphQlProfileService = {
      userProfileById: jest.fn().mockReturnValue(of({ data: { profile_user_profile_by_id: otherTestUserProfile } })),
    };
    mockActivatedRoute = {
      paramMap: paramMapSubject.asObservable(),
    };

    await TestBed.configureTestingModule({
      imports: [
        ProfileAreaComponent, 
        RouterTestingModule, 
        NoopAnimationsModule,
      ],
      providers: [
        provideMockStore({
          initialState: { auth: { user: currentTestUser }, profile: { currentProfile: testUserProfile } }, 
          selectors: [
            { selector: selectUser, value: currentTestUser },
            { selector: selectProfile, value: testUserProfile }, 
          ],
        }),
        { provide: DictionaryService, useValue: mockDictionaryService },
        { provide: LocalizationService, useValue: mockLocalizationService },
        { provide: GraphQlAuthService, useValue: mockGraphQlAuthService },
        { provide: GraphQlProfileService, useValue: mockGraphQlProfileService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: CommonDialogService, useValue: {} }, 
        { provide: MatSnackBar, useValue: { open: jest.fn() } }, 
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA], 
    }).compileComponents();

    store = TestBed.inject(Store) as MockStore;
    fixture = TestBed.createComponent(ProfileAreaComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    fixture.detectChanges(); 
    paramMapSubject.next(convertToParamMap({ login: 'anyLogin' })); 
    fixture.detectChanges(); 
    expect(component).toBeTruthy();
  });

  describe('ngOnInit - Profile Loading Logic', () => {
    it('should load current user\'s data and profile if route login matches currentUser login', fakeAsync(() => {
      fixture.detectChanges(); 
      paramMapSubject.next(convertToParamMap({ login: currentTestUser.login }));
      tick(); 
      fixture.detectChanges(); 

      expect(component.currentUser).toEqual(currentTestUser);
      expect(component.isCurrentUser).toBe(true);
      expect(component.user).toEqual(currentTestUser);
      expect(component.countryCode).toBe(mockCountryData.find(c => c.id === String(currentTestUser.userSetting?.countryId))?.code?.toLowerCase());
      expect(component.userProfile).toEqual(testUserProfile); 
      expect(mockGraphQlAuthService.userByLogin).not.toHaveBeenCalled();
    }));

    it('should load other user\'s data and profile if route login does not match', fakeAsync(() => {
      fixture.detectChanges();
      paramMapSubject.next(convertToParamMap({ login: otherTestUser.login! }));
      tick();
      fixture.detectChanges();

      expect(component.isCurrentUser).toBe(false);
      expect(mockGraphQlAuthService.userByLogin).toHaveBeenCalledWith(otherTestUser.login!);
      expect(component.user).toEqual(otherTestUser);
      expect(component.countryCode).toBe(mockCountryData.find(c => c.id === String(otherTestUser.userSetting?.countryId))?.code?.toLowerCase());
      expect(mockGraphQlProfileService.userProfileById).toHaveBeenCalledWith(otherTestUser.id!);
      expect(component.userProfile).toEqual(otherTestUserProfile);
    }));
    
    it('should handle error when fetching other user data via _getUserByLogin', fakeAsync(() => {
      const error = new Error('Failed to fetch user');
      (mockGraphQlAuthService.userByLogin as jest.Mock).mockReturnValue(throwError(() => error));
      
      fixture.detectChanges();
      paramMapSubject.next(convertToParamMap({ login: 'anotherUser' }));
      tick();
      fixture.detectChanges();

      expect(mockLocalizationService.handleApiError).toHaveBeenCalledWith(error);
    }));
    
    it('should handle error when fetching other user profile via _getUserByLogin', fakeAsync(() => {
      const error = new Error('Failed to fetch profile');
      (mockGraphQlProfileService.userProfileById as jest.Mock).mockReturnValue(throwError(() => error));
      
      fixture.detectChanges();
      paramMapSubject.next(convertToParamMap({ login: otherTestUser.login! })); 
      tick();
      fixture.detectChanges();

      expect(mockLocalizationService.handleApiError).toHaveBeenCalledWith(error);
    }));
    
    it('should filter out null/undefined users from selectUser before proceeding', fakeAsync(() => {
        store.overrideSelector(selectUser, undefined); 
        store.refreshState();
        
        fixture.detectChanges(); 
        paramMapSubject.next(convertToParamMap({ login: 'anyLogin' }));
        tick();

        expect(component.currentUser).toBeUndefined(); 
        expect(component.isCurrentUser).toBeUndefined(); 
        expect(mockGraphQlAuthService.userByLogin).not.toHaveBeenCalled();
        const getCurrentUserProfileSpy = jest.spyOn(component as any, '_getCurrentUserProfile');
        expect(getCurrentUserProfileSpy).not.toHaveBeenCalled();
    }));

  });
  
  describe('Template Rendering', () => {
    beforeEach(fakeAsync(() => {
        fixture.detectChanges();
        paramMapSubject.next(convertToParamMap({ login: currentTestUser.login }));
        tick();
        fixture.detectChanges();
    }));

    it('should render app-profile-info with correct inputs', () => {
      const profileInfoEl = fixture.nativeElement.querySelector('app-profile-info');
      expect(profileInfoEl).toBeTruthy();
    });

    it('should render app-profile-skills, app-profile-languages, etc. if userProfile exists', () => {
      expect(component.userProfile).toBeDefined(); 
      const skillsEl = fixture.nativeElement.querySelector('app-profile-skills');
      const languagesEl = fixture.nativeElement.querySelector('app-profile-languages');
      const experienceEl = fixture.nativeElement.querySelector('app-profile-item[ng-reflect-item-type="Experience"]'); // Example check
      
      expect(skillsEl).toBeTruthy();
      expect(languagesEl).toBeTruthy();
      expect(experienceEl).toBeTruthy();
    });
  });

  it('should unsubscribe on ngOnDestroy', () => {
    fixture.detectChanges();
    paramMapSubject.next(convertToParamMap({ login: 'anyLogin' }));
    fixture.detectChanges();

    const ngUnsubscribeNextSpy = jest.spyOn(component.ngUnsubscribe, 'next');
    const ngUnsubscribeCompleteSpy = jest.spyOn(component.ngUnsubscribe, 'complete');
    
    component.ngOnDestroy();
    
    expect(ngUnsubscribeNextSpy).toHaveBeenCalled();
    expect(ngUnsubscribeCompleteSpy).toHaveBeenCalled();
  });
});
