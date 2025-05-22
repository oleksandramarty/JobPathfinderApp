import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError, Subject } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AuthSignInComponent } from './auth-sign-in.component';
import { AuthService } from '../../../utils/services/auth.service';
import { AuthFormFactory } from '../utils/form-renderer/auth-form.factory';
import { GraphQlAuthService } from '../../../utils/api/services/graph-ql-auth.service';
import { CommonDialogService, LoaderService, LocalizationService } from '@amarty/services';
import { InputForm, JwtTokenResponse } from '@amarty/models';
import { GenericConfirmationMessageDialogComponent } from '@amarty/components';
import { LOCALIZATION_KEYS } from '@amarty/localizations';

// Mock AuthFormFactory
class MockAuthFormFactory {
  static createSignInForm = jest.fn();
}

describe('AuthSignInComponent', () => {
  let component: AuthSignInComponent;
  let fixture: ComponentFixture<AuthSignInComponent>;

  let mockSnackBar: Partial<MatSnackBar>;
  let mockAuthService: Partial<AuthService>;
  let mockDialogService: Partial<CommonDialogService>;
  let mockLoaderService: Partial<LoaderService>;
  let mockLocalizationService: Partial<LocalizationService>;
  let mockGraphQlAuthService: Partial<GraphQlAuthService>;
  let mockRouter: Partial<Router>;

  const mockSignInForm = {
    submitted: false,
    inputFormGroup: {
      valid: true,
      invalid: false,
      value: {
        loginEmail: 'test@example.com',
        password: 'password123',
        rememberMe: true,
      },
      // Provide a default get implementation, can be overridden in tests if needed
      get: jest.fn().mockImplementation((path: string) => ({ value: mockSignInForm.inputFormGroup?.value[path as keyof typeof mockSignInForm.inputFormGroup.value] })),
      markAllAsTouched: jest.fn(), 
    },
  } as unknown as InputForm;

  beforeEach(async () => {
    mockSnackBar = { open: jest.fn() };
    mockAuthService = { updateToken: jest.fn() };
    mockDialogService = { 
      showDialog: jest.fn().mockImplementation((component, config, executableAction) => {
        if (executableAction) {
          executableAction(); 
        }
        return { afterClosed: () => of(true) }; 
      }) 
    };
    mockLoaderService = { isBusy: false }; 
    mockLocalizationService = { 
        handleApiError: jest.fn(),
        getTranslation: jest.fn(key => key) 
    };
    mockGraphQlAuthService = { 
      signIn: jest.fn().mockReturnValue(of({ data: { auth_gateway_sign_in: { token: 'test-token' } as JwtTokenResponse } }))
    };
    mockRouter = { navigate: jest.fn() };

    MockAuthFormFactory.createSignInForm.mockReturnValue(mockSignInForm);

    await TestBed.configureTestingModule({
      imports: [
        AuthSignInComponent, 
        ReactiveFormsModule, 
        NoopAnimationsModule, 
      ],
      providers: [
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: AuthService, useValue: mockAuthService },
        { provide: CommonDialogService, useValue: mockDialogService },
        { provide: LoaderService, useValue: mockLoaderService },
        { provide: LocalizationService, useValue: mockLocalizationService },
        { provide: GraphQlAuthService, useValue: mockGraphQlAuthService },
        { provide: Router, useValue: mockRouter },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA], 
    }).compileComponents();

    fixture = TestBed.createComponent(AuthSignInComponent);
    component = fixture.componentInstance;
    (AuthFormFactory as any).createSignInForm = MockAuthFormFactory.createSignInForm; // Ensure our mock is used
    fixture.detectChanges(); 
  });

  afterEach(() => {
    jest.clearAllMocks(); 
    MockAuthFormFactory.createSignInForm.mockClear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize renderForm on ngOnInit using AuthFormFactory', () => {
    expect(AuthFormFactory.createSignInForm).toHaveBeenCalled();
    expect(component.renderForm).toBe(mockSignInForm);
  });

  it('AuthFormFactory.createSignInForm should pass correct navigation for forgot password', () => {
      const forgotPasswordCallback = (AuthFormFactory.createSignInForm as jest.Mock).mock.calls[0][0];
      forgotPasswordCallback();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/forgot']);
  });

  it('AuthFormFactory.createSignInForm should pass component.login as the submit callback', () => {
      const loginCallback = (AuthFormFactory.createSignInForm as jest.Mock).mock.calls[0][1];
      const loginSpy = jest.spyOn(component, 'login').mockImplementation(() => {}); // Spy and prevent original execution for this test
      loginCallback();
      expect(loginSpy).toHaveBeenCalled();
      loginSpy.mockRestore();
  });


  describe('login method', () => {
    it('should show snackbar and return if form is invalid', () => {
      component.renderForm.inputFormGroup!.invalid = true; 
      component.login();
      expect(mockSnackBar.open).toHaveBeenCalledWith(
        LOCALIZATION_KEYS.COMMON.FIX_ERROR_BEFORE_CONTINUE,
        LOCALIZATION_KEYS.COMMON.BUTTON.OK,
        expect.any(Object)
      );
      expect(mockDialogService.showDialog).not.toHaveBeenCalled();
      component.renderForm.inputFormGroup!.invalid = false; 
    });

    it('should show confirmation dialog', () => {
      component.renderForm.inputFormGroup!.invalid = false; // Ensure form is valid
      component.login();
      expect(mockDialogService.showDialog).toHaveBeenCalledWith(
        GenericConfirmationMessageDialogComponent,
        expect.any(Object),
        expect.any(Function) 
      );
    });

    describe('after dialog confirmation (executableAction)', () => {
      beforeEach(() => {
        component.renderForm.inputFormGroup!.invalid = false; // Ensure form is valid
        // The default mockDialogService implementation calls executableAction immediately
      });

      it('should set loaderService.isBusy to true', () => {
        component.login(); 
        expect(mockLoaderService.isBusy).toBe(true);
      });

      it('should call graphQlAuthService.signIn with form values', () => {
        component.login();
        expect(mockGraphQlAuthService.signIn).toHaveBeenCalledWith(
          mockSignInForm.inputFormGroup?.value.loginEmail,
          mockSignInForm.inputFormGroup?.value.password,
          mockSignInForm.inputFormGroup?.value.rememberMe
        );
      });

      it('on signIn success, should update token, navigate to home, and reset loader', fakeAsync(() => {
        const tokenResponse = { token: 'new-jwt-token' } as JwtTokenResponse;
        (mockGraphQlAuthService.signIn as jest.Mock).mockReturnValue(of({ data: { auth_gateway_sign_in: tokenResponse } }));
        
        component.login();
        tick(); 

        expect(mockAuthService.updateToken).toHaveBeenCalledWith(tokenResponse);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
        expect(mockLoaderService.isBusy).toBe(false); 
      }));

      it('on signIn error, should call localizationService.handleApiError and reset loader', fakeAsync(() => {
        const error = new Error('Sign-in failed');
        (mockGraphQlAuthService.signIn as jest.Mock).mockReturnValue(throwError(() => error));
        
        component.login();
        tick();

        expect(mockLocalizationService.handleApiError).toHaveBeenCalledWith(error);
        expect(mockAuthService.updateToken).not.toHaveBeenCalled();
        expect(mockRouter.navigate).not.toHaveBeenCalledWith(['/home']);
        expect(mockLoaderService.isBusy).toBe(false); 
      }));
    });
  });
  
  describe('_startTimer method (animation)', () => {
    it('should update langIndex and showLang periodically', fakeAsync(() => {
      // Note: _startTimer is called in constructor. Test relies on its effects.
      const initialLangIndex = component.langIndex;
      
      tick(1000); // Advance time by 1 second for the interval
      fixture.detectChanges(); // Update view if showLang affects it
      expect(component.showLang).toBe(false);

      tick(100); // Advance time by 100ms for the setTimeout
      fixture.detectChanges();
      expect(component.showLang).toBe(true);
      expect(component.langIndex).not.toBe(initialLangIndex);
      expect(component.langIndex).toBe((initialLangIndex + 1) % component.langArray.length);

      fixture.destroy(); // Calls ngOnDestroy, which should stop the interval via takeUntil
      tick(2000); // Ensure no more changes after destroy
    }));
  });

  it('should render app-generic-form-renderer', () => {
    const formRenderer = fixture.nativeElement.querySelector('app-generic-form-renderer');
    expect(formRenderer).toBeTruthy();
  });
});
