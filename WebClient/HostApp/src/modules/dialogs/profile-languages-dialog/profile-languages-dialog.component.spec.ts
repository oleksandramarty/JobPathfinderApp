import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Observable, of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { ApolloQueryResult } from '@apollo/client/core';

import { ProfileLanguagesDialogComponent } from './profile-languages-dialog.component';
import { DictionaryService, LocalizationService } from '@amarty/services';
import { GraphQlProfileService } from '../../../utils/api/services/graph-ql-profile.service';
import { ProfileFormFactory } from '../../profile-area/utils/form-renderer/profile-form.factory';
import { InputForm, UserLanguageResponse, DataItem, BaseIdEntityOfGuid, BaseBoolResponse } from '@amarty/models';
import { ProfileUserGenericProfileItem } from '../../profile-area/utils/profile-user-generic-profile-item';

// Mock ProfileFormFactory
class MockProfileFormFactory {
  static createLanguageForm = jest.fn();
}

describe('ProfileLanguagesDialogComponent', () => {
  let component: ProfileLanguagesDialogComponent;
  let fixture: ComponentFixture<ProfileLanguagesDialogComponent>;

  let mockDialogRef: Partial<MatDialogRef<ProfileLanguagesDialogComponent>>;
  let mockDialogData: { language?: UserLanguageResponse; existingIds?: string[]; };
  let mockSnackBar: Partial<MatSnackBar>;
  let mockLocalizationService: Partial<LocalizationService>;
  let mockDictionaryService: Partial<DictionaryService>;
  let mockGraphQlProfileService: Partial<GraphQlProfileService>;

  const mockLanguageForm = {
    inputFormGroup: new FormGroup({
      languageId: new FormControl(1),
      languageLevelId: new FormControl(2),
    }),
    submitted: false,
  } as InputForm;

  beforeEach(async () => {
    mockDialogRef = { close: jest.fn() };
    mockSnackBar = { open: jest.fn() };
    mockLocalizationService = { handleApiError: jest.fn(), showError: jest.fn() };
    mockDictionaryService = {
      languageLevelDataItems: [{id: 'lvl1', name: 'Native'} as DataItem],
      languageDataItems: [{id: 'lang1', name: 'English'} as DataItem],
    };
    mockGraphQlProfileService = {
      createUserLanguage: jest.fn().mockReturnValue(of({ data: { profile_create_user_language: { id: 'new-lang-id' } } } as ApolloQueryResult<{ profile_create_user_language: BaseIdEntityOfGuid | undefined }>)),
      updateUserLanguage: jest.fn().mockReturnValue(of({ data: { profile_update_user_language: { success: true } } } as ApolloQueryResult<{ profile_update_user_language: BaseBoolResponse | undefined }>)),
    };

    MockProfileFormFactory.createLanguageForm.mockReturnValue(mockLanguageForm);
    mockDialogData = { existingIds: [] }; // Default for create mode

    await TestBed.configureTestingModule({
      imports: [
        ProfileLanguagesDialogComponent, 
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: LocalizationService, useValue: mockLocalizationService },
        { provide: DictionaryService, useValue: mockDictionaryService },
        { provide: GraphQlProfileService, useValue: mockGraphQlProfileService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    // Spy on buildForm *before* component creation if it's called in constructor
    const buildFormSpy = jest.spyOn(ProfileLanguagesDialogComponent.prototype as any, 'buildForm');
    fixture = TestBed.createComponent(ProfileLanguagesDialogComponent);
    component = fixture.componentInstance;
    (ProfileFormFactory as any).createLanguageForm = MockProfileFormFactory.createLanguageForm;
    buildFormSpy.mockRestore(); // Restore after constructor check if needed, or check calls on instance spy
                                // For this component, buildForm is called in constructor.
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create and set properties from MAT_DIALOG_DATA, and call buildForm in constructor', () => {
    // buildForm is called in constructor, so ProfileFormFactory.createLanguageForm should be called
    expect(ProfileFormFactory.createLanguageForm).toHaveBeenCalled();
    expect(component).toBeTruthy();
    expect(component.genericItem).toBeUndefined(); 
    expect(component.existingIds).toEqual([]);
  });

  describe('buildForm (called in constructor, can be called again if needed)', () => {
    it('should call ProfileFormFactory.createLanguageForm with correct args and setup onExistingIdValueChange', () => {
      const onExistingIdSpy = jest.spyOn(component as any, 'onExistingIdValueChange');
      // buildForm is called by constructor. To test it isolated, call again or check constructor's call.
      // Since it's already called, we check the result of that first call.
      expect(ProfileFormFactory.createLanguageForm).toHaveBeenCalledWith(
        expect.any(Function), 
        expect.any(Function), 
        component.genericItem,
        component.languages,
        component.languageLevels
      );
      expect(component.renderForm).toBe(mockLanguageForm);
      expect(onExistingIdSpy).toHaveBeenCalledWith('languageId');
      onExistingIdSpy.mockRestore();
    });
    
    it('onCancel callback from factory should close dialog with false', () => {
        // Assuming buildForm was called in constructor and set up the form
        const onCancelCallback = (ProfileFormFactory.createLanguageForm as jest.Mock).mock.calls[0][1];
        onCancelCallback();
        expect(mockDialogRef.close).toHaveBeenCalledWith(false);
    });

    it('onSubmit callback from factory should call component.submitForm (from base class)', () => {
        const submitFormSpy = jest.spyOn(component, 'submitForm');
        // Assuming buildForm was called in constructor
        const onSubmitFactoryCallback = (ProfileFormFactory.createLanguageForm as jest.Mock).mock.calls[0][0];
        onSubmitFactoryCallback();
        expect(submitFormSpy).toHaveBeenCalled();
        submitFormSpy.mockRestore();
    });
  });

  describe('userProfileGenericInput', () => {
    it('should transform form values correctly (numbers for IDs)', () => {
      component.renderForm = mockLanguageForm; 
      const input = component['userProfileGenericInput']();
      expect(input.languageId).toBe(1);
      expect(input.languageLevelId).toBe(2);
    });
  });

  describe('GraphQL Mutations (via inherited submitForm)', () => {
    beforeEach(() => {
        component.renderForm = JSON.parse(JSON.stringify(mockLanguageForm)); 
        component.renderForm.inputFormGroup = new FormGroup({
            languageId: new FormControl(1),
            languageLevelId: new FormControl(2),
        });
        component.renderForm.inputFormGroup.setErrors(null); 
    });

    it('submitForm should call createMutation$ (and thus createUserLanguage) in create mode', fakeAsync(() => {
      component.genericItem = undefined; 
      const createMutationSpy = jest.spyOn(component as any, 'createMutation$').mockReturnValue(of({ data: { profile_create_user_language: { id: 'new-id' } } }));
      
      component.submitForm(); // This is inherited
      tick(); 

      expect(createMutationSpy).toHaveBeenCalled();
      expect(mockGraphQlProfileService.createUserLanguage).toHaveBeenCalledWith(component['userProfileGenericInput']());
      expect(mockDialogRef.close).toHaveBeenCalledWith('new-id');
      createMutationSpy.mockRestore();
    }));
    
    it('submitForm should call updateMutation$ (and thus updateUserLanguage) in edit mode', fakeAsync(() => {
      component.genericItem = { id: 'lang-to-update', languageId: 1, level: 'A1' }; 
      const updateMutationSpy = jest.spyOn(component as any, 'updateMutation$').mockReturnValue(of({ data: { profile_update_user_language: { success: true } } }));

      component.submitForm(); // This is inherited
      tick();

      expect(updateMutationSpy).toHaveBeenCalled();
      expect(mockGraphQlProfileService.updateUserLanguage).toHaveBeenCalledWith('lang-to-update', component['userProfileGenericInput']());
      expect(mockDialogRef.close).toHaveBeenCalledWith(true);
      updateMutationSpy.mockRestore();
    }));
  });
  
  describe('Dictionary Data Getters', () => {
    it('languageLevels getter should return dictionaryService.languageLevelDataItems', () => {
        expect(component.languageLevels).toEqual(mockDictionaryService.languageLevelDataItems);
    });
    it('languages getter should return dictionaryService.languageDataItems', () => {
        expect(component.languages).toEqual(mockDictionaryService.languageDataItems);
    });
  });
  
  it('should call super.ngOnDestroy', () => {
    const baseNgOnDestroySpy = jest.spyOn(ProfileUserGenericProfileItem.prototype, 'ngOnDestroy');
    component.ngOnDestroy();
    expect(baseNgOnDestroySpy).toHaveBeenCalled();
  });
});
