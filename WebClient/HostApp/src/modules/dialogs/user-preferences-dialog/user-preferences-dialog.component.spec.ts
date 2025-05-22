import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Observable, of, throwError } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { ApolloQueryResult } from '@apollo/client/core';

import { UserPreferencesDialogComponent } from './user-preferences-dialog.component';
import { DictionaryService, LocalizationService } from '@amarty/services';
import { GraphQlAuthService } from '../../../utils/api/services/graph-ql-auth.service';
import { ProfileFormFactory } from '../../profile-area/utils/form-renderer/profile-form.factory';
import { InputForm, UserResponse, DataItem, BaseBoolResponse } from '@amarty/models';
import { LOCALIZATION_KEYS } from '@amarty/localizations';

// Mock ProfileFormFactory
class MockProfileFormFactory {
  static createUserPreferencesForm = jest.fn();
}

describe('UserPreferencesDialogComponent', () => {
  let component: UserPreferencesDialogComponent;
  let fixture: ComponentFixture<UserPreferencesDialogComponent>;

  let mockDialogRef: Partial<MatDialogRef<UserPreferencesDialogComponent>>;
  let mockDialogData: { user?: UserResponse; };
  let mockSnackBar: Partial<MatSnackBar>;
  let mockDictionaryService: Partial<DictionaryService>;
  let mockLocalizationService: Partial<LocalizationService>;
  let mockGraphQlAuthService: Partial<GraphQlAuthService>;

  const testUser: UserResponse = { 
    id: 'user1', 
    login: 'test', 
    email: 'test@example.com', 
    userSetting: { defaultLocale: 'en', applicationAiPrompt: true, currencyId: 20, countryId: 10, timeZone: 120 } 
  };

  const mockPreferencesForm = {
    inputFormGroup: new FormGroup({
      login: new FormControl(testUser.login),
      headline: new FormControl('Test Headline'),
      phone: new FormControl('12345'),
      firstName: new FormControl('Test'),
      lastName: new FormControl('User'),
      defaultLocale: new FormControl(1), // Assuming ID 1 maps to 'en'
      timeZone: new FormControl(120),
      countryId: new FormControl(10),
      currencyId: new FormControl(20),
      applicationAiPrompt: new FormControl(true),
      linkedInUrl: new FormControl('linkedin.com/test'),
      npmUrl: new FormControl('npmjs.com/test'),
      gitHubUrl: new FormControl('github.com/test'),
      portfolioUrl: new FormControl('test.com'),
      showCurrentPosition: new FormControl(true),
      showHighestEducation: new FormControl(false),
    }),
    submitted: false,
  } as InputForm;

  beforeEach(async () => {
    mockDialogRef = { close: jest.fn() };
    mockSnackBar = { open: jest.fn() };
    mockDictionaryService = {
      countryDataItems: [{id: '10', name: 'Country Test'} as DataItem],
      currencyDataItems: [{id: '20', name: 'CUR'} as DataItem],
      localeDataItems: [{id: '1', name: 'English', isoCode: 'en'} as DataItem],
      localeData: [{id: 1, isoCode: 'en', name: 'English', flag: 'gb'} as any], 
    };
    mockLocalizationService = { handleApiError: jest.fn() };
    mockGraphQlAuthService = {
      updateUserPreferences: jest.fn().mockReturnValue(of({ data: { user_update_preference: { success: true } } } as ApolloQueryResult<BaseBoolResponse>)),
    };

    MockProfileFormFactory.createUserPreferencesForm.mockReturnValue(mockPreferencesForm);
    mockDialogData = { user: testUser };

    await TestBed.configureTestingModule({
      imports: [
        UserPreferencesDialogComponent, 
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: DictionaryService, useValue: mockDictionaryService },
        { provide: LocalizationService, useValue: mockLocalizationService },
        { provide: GraphQlAuthService, useValue: mockGraphQlAuthService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    const buildFormSpy = jest.spyOn(UserPreferencesDialogComponent.prototype as any, '_buildForm');
    fixture = TestBed.createComponent(UserPreferencesDialogComponent);
    component = fixture.componentInstance;
    (ProfileFormFactory as any).createUserPreferencesForm = MockProfileFormFactory.createUserPreferencesForm;
    buildFormSpy.mockRestore(); 
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create, set user from MAT_DIALOG_DATA, and call _buildForm in constructor', () => {
    const buildFormSpy = jest.spyOn(UserPreferencesDialogComponent.prototype as any, '_buildForm');
    const tempFixture = TestBed.createComponent(UserPreferencesDialogComponent); 
    expect(buildFormSpy).toHaveBeenCalledWith(testUser); 
    buildFormSpy.mockRestore();

    expect(tempFixture.componentInstance).toBeTruthy();
    expect(tempFixture.componentInstance.user).toEqual(testUser);
  });

  describe('_buildForm', () => {
    it('should calculate defaultLocaleId and call ProfileFormFactory.createUserPreferencesForm', () => {
      MockProfileFormFactory.createUserPreferencesForm.mockClear();
      component['_buildForm'](testUser); 

      const expectedDefaultLocaleId = mockDictionaryService.localeData?.find(
        item => item.isoCode === (testUser.userSetting?.defaultLocale ?? 'en')
      )?.id ?? 1;
      
      expect(ProfileFormFactory.createUserPreferencesForm).toHaveBeenCalledWith(
        expectedDefaultLocaleId,
        testUser,
        component.locales,
        component.countries,
        component.currencies,
        expect.any(Function), 
        expect.any(Function)  
      );
      expect(component.renderForm).toBe(mockPreferencesForm);
    });
    
    it('onCancel callback from factory should close dialog with false', () => {
        MockProfileFormFactory.createUserPreferencesForm.mockClear();
        component['_buildForm'](testUser);
        const onCancelCallback = (ProfileFormFactory.createUserPreferencesForm as jest.Mock).mock.calls[0][6];
        onCancelCallback();
        expect(mockDialogRef.close).toHaveBeenCalledWith(false);
    });

    it('onSubmit callback from factory should call component.onApplicationSubmit', () => {
        const onSubmitSpy = jest.spyOn(component, 'onApplicationSubmit');
        MockProfileFormFactory.createUserPreferencesForm.mockClear();
        component['_buildForm'](testUser);
        const onSubmitFactoryCallback = (ProfileFormFactory.createUserPreferencesForm as jest.Mock).mock.calls[0][5];
        onSubmitFactoryCallback();
        expect(onSubmitSpy).toHaveBeenCalled();
        onSubmitSpy.mockRestore();
    });
  });

  describe('onApplicationSubmit', () => {
    beforeEach(() => {
      component.user = testUser; 
      component['_buildForm'](testUser); 
      component.renderForm = JSON.parse(JSON.stringify(mockPreferencesForm)); // Deep copy
      component.renderForm.inputFormGroup = new FormGroup({ // Recreate FormGroup
        login: new FormControl(testUser.login),
        headline: new FormControl('Test Headline'),
        phone: new FormControl('12345'),
        firstName: new FormControl('Test'),
        lastName: new FormControl('User'),
        defaultLocale: new FormControl(1),
        timeZone: new FormControl(120),
        countryId: new FormControl(10),
        currencyId: new FormControl(20),
        applicationAiPrompt: new FormControl(true),
        linkedInUrl: new FormControl('linkedin.com/test'),
        npmUrl: new FormControl('npmjs.com/test'),
        gitHubUrl: new FormControl('github.com/test'),
        portfolioUrl: new FormControl('test.com'),
        showCurrentPosition: new FormControl(true),
        showHighestEducation: new FormControl(false),
      });
      component.renderForm.inputFormGroup.setErrors(null); 
      component.submitted = false;
    });

    it('should set submitted to true', () => {
      component.onApplicationSubmit();
      expect(component.submitted).toBe(true);
    });

    it('should show snackbar and not call service if form is invalid', () => {
      component.renderForm!.inputFormGroup.setErrors({ 'error': true }); 
      component.onApplicationSubmit();
      expect(mockSnackBar.open).toHaveBeenCalledWith(
        LOCALIZATION_KEYS.COMMON.FIX_ERROR_BEFORE_CONTINUE,
        LOCALIZATION_KEYS.COMMON.BUTTON.OK,
        expect.any(Object)
      );
      expect(mockGraphQlAuthService.updateUserPreferences).not.toHaveBeenCalled();
    });
    
    it('should close dialog with false if user is undefined (edge case)', () => {
      component.user = undefined;
      component.onApplicationSubmit();
      expect(mockDialogRef.close).toHaveBeenCalledWith(false);
      expect(mockGraphQlAuthService.updateUserPreferences).not.toHaveBeenCalled();
    });

    it('should call graphQlAuthService.updateUserPreferences with transformed data and close dialog on success', fakeAsync(() => {
      component.onApplicationSubmit();
      tick(); 

      const formVal = component.renderForm!.inputFormGroup.value;
      expect(mockGraphQlAuthService.updateUserPreferences).toHaveBeenCalledWith({
        login: formVal.login,
        headline: formVal.headline,
        phone: formVal.phone,
        firstName: formVal.firstName,
        lastName: formVal.lastName,
        defaultLocale: 'en', 
        timeZone: Number(formVal.timeZone),
        countryId: Number(formVal.countryId),
        currencyId: Number(formVal.currencyId),
        applicationAiPrompt: formVal.applicationAiPrompt,
        linkedInUrl: formVal.linkedInUrl,
        npmUrl: formVal.npmUrl,
        gitHubUrl: formVal.gitHubUrl,
        portfolioUrl: formVal.portfolioUrl,
        showCurrentPosition: formVal.showCurrentPosition,
        showHighestEducation: formVal.showHighestEducation,
      });
      expect(mockDialogRef.close).toHaveBeenCalledWith(true);
    }));

    it('should handle error from updateUserPreferences and not close dialog with true', fakeAsync(() => {
      const error = new Error('Update failed');
      (mockGraphQlAuthService.updateUserPreferences as jest.Mock).mockReturnValue(throwError(() => error));
      
      component.onApplicationSubmit();
      tick();

      expect(mockLocalizationService.handleApiError).toHaveBeenCalledWith(error);
      expect(mockDialogRef.close).not.toHaveBeenCalledWith(true);
    }));
  });
  
  describe('Dictionary Data Getters', () => {
    it('countries getter', () => expect(component.countries).toEqual(mockDictionaryService.countryDataItems));
    it('currencies getter', () => expect(component.currencies).toEqual(mockDictionaryService.currencyDataItems));
    it('locales getter', () => expect(component.locales).toEqual(mockDictionaryService.localeDataItems));
  });
  
  it('should unsubscribe on destroy', () => {
    const ngUnsubscribeNextSpy = jest.spyOn(component.ngUnsubscribe, 'next');
    const ngUnsubscribeCompleteSpy = jest.spyOn(component.ngUnsubscribe, 'complete');
    
    component.ngOnDestroy();
    
    expect(ngUnsubscribeNextSpy).toHaveBeenCalled();
    expect(ngUnsubscribeCompleteSpy).toHaveBeenCalled();
  });
});
