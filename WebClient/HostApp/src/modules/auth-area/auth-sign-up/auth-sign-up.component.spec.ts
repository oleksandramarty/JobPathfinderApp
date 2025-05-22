import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AuthSignUpComponent } from './auth-sign-up.component';
import { AuthFormFactory } from '../utils/form-renderer/auth-form.factory';
import { GraphQlAuthService } from '../../../utils/api/services/graph-ql-auth.service';
import { LocalizationService } from '@amarty/services';
import { InputForm, BaseIdEntityOfGuid } from '@amarty/models';
import { LOCALIZATION_KEYS } from '@amarty/localizations';

// Mock AuthFormFactory
class MockAuthFormFactory {
  static createSignUpForm = jest.fn();
}

describe('AuthSignUpComponent', () => {
  let component: AuthSignUpComponent;
  let fixture: ComponentFixture<AuthSignUpComponent>;

  let mockSnackBar: Partial<MatSnackBar>;
  let mockRouter: Partial<Router>;
  let mockGraphQlAuthService: Partial<GraphQlAuthService>;
  let mockLocalizationService: Partial<LocalizationService>;

  const mockSignUpForm = {
    submitted: false,
    inputFormGroup: {
      valid: true,
      invalid: false,
      value: {
        firstName: 'Test',
        lastName: 'User',
        login: 'testuser',
        email: 'test@example.com',
        newPassword: 'password123',
        confirmNewPassword: 'password123',
      },
      get: jest.fn().mockImplementation((path: string) => ({ value: mockSignUpForm.inputFormGroup?.value[path as keyof typeof mockSignUpForm.inputFormGroup.value] })),
    },
  } as unknown as InputForm;

  beforeEach(async () => {
    mockSnackBar = { open: jest.fn() };
    mockRouter = { navigate: jest.fn() };
    mockGraphQlAuthService = {
      signUp: jest.fn().mockReturnValue(of({ data: { auth_gateway_sign_up: { id: 'new-user-id' } as BaseIdEntityOfGuid } })),
    };
    mockLocalizationService = { handleApiError: jest.fn() };

    MockAuthFormFactory.createSignUpForm.mockReturnValue(mockSignUpForm);

    await TestBed.configureTestingModule({
      imports: [
        AuthSignUpComponent, // Is standalone
        ReactiveFormsModule, // For form interactions within GenericFormRendererComponent
        NoopAnimationsModule, // For MatSnackBar
      ],
      providers: [
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: Router, useValue: mockRouter },
        { provide: GraphQlAuthService, useValue: mockGraphQlAuthService },
        { provide: LocalizationService, useValue: mockLocalizationService },
        // AuthFormFactory is static, its methods are mocked directly
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // For app-generic-form-renderer
    }).compileComponents();

    fixture = TestBed.createComponent(AuthSignUpComponent);
    component = fixture.componentInstance;
    (AuthFormFactory as any).createSignUpForm = MockAuthFormFactory.createSignUpForm; // Ensure mock is used
    fixture.detectChanges(); // Calls ngOnInit
  });

  afterEach(() => {
    jest.clearAllMocks();
    MockAuthFormFactory.createSignUpForm.mockClear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize renderForm on ngOnInit using AuthFormFactory', () => {
    expect(AuthFormFactory.createSignUpForm).toHaveBeenCalled();
    expect(component.renderForm).toBe(mockSignUpForm);
  });
  
  it('AuthFormFactory.createSignUpForm should pass component.signUp as the submit callback', () => {
      // Access the first argument (onSubmit callback)
      const signUpCallback = (AuthFormFactory.createSignUpForm as jest.Mock).mock.calls[0][0];
      const signUpSpy = jest.spyOn(component, 'signUp').mockImplementation(() => {}); // Spy and prevent original execution for this test
      signUpCallback();
      expect(signUpSpy).toHaveBeenCalled();
      signUpSpy.mockRestore(); // Restore original method
  });

  describe('signUp method', () => {
    let consoleLogSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
      // Ensure the component's form instance is the mock one for tests
      component.renderForm = mockSignUpForm; 
      // Reset form state for each test
      component.renderForm.inputFormGroup!.invalid = false;
      component.renderForm.inputFormGroup!.valid = true;
      component.submitted = false;
    });
    
    afterEach(() => {
        consoleLogSpy.mockRestore();
    });

    it('should set submitted to true', () => {
      component.signUp();
      expect(component.submitted).toBe(true);
    });

    it('should show snackbar and return if form is invalid', () => {
      component.renderForm.inputFormGroup!.invalid = true;
      component.renderForm.inputFormGroup!.valid = false;
      component.signUp();
      expect(mockSnackBar.open).toHaveBeenCalledWith(
        LOCALIZATION_KEYS.COMMON.FIX_ERROR_BEFORE_CONTINUE,
        LOCALIZATION_KEYS.COMMON.BUTTON.OK,
        expect.any(Object)
      );
      expect(mockGraphQlAuthService.signUp).not.toHaveBeenCalled();
    });

    it('should call graphQlAuthService.signUp with form values and navigate on success', fakeAsync(() => {
      component.renderForm.inputFormGroup!.invalid = false;
      component.renderForm.inputFormGroup!.valid = true;
      
      component.signUp();
      tick(); // Process observable from signUp

      expect(mockGraphQlAuthService.signUp).toHaveBeenCalledWith({
        firstName: 'Test',
        lastName: 'User',
        login: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        passwordAgain: 'password123',
      });
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/sign-in']);
      expect(consoleLogSpy).toHaveBeenCalledWith('Sign-up form submitted:', mockSignUpForm.inputFormGroup?.value);
    }));

    it('should call localizationService.handleApiError on signUp error', fakeAsync(() => {
      const error = new Error('Sign-up failed');
      (mockGraphQlAuthService.signUp as jest.Mock).mockReturnValue(throwError(() => error));
      component.renderForm.inputFormGroup!.invalid = false;
      component.renderForm.inputFormGroup!.valid = true;

      component.signUp();
      tick(); // Process observable

      expect(mockLocalizationService.handleApiError).toHaveBeenCalledWith(error);
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    }));
  });

  describe('_startTimer method (animation)', () => {
    it('should update langIndex periodically', fakeAsync(() => {
      const initialLangIndex = component.langIndex;
      // _startTimer is called in constructor.
      // fixture.detectChanges(); // Called in main beforeEach

      tick(1000); // Advance time by 1 second
      expect(component.langIndex).not.toBe(initialLangIndex);
      expect(component.langIndex).toBe((initialLangIndex + 1) % component.langArray.length);

      tick(1000); // Advance another second
      expect(component.langIndex).toBe((initialLangIndex + 2) % component.langArray.length);

      fixture.destroy(); // Calls ngOnDestroy, stopping the interval
      tick(2000); // Ensure no more changes
    }));
  });

  it('should render app-generic-form-renderer', () => {
    const formRenderer = fixture.nativeElement.querySelector('app-generic-form-renderer');
    expect(formRenderer).toBeTruthy();
  });
  
  it('should unsubscribe on destroy', () => {
    const ngUnsubscribeNextSpy = jest.spyOn(component.ngUnsubscribe, 'next');
    const ngUnsubscribeCompleteSpy = jest.spyOn(component.ngUnsubscribe, 'complete');
    
    fixture.destroy(); // Triggers ngOnDestroy
    
    expect(ngUnsubscribeNextSpy).toHaveBeenCalled();
    expect(ngUnsubscribeCompleteSpy).toHaveBeenCalled();
  });
});
