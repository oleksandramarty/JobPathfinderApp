import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Store } from '@ngrx/store';
import { Subject, of, Observable } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { ApolloQueryResult } from '@apollo/client/core';

import { ProfileItemDialogComponent } from './profile-item-dialog.component';
import { DictionaryService, LocalizationService } from '@amarty/services';
import { GraphQlProfileService } from '../../../utils/api/services/graph-ql-profile.service';
import { ProfileFormFactory } from '../../profile-area/utils/form-renderer/profile-form.factory';
import { InputForm, UserResponse, UserProfileItemEnum, UserProfileItemResponse, DataItem, BaseIdEntityOfGuid, BaseBoolResponse } from '@amarty/models';
import { selectUser } from '@amarty/store';
import * as amartyUtils from '@amarty/utils'; 
import { ProfileUserGenericProfileItem } from '../../profile-area/utils/profile-user-generic-profile-item';


// Mock ProfileFormFactory
class MockProfileFormFactory {
  static createProfileItemForm = jest.fn();
}

// Mock formatDateToYMD
jest.mock('@amarty/utils', () => {
    const originalUtils = jest.requireActual('@amarty/utils');
    return {
        ...originalUtils,
        formatDateToYMD: jest.fn(date => date ? new Date(date).toISOString().split('T')[0] : null),
    };
});


describe('ProfileItemDialogComponent', () => {
  let component: ProfileItemDialogComponent;
  let fixture: ComponentFixture<ProfileItemDialogComponent>;

  let mockDialogRef: Partial<MatDialogRef<ProfileItemDialogComponent>>;
  let mockDialogData: { profileItem?: UserProfileItemResponse; profileItemType?: UserProfileItemEnum; title?: string; };
  let mockSnackBar: Partial<MatSnackBar>;
  let mockLocalizationService: Partial<LocalizationService>;
  let mockStore: Partial<Store>;
  let mockDictionaryService: Partial<DictionaryService>;
  let mockGraphQlProfileService: Partial<GraphQlProfileService>;
  let userSubject: Subject<UserResponse | undefined>;

  const mockProfileForm = {
    inputFormGroup: new FormGroup({
      id: new FormControl('item-id'),
      profileItemType: new FormControl(UserProfileItemEnum.Experience),
      position: new FormControl('Developer'),
      company: new FormControl('TestCo'),
      startDate: new FormControl(new Date('2022-01-01')),
      endDate: new FormControl(null),
      countryId: new FormControl(1),
      jobTypeId: new FormControl(1),
      workArrangementId: new FormControl(1),
      description: new FormControl('Test desc')
    }),
    submitted: false, // Add submitted to mock form if base class relies on it
  } as InputForm;
  
  const testUser: UserResponse = { id: 'user123', login: 'test', email: '' };


  beforeEach(async () => {
    mockDialogRef = { close: jest.fn() };
    mockSnackBar = { open: jest.fn() };
    mockLocalizationService = { handleApiError: jest.fn(), showError: jest.fn() };
    userSubject = new Subject<UserResponse | undefined>();
    mockStore = { select: jest.fn().mockImplementation(selector => {
        if (selector === selectUser) return userSubject.asObservable();
        return of(undefined);
    })};
    mockDictionaryService = {
      countryDataItems: [{id: '1', name: 'Country A'} as DataItem],
      jobTypeDataItems: [{id: '1', name: 'Full-time'} as DataItem],
      workArrangementDataItems: [{id: '1', name: 'Remote'} as DataItem],
    };
    mockGraphQlProfileService = {
      createUserProfileItem: jest.fn().mockReturnValue(of({ data: { profile_create_user_profile_item: { id: 'new-item-id' } } } as ApolloQueryResult<{ profile_create_user_profile_item: BaseIdEntityOfGuid | undefined }>)),
      updateUserProfileItem: jest.fn().mockReturnValue(of({ data: { profile_update_user_profile_item: { success: true } } } as ApolloQueryResult<{ profile_update_user_profile_item: BaseBoolResponse | undefined }>)),
    };

    MockProfileFormFactory.createProfileItemForm.mockReturnValue(mockProfileForm);
    mockDialogData = { profileItemType: UserProfileItemEnum.Experience, title: 'Add Experience' };


    await TestBed.configureTestingModule({
      imports: [
        ProfileItemDialogComponent, 
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: LocalizationService, useValue: mockLocalizationService },
        { provide: Store, useValue: mockStore },
        { provide: DictionaryService, useValue: mockDictionaryService },
        { provide: GraphQlProfileService, useValue: mockGraphQlProfileService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileItemDialogComponent);
    component = fixture.componentInstance;
    (ProfileFormFactory as any).createProfileItemForm = MockProfileFormFactory.createProfileItemForm;
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create and set properties from MAT_DIALOG_DATA', () => {
    fixture.detectChanges(); 
    userSubject.next(testUser); 
    expect(component).toBeTruthy();
    expect(component.genericItem).toBeUndefined(); 
    expect(component.profileItemType).toBe(UserProfileItemEnum.Experience);
    expect(component.title).toBe('Add Experience');
  });

  describe('ngOnInit', () => {
    it('should selectUser from store, set currentUser, and call buildForm', fakeAsync(() => {
      const buildFormSpy = jest.spyOn(component as any, 'buildForm');
      fixture.detectChanges(); 
      
      userSubject.next(testUser);
      tick();

      expect(mockStore.select).toHaveBeenCalledWith(selectUser);
      expect(component.currentUser).toEqual(testUser);
      expect(buildFormSpy).toHaveBeenCalled();
    }));
  });

  describe('buildForm', () => {
    it('should call ProfileFormFactory.createProfileItemForm with correct args', () => {
      fixture.detectChanges();
      userSubject.next(testUser); 
      
      expect(ProfileFormFactory.createProfileItemForm).toHaveBeenCalledWith(
        component.profileItemType,
        component.genericItem,
        component.countries,
        component.jobTypes,
        component.workArrangements,
        expect.any(Function), 
        expect.any(Function)  
      );
      expect(component.renderForm).toBe(mockProfileForm);
    });
    
    it('onCancel callback from factory should close dialog with false', () => {
        fixture.detectChanges();
        userSubject.next(testUser);
        const onCancelCallback = (ProfileFormFactory.createProfileItemForm as jest.Mock).mock.calls[0][6];
        onCancelCallback();
        expect(mockDialogRef.close).toHaveBeenCalledWith(false);
    });

    it('onSubmit callback from factory should call component.submitForm (from base class)', () => {
        const submitFormSpy = jest.spyOn(component, 'submitForm');
        fixture.detectChanges();
        userSubject.next(testUser);
        const onSubmitFactoryCallback = (ProfileFormFactory.createProfileItemForm as jest.Mock).mock.calls[0][5];
        onSubmitFactoryCallback();
        expect(submitFormSpy).toHaveBeenCalled();
        submitFormSpy.mockRestore();
    });
  });

  describe('userProfileGenericInput', () => {
    it('should transform form values correctly', () => {
      fixture.detectChanges();
      component.currentUser = testUser;
      component.renderForm = mockProfileForm; 

      const input = component['userProfileGenericInput']();
      expect(input.userId).toBe(testUser.id);
      expect(input.profileItemType).toBe(UserProfileItemEnum.Experience);
      expect(input.position).toBe('Developer');
      expect(amartyUtils.formatDateToYMD).toHaveBeenCalledWith(new Date('2022-01-01'));
      expect(input.startDate).toBe(new Date('2022-01-01').toISOString().split('T')[0]);
      expect(input.endDate).toBeNull();
      expect(input.countryId).toBe(1);
    });
  });

  describe('GraphQL Mutations (via inherited submitForm)', () => {
    beforeEach(() => {
        fixture.detectChanges();
        component.currentUser = testUser;
        component.renderForm = JSON.parse(JSON.stringify(mockProfileForm)); // Deep clone
        // Re-create form group as it's not fully cloned by JSON.parse
        component.renderForm.inputFormGroup = new FormGroup({
            id: new FormControl(mockProfileForm.inputFormGroup.get('id')?.value),
            profileItemType: new FormControl(mockProfileForm.inputFormGroup.get('profileItemType')?.value),
            position: new FormControl(mockProfileForm.inputFormGroup.get('position')?.value),
            company: new FormControl(mockProfileForm.inputFormGroup.get('company')?.value),
            startDate: new FormControl(mockProfileForm.inputFormGroup.get('startDate')?.value),
            endDate: new FormControl(mockProfileForm.inputFormGroup.get('endDate')?.value),
            countryId: new FormControl(mockProfileForm.inputFormGroup.get('countryId')?.value),
            jobTypeId: new FormControl(mockProfileForm.inputFormGroup.get('jobTypeId')?.value),
            workArrangementId: new FormControl(mockProfileForm.inputFormGroup.get('workArrangementId')?.value),
            description: new FormControl(mockProfileForm.inputFormGroup.get('description')?.value)
        });
        component.renderForm.inputFormGroup.setErrors(null); // Ensure form is valid
    });

    it('submitForm should call createMutation$ (and thus createUserProfileItem) in create mode', fakeAsync(() => {
      component.genericItem = undefined; // Create mode
      const createMutationSpy = jest.spyOn(component as any, 'createMutation$').mockReturnValue(of({ data: { profile_create_user_profile_item: { id: 'new-id' } } }));
      
      component.submitForm();
      tick(); // for async operations in submitForm and mutation observable

      expect(createMutationSpy).toHaveBeenCalled();
      expect(mockGraphQlProfileService.createUserProfileItem).toHaveBeenCalledWith(component['userProfileGenericInput']());
      expect(mockDialogRef.close).toHaveBeenCalledWith('new-id');
      createMutationSpy.mockRestore();
    }));
    
    it('submitForm should call updateMutation$ (and thus updateUserProfileItem) in edit mode', fakeAsync(() => {
      component.genericItem = { id: 'item-to-update', profileItemType: UserProfileItemEnum.Experience, position: '', company: '' }; // Edit mode
      const updateMutationSpy = jest.spyOn(component as any, 'updateMutation$').mockReturnValue(of({ data: { profile_update_user_profile_item: { success: true } } }));

      component.submitForm();
      tick();

      expect(updateMutationSpy).toHaveBeenCalled();
      expect(mockGraphQlProfileService.updateUserProfileItem).toHaveBeenCalledWith('item-to-update', component['userProfileGenericInput']());
      expect(mockDialogRef.close).toHaveBeenCalledWith(true);
      updateMutationSpy.mockRestore();
    }));
  });
  
  describe('Dictionary Data Getters', () => {
    it('countries getter should return dictionaryService.countryDataItems', () => {
        expect(component.countries).toEqual(mockDictionaryService.countryDataItems);
    });
    it('jobTypes getter should return dictionaryService.jobTypeDataItems', () => {
        expect(component.jobTypes).toEqual(mockDictionaryService.jobTypeDataItems);
    });
    it('workArrangements getter should return dictionaryService.workArrangementDataItems', () => {
        expect(component.workArrangements).toEqual(mockDictionaryService.workArrangementDataItems);
    });
  });
  
  it('should call super.ngOnInit and super.ngOnDestroy', () => {
    const baseNgOnInitSpy = jest.spyOn(ProfileUserGenericProfileItem.prototype, 'ngOnInit');
    const baseNgOnDestroySpy = jest.spyOn(ProfileUserGenericProfileItem.prototype, 'ngOnDestroy');
    
    fixture.detectChanges(); 
    userSubject.next(testUser); // Trigger the rest of ngOnInit
    
    expect(baseNgOnInitSpy).toHaveBeenCalled();
    
    component.ngOnDestroy();
    expect(baseNgOnDestroySpy).toHaveBeenCalled();
  });
});
