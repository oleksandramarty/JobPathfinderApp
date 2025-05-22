import { AuthFormFactory } from './auth-form.factory';
import { InputForm } from '@amarty/models'; // Assuming InputForm is the correct type
import { Validators } from '@angular/forms'; // Used by the factory, might be needed for spies or checks

// Mock LOCALIZATION_KEYS if they are directly used in a way that affects test logic beyond simple placeholders
jest.mock('@amarty/localizations', () => ({
  LOCALIZATION_KEYS: {
    AUTH: {
      SIGN_IN: {
        LOGIN_OR_EMAIL: 'Login or Email',
        REMEMBER_ME: 'Remember me',
        SIGN_IN: 'Sign In',
      },
      FORGOT: 'Forgot Password?',
    },
    COMMON: {
      PASSWORD: 'Password',
      EMAIL: 'Email',
      LOGIN: 'Login',
      BUTTON: {
        PROCEED: 'Proceed',
      },
      FIRST_NAME: 'First Name',
      LAST_NAME: 'Last Name',
      CONFIRM_EMAIL: 'Confirm Email',
      CONFIRM_PASSWORD: 'Confirm Password',
      NO_COMPLAINTS: 'No Complaints',
      SIGN_UP: 'Sign Up',
    },
  },
}));


describe('AuthFormFactory', () => {
  let onCancelSpy: jest.Mock;
  let onSubmitSpy: jest.Mock;

  beforeEach(() => {
    onCancelSpy = jest.fn();
    onSubmitSpy = jest.fn();
  });

  it('should be defined (static class)', () => {
    expect(AuthFormFactory).toBeDefined();
  });

  describe('createSignInForm', () => {
    it('should return an InputForm object', () => {
      const form = AuthFormFactory.createSignInForm(onCancelSpy, onSubmitSpy);
      expect(form).toBeDefined();
      expect(form.constructor.name).toBe('InputForm'); // Or check for specific properties of InputForm
    });

    it('should configure the submit button with the provided callback', () => {
      const form = AuthFormFactory.createSignInForm(onCancelSpy, onSubmitSpy);
      expect(form.submitButton?.onClick).toBe(onSubmitSpy);
    });

    it('should configure the cancel button with the provided callback', () => {
      const form = AuthFormFactory.createSignInForm(onCancelSpy, onSubmitSpy);
      expect(form.cancelButton?.onClick).toBe(onCancelSpy);
    });
  });

  describe('createForgotForm', () => {
    it('should return an InputForm object', () => {
      const form = AuthFormFactory.createForgotForm(onCancelSpy, onSubmitSpy);
      expect(form).toBeDefined();
      expect(form.constructor.name).toBe('InputForm');
    });

    it('should configure the submit button with the provided callback', () => {
      const form = AuthFormFactory.createForgotForm(onCancelSpy, onSubmitSpy);
      expect(form.submitButton?.onClick).toBe(onSubmitSpy);
    });

    it('should configure the cancel button with the provided callback', () => {
      const form = AuthFormFactory.createForgotForm(onCancelSpy, onSubmitSpy);
      expect(form.cancelButton?.onClick).toBe(onCancelSpy);
    });
  });

  describe('createSignUpForm', () => {
    it('should return an InputForm object', () => {
      const form = AuthFormFactory.createSignUpForm(onSubmitSpy);
      expect(form).toBeDefined();
      expect(form.constructor.name).toBe('InputForm');
    });

    it('should configure the submit button with the provided callback', () => {
      const form = AuthFormFactory.createSignUpForm(onSubmitSpy);
      expect(form.submitButton?.onClick).toBe(onSubmitSpy);
    });

    it('should have required validators for login, email, newPassword, and noComplaints', () => {
        const form = AuthFormFactory.createSignUpForm(onSubmitSpy);
        const loginItem = form.grids.find(g => g.items.find(i => i.name === 'login'))?.items.find(i => i.name === 'login');
        const emailItem = form.grids.find(g => g.items.find(i => i.name === 'email'))?.items.find(i => i.name === 'email');
        const passwordItem = form.grids.find(g => g.items.find(i => i.name === 'newPassword'))?.items.find(i => i.name === 'newPassword');
        const noComplaintsItem = form.grids.find(g => g.items.find(i => i.name === 'noComplaints'))?.items.find(i => i.name === 'noComplaints');

        expect(loginItem?.validators).toContain(Validators.required);
        expect(emailItem?.validators).toContain(Validators.required);
        expect(emailItem?.validators).toContain(Validators.email);
        expect(passwordItem?.validators).toContain(Validators.required);
        expect(noComplaintsItem?.validators).toContain(Validators.requiredTrue);
    });
  });
});
