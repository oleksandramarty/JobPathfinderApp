import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AuthForgotComponent } from './auth-forgot.component';
import { AuthFormFactory } from '../utils/form-renderer/auth-form.factory';
import { InputForm } from '@amarty/models';
import { LOCALIZATION_KEYS } from '@amarty/localizations';

// Mock AuthFormFactory
class MockAuthFormFactory {
  static createForgotForm = jest.fn();
}

describe('AuthForgotComponent', () => {
  let component: AuthForgotComponent;
  let fixture: ComponentFixture<AuthForgotComponent>;

  let mockSnackBar: Partial<MatSnackBar>;
  let mockRouter: Partial<Router>;

  const mockForgotForm = {
    submitted: false,
    inputFormGroup: {
      valid: true,
      invalid: false,
      value: {
        email: 'test@example.com',
        login: 'testuser',
      },
      get: jest.fn().mockImplementation((path: string) => ({ value: mockForgotForm.inputFormGroup?.value[path as keyof typeof mockForgotForm.inputFormGroup.value] })),
    },
  } as unknown as InputForm;

  beforeEach(async () => {
    mockSnackBar = { open: jest.fn() };
    mockRouter = { navigate: jest.fn() };

    MockAuthFormFactory.createForgotForm.mockReturnValue(mockForgotForm);

    await TestBed.configureTestingModule({
      imports: [
        AuthForgotComponent, // Is standalone
        ReactiveFormsModule, // Though not directly used, form renderer might need it
        NoopAnimationsModule, // For MatSnackBar
      ],
      providers: [
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: Router, useValue: mockRouter },
        // AuthFormFactory is static, its methods are mocked directly
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // For app-generic-form-renderer
    }).compileComponents();

    fixture = TestBed.createComponent(AuthForgotComponent);
    component = fixture.componentInstance;
    (AuthFormFactory as any).createForgotForm = MockAuthFormFactory.createForgotForm; // Ensure our mock is used for static method
    fixture.detectChanges(); // Calls ngOnInit
  });

  afterEach(() => {
    jest.clearAllMocks();
    MockAuthFormFactory.createForgotForm.mockClear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize renderForm on ngOnInit using AuthFormFactory', () => {
    expect(AuthFormFactory.createForgotForm).toHaveBeenCalled();
    expect(component.renderForm).toBe(mockForgotForm);
  });
  
  it('AuthFormFactory.createForgotForm should pass correct navigation for sign-in link', () => {
      // Access the first argument (onCancel callback) passed to createForgotForm
      const signInCallback = (AuthFormFactory.createForgotForm as jest.Mock).mock.calls[0][0];
      signInCallback();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/sign-in']);
  });

  it('AuthFormFactory.createForgotForm should pass component.forgot as the submit callback', () => {
      // Access the second argument (onSubmit callback)
      const forgotCallback = (AuthFormFactory.createForgotForm as jest.Mock).mock.calls[0][1];
      const forgotSpy = jest.spyOn(component, 'forgot').mockImplementation(() => {}); // Spy and prevent original execution for this test
      forgotCallback();
      expect(forgotSpy).toHaveBeenCalled();
      forgotSpy.mockRestore(); // Restore original method
  });

  describe('forgot method', () => {
    let consoleLogSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
      // Ensure the component's form instance is the mock one for tests
      component.renderForm = mockForgotForm; 
      // Reset form state for each test if needed
      component.renderForm.inputFormGroup!.invalid = false;
      component.renderForm.inputFormGroup!.valid = true;
      component.submitted = false;
    });

    afterEach(() => {
      consoleLogSpy.mockRestore();
    });

    it('should set submitted to true', () => {
      component.forgot();
      expect(component.submitted).toBe(true);
    });

    it('should show snackbar and return if form is invalid', () => {
      component.renderForm.inputFormGroup!.invalid = true;
      component.renderForm.inputFormGroup!.valid = false;
      component.forgot();
      expect(mockSnackBar.open).toHaveBeenCalledWith(
        LOCALIZATION_KEYS.COMMON.FIX_ERROR_BEFORE_CONTINUE,
        LOCALIZATION_KEYS.COMMON.BUTTON.OK,
        expect.any(Object)
      );
      expect(consoleLogSpy).not.toHaveBeenCalled();
    });

    it('should log form value if form is valid', () => {
      component.renderForm.inputFormGroup!.invalid = false;
      component.renderForm.inputFormGroup!.valid = true;
      component.forgot();
      expect(consoleLogSpy).toHaveBeenCalledWith('Forgot form submitted:', mockForgotForm.inputFormGroup?.value);
    });
  });

  describe('_startTimer method (animation)', () => {
    it('should update langIndex and showLang periodically', fakeAsync(() => {
      const initialLangIndex = component.langIndex;
      
      // _startTimer is called in constructor.
      // fixture.detectChanges(); // Is called in the main beforeEach

      tick(3000); // Advance time by 3 seconds for the interval
      fixture.detectChanges(); // To reflect changes if showLang is bound in template
      expect(component.showLang).toBe(false);

      tick(100); // Advance time by 100ms for the setTimeout
      fixture.detectChanges();
      expect(component.showLang).toBe(true);
      expect(component.langIndex).not.toBe(initialLangIndex);
      expect(component.langIndex).toBe((initialLangIndex + 1) % component.langArray.length);

      fixture.destroy(); // Calls ngOnDestroy, stopping the interval
      tick(6000); // Ensure no more changes after destroy by ticking well past next interval
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
