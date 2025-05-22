import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Store } from '@ngrx/store';
import { Subject, of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';

import { ApplicationDialogComponent } from './application-dialog.component';
import { DictionaryService } from '@amarty/services';
import { ApplicationFormFactory } from '../../landing-area/utils/form-renderer/application-form.factory';
import { InputForm, UserResponse } from '@amarty/models';
import { selectUser } from '@amarty/store';
import { LOCALIZATION_KEYS } from '@amarty/localizations';

// Mock ApplicationFormFactory
class MockApplicationFormFactory {
  static createApplicationForm = jest.fn();
}

describe('ApplicationDialogComponent', () => {
  let component: ApplicationDialogComponent;
  let fixture: ComponentFixture<ApplicationDialogComponent>;

  let mockDialogRef: Partial<MatDialogRef<ApplicationDialogComponent>>;
  let mockDialogData: { applicationId?: string } | undefined;
  let mockSnackBar: Partial<MatSnackBar>;
  let mockStore: Partial<Store>;
  let mockDictionaryService: Partial<DictionaryService>;
  let userSubject: Subject<UserResponse | undefined>;

  const mockApplicationForm = {
    inputFormGroup: new FormGroup({
      title: new FormControl('Test App'),
      company: new FormControl('Test Co'),
      prompt: new FormControl('') 
    }),
    submitted: false,
  } as InputForm;


  beforeEach(async () => {
    mockDialogRef = { close: jest.fn() };
    mockSnackBar = { open: jest.fn() };
    userSubject = new Subject<UserResponse | undefined>();
    mockStore = { select: jest.fn().mockImplementation(selector => {
        if (selector === selectUser) return userSubject.asObservable();
        return of(undefined);
    })};
    mockDictionaryService = {
      experienceLevelDataItems: [],
      jobTypeDataItems: [],
      jobSourceDataItems: [],
      currencyDataItems: [],
    };

    MockApplicationFormFactory.createApplicationForm.mockReturnValue(mockApplicationForm);
    // Initialize mockDialogData here or in specific describe blocks if it varies
    mockDialogData = { applicationId: undefined }; // Default to create mode for general setup

    await TestBed.configureTestingModule({
      imports: [
        ApplicationDialogComponent, 
        ReactiveFormsModule, 
        NoopAnimationsModule, 
      ],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: Store, useValue: mockStore },
        { provide: DictionaryService, useValue: mockDictionaryService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA], 
    }).compileComponents();

    fixture = TestBed.createComponent(ApplicationDialogComponent);
    component = fixture.componentInstance;
    (ApplicationFormFactory as any).createApplicationForm = MockApplicationFormFactory.createApplicationForm; 
  });
  
  afterEach(() => {
    MockApplicationFormFactory.createApplicationForm.mockClear();
    (mockStore.select as jest.Mock).mockClear();
    (mockDialogRef.close as jest.Mock).mockClear();
    (mockSnackBar.open as jest.Mock).mockClear();
    jest.clearAllMocks(); // Clear all other Jest mocks
  });

  it('should create', () => {
    fixture.detectChanges(); // ngOnInit
    expect(component).toBeTruthy();
  });

  describe('ngOnInit and User Interaction', () => {
    const testUser: UserResponse = { id: 'u1', login: 'test', email: '', userSetting: { applicationAiPrompt: true } };
    
    it('should subscribe to selectUser, set user, aiPrompt, and call buildForm', fakeAsync(() => {
      const buildFormSpy = jest.spyOn(component as any, 'buildForm');
      fixture.detectChanges(); 
      
      userSubject.next(testUser);
      tick();

      expect(mockStore.select).toHaveBeenCalledWith(selectUser);
      expect(component.user).toEqual(testUser);
      expect(component.aiPrompt).toBe(true);
      expect(buildFormSpy).toHaveBeenCalled();
    }));
    
    it('should set aiPrompt to false if userSetting or applicationAiPrompt is not set', fakeAsync(() => {
      const userWithoutSetting: UserResponse = { id: 'u2', login: 'noSetting', email: '' };
      fixture.detectChanges();
      userSubject.next(userWithoutSetting);
      tick();
      expect(component.aiPrompt).toBe(false);

      const userWithSettingNull: UserResponse = { id: 'u3', login: 'settingNull', email: '', userSetting: { applicationAiPrompt: null as any } };
      userSubject.next(userWithSettingNull);
      tick();
      expect(component.aiPrompt).toBe(false);
    }));
  });

  describe('dialogTitle getter', () => {
    it('should return CREATE title when not in edit mode (applicationId is undefined)', () => {
      component = fixture.componentInstance; // Component is recreated with current mockDialogData
      fixture.detectChanges();
      expect(component.dialogTitle).toBe(LOCALIZATION_KEYS.COMMON.BUTTON.CREATE);
    });

    it('should return EDIT title when in edit mode (applicationId is provided)', () => {
      // Need to re-initialize component with new MAT_DIALOG_DATA
      TestBed.resetTestingModule();
      mockDialogData = { applicationId: 'app123' };
      TestBed.configureTestingModule({
        imports: [ApplicationDialogComponent, ReactiveFormsModule, NoopAnimationsModule],
        providers: [
            { provide: MatDialogRef, useValue: mockDialogRef },
            { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
            { provide: MatSnackBar, useValue: mockSnackBar },
            { provide: Store, useValue: mockStore },
            { provide: DictionaryService, useValue: mockDictionaryService },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      }).compileComponents();
      fixture = TestBed.createComponent(ApplicationDialogComponent);
      component = fixture.componentInstance;
      (ApplicationFormFactory as any).createApplicationForm = MockApplicationFormFactory.createApplicationForm;
      fixture.detectChanges();
      expect(component.dialogTitle).toBe(LOCALIZATION_KEYS.COMMON.BUTTON.EDIT);
    });
  });

  describe('buildForm', () => {
    it('should call ApplicationFormFactory.createApplicationForm with correct arguments', () => {
      fixture.detectChanges(); 
      userSubject.next({ id: 'u1', login: 'test', email: '' }); 
      
      expect(ApplicationFormFactory.createApplicationForm).toHaveBeenCalledWith(
        !!mockDialogData?.applicationId, // isEdit based on initial mockDialogData
        component.user,
        mockDictionaryService.experienceLevelDataItems,
        mockDictionaryService.jobTypeDataItems,
        mockDictionaryService.jobSourceDataItems,
        mockDictionaryService.currencyDataItems,
        expect.any(Function), 
        expect.any(Function)  
      );
      expect(component.renderForm).toBe(mockApplicationForm);
    });

    it('onCancel callback from factory should close dialog with false', () => {
        fixture.detectChanges();
        userSubject.next(undefined); 
        const onCancelCallback = (ApplicationFormFactory.createApplicationForm as jest.Mock).mock.calls[0][7];
        onCancelCallback();
        expect(mockDialogRef.close).toHaveBeenCalledWith(false);
    });
    
    it('onSubmit callback from factory should call component.onSubmit', () => {
        const onSubmitSpy = jest.spyOn(component, 'onSubmit');
        fixture.detectChanges();
        userSubject.next(undefined); 
        const onSubmitFactoryCallback = (ApplicationFormFactory.createApplicationForm as jest.Mock).mock.calls[0][6];
        onSubmitFactoryCallback();
        expect(onSubmitSpy).toHaveBeenCalled();
        onSubmitSpy.mockRestore();
    });
  });

  describe('onSubmit', () => {
    beforeEach(() => {
        fixture.detectChanges(); 
        userSubject.next(undefined); 
        component.renderForm = JSON.parse(JSON.stringify(mockApplicationForm)); // Deep copy
        component.renderForm.inputFormGroup = new FormGroup({
            title: new FormControl('Test App'),
            company: new FormControl('Test Co'),
            prompt: new FormControl('')
        });
    });

    it('should mark form as submitted', () => {
      component.onSubmit();
      expect(component.submitted).toBe(true);
      // If factory form object is shared, this might be true already.
      // expect(component.renderForm!.submitted).toBe(true); 
    });

    it('should show snackbar and not close dialog if form is invalid', () => {
      component.renderForm!.inputFormGroup!.setErrors({ 'someError': true }); // Make form invalid
      component.onSubmit();
      expect(mockSnackBar.open).toHaveBeenCalledWith(
        LOCALIZATION_KEYS.COMMON.FIX_ERROR_BEFORE_CONTINUE,
        LOCALIZATION_KEYS.COMMON.BUTTON.OK,
        expect.any(Object)
      );
      expect(mockDialogRef.close).not.toHaveBeenCalled();
    });

    it('should close dialog with form value if form is valid', () => {
      component.renderForm!.inputFormGroup!.setErrors(null); // Make form valid
      component.onSubmit();
      expect(mockDialogRef.close).toHaveBeenCalledWith(component.renderForm!.inputFormGroup!.value);
    });
  });

  describe('parsePrompt', () => {
    let consoleWarnSpy: jest.SpyInstance;

    beforeEach(() => {
      fixture.detectChanges();
      userSubject.next(undefined); 
      component.renderForm = JSON.parse(JSON.stringify(mockApplicationForm)); // Deep copy
      component.renderForm.inputFormGroup = new FormGroup({
            title: new FormControl('Old Title'),
            company: new FormControl('Old Company'),
            prompt: new FormControl('')
      });
      consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    });
    
    afterEach(() => {
        consoleWarnSpy.mockRestore();
    });

    it('should do nothing if renderForm or inputFormGroup is not defined', () => {
      component.renderForm = undefined;
      component.parsePrompt(); 
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });
    
    it('should do nothing if prompt control is missing', () => {
      component.renderForm!.inputFormGroup = new FormGroup({ title: new FormControl('') }); 
      component.parsePrompt();
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('should parse valid JSON from prompt and patch form values', () => {
      const promptValue = JSON.stringify({ title: 'New Title from Prompt', company: 'New Co' });
      component.renderForm!.inputFormGroup!.get('prompt')!.setValue(promptValue);
      component.parsePrompt();
      expect(component.renderForm!.inputFormGroup!.get('title')?.value).toBe('New Title from Prompt');
      expect(component.renderForm!.inputFormGroup!.get('company')?.value).toBe('New Co');
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('should warn if JSON in prompt is invalid and not patch form', () => {
      const invalidJson = '{ title: "Bad JSON", company: "Test" }'; 
      component.renderForm!.inputFormGroup!.get('prompt')!.setValue(invalidJson);
      component.parsePrompt();
      expect(consoleWarnSpy).toHaveBeenCalledWith('Invalid JSON prompt');
      expect(component.renderForm!.inputFormGroup!.get('title')?.value).toBe('Old Title');
    });
    
    it('should only patch existing form controls', () => {
      const promptValue = JSON.stringify({ title: 'New Title', nonExistentControl: 'some value' });
      component.renderForm!.inputFormGroup!.get('prompt')!.setValue(promptValue);
      component.parsePrompt();
      expect(component.renderForm!.inputFormGroup!.get('title')?.value).toBe('New Title');
      expect(component.renderForm!.inputFormGroup!.get('nonExistentControl')).toBeFalsy();
    });
  });
  
  it('should unsubscribe on destroy', () => {
    fixture.detectChanges();
    userSubject.next(undefined); 
    
    const ngUnsubscribeNextSpy = jest.spyOn(component.ngUnsubscribe, 'next');
    const ngUnsubscribeCompleteSpy = jest.spyOn(component.ngUnsubscribe, 'complete');
    
    component.ngOnDestroy();
    
    expect(ngUnsubscribeNextSpy).toHaveBeenCalled();
    expect(ngUnsubscribeCompleteSpy).toHaveBeenCalled();
  });
});
