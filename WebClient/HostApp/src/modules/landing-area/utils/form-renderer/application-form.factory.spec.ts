import { ApplicationFormFactory } from './application-form.factory';
import { InputForm, DataItem } from '@amarty/models';
import { Validators } from '@angular/forms';

// Mock LOCALIZATION_KEYS
jest.mock('@amarty/localizations', () => ({
  LOCALIZATION_KEYS: {
    COMMON: {
      JOB_TITLE: 'Job Title',
      LOCATION: 'Location',
      SOURCE: 'Source',
      SALARY_RANGE: 'Salary Range',
      TO: 'To',
      CURRENCY: 'Currency',
      POSTED_DATE: 'Posted Date',
      DEADLINE: 'Application Deadline',
      CONTACT_EMAIL: 'Contact Email',
      DESCRIPTION: 'Description',
      NOTES: 'Notes',
      BUTTON: {
        CANCEL: 'Cancel',
        EDIT: 'Edit',
        CREATE: 'Create',
      },
    },
    PROFILE: {
      COMPANY: {
        COMPANY: 'Company',
      },
    },
    EXPERIENCE_LEVEL: {
      EXPERIENCE_LEVEL: 'Experience Level',
    },
    JOB_TYPE: {
      JOB_TYPE: 'Job Type',
    },
    APPLICATION: {
      APPLICATION_LINK: 'Application Link',
    },
  },
}));

describe('ApplicationFormFactory', () => {
  let onSubmitSpy: jest.Mock;
  let onCancelSpy: jest.Mock;
  let mockUser: any;
  let mockExperienceLevels: DataItem[];
  let mockJobTypes: DataItem[];
  let mockJobSources: DataItem[];
  let mockCurrencies: DataItem[];

  beforeEach(() => {
    onSubmitSpy = jest.fn();
    onCancelSpy = jest.fn();
    mockUser = { id: 'test-user' }; // Simple mock user
    mockExperienceLevels = [{ id: 'el1', name: 'Entry Level' }];
    mockJobTypes = [{ id: 'jt1', name: 'Full-time' }];
    mockJobSources = [{ id: 'js1', name: 'LinkedIn' }];
    mockCurrencies = [{ id: 'cur1', name: 'USD' }];
  });

  it('should be defined (static class)', () => {
    expect(ApplicationFormFactory).toBeDefined();
  });

  describe('createApplicationForm', () => {
    it('should return an InputForm object when isEdit is false', () => {
      const form = ApplicationFormFactory.createApplicationForm(
        false,
        mockUser,
        mockExperienceLevels,
        mockJobTypes,
        mockJobSources,
        mockCurrencies,
        onSubmitSpy,
        onCancelSpy
      );
      expect(form).toBeDefined();
      expect(form.constructor.name).toBe('InputForm');
      expect(form.submitButton?.buttonText).toBe(LOCALIZATION_KEYS.COMMON.BUTTON.CREATE);
    });

    it('should return an InputForm object when isEdit is true', () => {
      const form = ApplicationFormFactory.createApplicationForm(
        true,
        mockUser,
        mockExperienceLevels,
        mockJobTypes,
        mockJobSources,
        mockCurrencies,
        onSubmitSpy,
        onCancelSpy
      );
      expect(form).toBeDefined();
      expect(form.constructor.name).toBe('InputForm');
      expect(form.submitButton?.buttonText).toBe(LOCALIZATION_KEYS.COMMON.BUTTON.EDIT);
    });

    it('should configure the submit button with the provided onSubmit callback', () => {
      const form = ApplicationFormFactory.createApplicationForm(
        false,
        mockUser,
        mockExperienceLevels,
        mockJobTypes,
        mockJobSources,
        mockCurrencies,
        onSubmitSpy,
        onCancelSpy
      );
      expect(form.submitButton?.onClick).toBe(onSubmitSpy);
    });

    it('should configure the cancel button with the provided onCancel callback', () => {
      const form = ApplicationFormFactory.createApplicationForm(
        false,
        mockUser,
        mockExperienceLevels,
        mockJobTypes,
        mockJobSources,
        mockCurrencies,
        onSubmitSpy,
        onCancelSpy
      );
      expect(form.cancelButton?.onClick).toBe(onCancelSpy);
    });

    it('should include expected form items with validators', () => {
      const form = ApplicationFormFactory.createApplicationForm(
        false,
        mockUser,
        mockExperienceLevels,
        mockJobTypes,
        mockJobSources,
        mockCurrencies,
        onSubmitSpy,
        onCancelSpy
      );
      
      // Check for a few key items and their validators
      const titleItem = form.grids.flatMap(g => g.items).find(i => i.name === 'title');
      expect(titleItem).toBeDefined();
      expect(titleItem?.validators).toContain(Validators.required);
      expect(titleItem?.validators).toContain(Validators.maxLength(100));

      const companyItem = form.grids.flatMap(g => g.items).find(i => i.name === 'company');
      expect(companyItem).toBeDefined();
      expect(companyItem?.validators).toContain(Validators.required);
      
      const contactEmailItem = form.grids.flatMap(g => g.items).find(i => i.name === 'contactEmail');
      expect(contactEmailItem).toBeDefined();
      expect(contactEmailItem?.validators).toContain(Validators.required);
      expect(contactEmailItem?.validators).toContain(Validators.email);
    });
  });
});
