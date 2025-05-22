import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Observable, of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { ApolloQueryResult } from '@apollo/client/core';

import { ProfileSkillsDialogComponent } from './profile-skills-dialog.component';
import { DictionaryService, LocalizationService } from '@amarty/services';
import { GraphQlProfileService } from '../../../utils/api/services/graph-ql-profile.service';
import { ProfileFormFactory } from '../../profile-area/utils/form-renderer/profile-form.factory';
import { InputForm, UserSkillResponse, DataItem, BaseIdEntityOfGuid, BaseBoolResponse } from '@amarty/models';
import { ProfileUserGenericProfileItem } from '../../profile-area/utils/profile-user-generic-profile-item';

// Mock ProfileFormFactory
class MockProfileFormFactory {
  static createSkillForm = jest.fn();
}

describe('ProfileSkillsDialogComponent', () => {
  let component: ProfileSkillsDialogComponent;
  let fixture: ComponentFixture<ProfileSkillsDialogComponent>;

  let mockDialogRef: Partial<MatDialogRef<ProfileSkillsDialogComponent>>;
  let mockDialogData: { skill?: UserSkillResponse; existingIds?: string[]; };
  let mockSnackBar: Partial<MatSnackBar>;
  let mockLocalizationService: Partial<LocalizationService>;
  let mockDictionaryService: Partial<DictionaryService>;
  let mockGraphQlProfileService: Partial<GraphQlProfileService>;

  const mockSkillForm = {
    inputFormGroup: new FormGroup({
      skillId: new FormControl(1),
      skillLevelId: new FormControl(2),
    }),
    submitted: false,
  } as InputForm;

  beforeEach(async () => {
    mockDialogRef = { close: jest.fn() };
    mockSnackBar = { open: jest.fn() };
    mockLocalizationService = { handleApiError: jest.fn(), showError: jest.fn() };
    mockDictionaryService = {
      skillLevelDataItems: [{id: 'slvl1', name: 'Expert'} as DataItem],
      skillDataItems: [{id: 'skill1', name: 'Angular'} as DataItem],
    };
    mockGraphQlProfileService = {
      createUserSkill: jest.fn().mockReturnValue(of({ data: { profile_create_user_skill: { id: 'new-skill-id' } } } as ApolloQueryResult<{ profile_create_user_skill: BaseIdEntityOfGuid | undefined }>)),
      updateUserSkill: jest.fn().mockReturnValue(of({ data: { profile_update_user_skill: { success: true } } } as ApolloQueryResult<{ profile_update_user_skill: BaseBoolResponse | undefined }>)),
    };

    MockProfileFormFactory.createSkillForm.mockReturnValue(mockSkillForm);
    mockDialogData = { existingIds: [] }; 

    await TestBed.configureTestingModule({
      imports: [
        ProfileSkillsDialogComponent, 
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
    
    // Spy on buildForm before component creation as it's called in constructor
    const buildFormSpy = jest.spyOn(ProfileSkillsDialogComponent.prototype as any, 'buildForm');
    fixture = TestBed.createComponent(ProfileSkillsDialogComponent);
    component = fixture.componentInstance;
    (ProfileFormFactory as any).createSkillForm = MockProfileFormFactory.createSkillForm;
    // buildFormSpy is checked in a dedicated test or its effects are checked
    buildFormSpy.mockRestore(); // Restore original for other tests if component is recreated
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create and set properties from MAT_DIALOG_DATA, and call buildForm in constructor', () => {
    // To check constructor call to buildForm, we'd need to spy before creation.
    // For this test, we can assume it's called and check the state.
    // Re-spy for this specific case to verify the constructor call.
    const buildFormSpy = jest.spyOn(ProfileSkillsDialogComponent.prototype as any, 'buildForm');
    const tempFixture = TestBed.createComponent(ProfileSkillsDialogComponent); // Create new instance
    expect(buildFormSpy).toHaveBeenCalled();
    buildFormSpy.mockRestore();

    expect(tempFixture.componentInstance).toBeTruthy();
    expect(tempFixture.componentInstance.genericItem).toBeUndefined(); 
    expect(tempFixture.componentInstance.existingIds).toEqual([]);
  });


  describe('buildForm (called in constructor)', () => {
    it('should call ProfileFormFactory.createSkillForm with correct args and setup onExistingIdValueChange', () => {
      const onExistingIdSpy = jest.spyOn(component as any, 'onExistingIdValueChange');
      // Clear mocks from constructor call to test it cleanly here
      MockProfileFormFactory.createSkillForm.mockClear();
      onExistingIdSpy.mockClear();

      component['buildForm'](); 
      
      expect(ProfileFormFactory.createSkillForm).toHaveBeenCalledWith(
        expect.any(Function), 
        expect.any(Function), 
        component.genericItem,
        component.skills,
        component.skillLevels
      );
      expect(component.renderForm).toBe(mockSkillForm);
      expect(onExistingIdSpy).toHaveBeenCalledWith('skillId');
      onExistingIdSpy.mockRestore();
    });
    
    it('onCancel callback from factory should close dialog with false', () => {
        // Need to get the callback from the specific call to createSkillForm
        // If buildForm is called in constructor, it's the first call
        MockProfileFormFactory.createSkillForm.mockClear();
        component['buildForm'](); // Ensure it's called for this test context
        const onCancelCallback = (ProfileFormFactory.createSkillForm as jest.Mock).mock.calls[0][1];
        onCancelCallback();
        expect(mockDialogRef.close).toHaveBeenCalledWith(false);
    });

    it('onSubmit callback from factory should call component.submitForm (from base class)', () => {
        const submitFormSpy = jest.spyOn(component, 'submitForm');
        MockProfileFormFactory.createSkillForm.mockClear();
        component['buildForm']();
        const onSubmitFactoryCallback = (ProfileFormFactory.createSkillForm as jest.Mock).mock.calls[0][0];
        onSubmitFactoryCallback();
        expect(submitFormSpy).toHaveBeenCalled();
        submitFormSpy.mockRestore();
    });
  });

  describe('userProfileGenericInput', () => {
    it('should transform form values correctly (numbers for IDs)', () => {
      component.renderForm = mockSkillForm; 
      const input = component['userProfileGenericInput']();
      expect(input.skillId).toBe(1);
      expect(input.skillLevelId).toBe(2);
    });
  });

  describe('GraphQL Mutations (via inherited submitForm)', () => {
    beforeEach(() => {
        component.renderForm = JSON.parse(JSON.stringify(mockSkillForm)); 
        component.renderForm.inputFormGroup = new FormGroup({
            skillId: new FormControl(1),
            skillLevelId: new FormControl(2),
        });
        component.renderForm.inputFormGroup.setErrors(null); 
    });

    it('submitForm should call createMutation$ (and thus createUserSkill) in create mode', fakeAsync(() => {
      component.genericItem = undefined; 
      const createMutationSpy = jest.spyOn(component as any, 'createMutation$').mockReturnValue(of({ data: { profile_create_user_skill: { id: 'new-id' } } }));
      
      component.submitForm(); 
      tick(); 

      expect(createMutationSpy).toHaveBeenCalled();
      expect(mockGraphQlProfileService.createUserSkill).toHaveBeenCalledWith(component['userProfileGenericInput']());
      expect(mockDialogRef.close).toHaveBeenCalledWith('new-id');
      createMutationSpy.mockRestore();
    }));
    
    it('submitForm should call updateMutation$ (and thus updateUserSkill) in edit mode', fakeAsync(() => {
      component.genericItem = { id: 'skill-to-update', skillId: 1, level: 3 }; 
      const updateMutationSpy = jest.spyOn(component as any, 'updateMutation$').mockReturnValue(of({ data: { profile_update_user_skill: { success: true } } }));

      component.submitForm(); 
      tick();

      expect(updateMutationSpy).toHaveBeenCalled();
      expect(mockGraphQlProfileService.updateUserSkill).toHaveBeenCalledWith('skill-to-update', component['userProfileGenericInput']());
      expect(mockDialogRef.close).toHaveBeenCalledWith(true);
      updateMutationSpy.mockRestore();
    }));
  });
  
  describe('Dictionary Data Getters', () => {
    it('skillLevels getter should return dictionaryService.skillLevelDataItems', () => {
        expect(component.skillLevels).toEqual(mockDictionaryService.skillLevelDataItems);
    });
    it('skills getter should return dictionaryService.skillDataItems', () => {
        expect(component.skills).toEqual(mockDictionaryService.skillDataItems);
    });
  });
  
  it('should call super.ngOnDestroy', () => {
    const baseNgOnDestroySpy = jest.spyOn(ProfileUserGenericProfileItem.prototype, 'ngOnDestroy');
    component.ngOnDestroy();
    expect(baseNgOnDestroySpy).toHaveBeenCalled();
  });
});
