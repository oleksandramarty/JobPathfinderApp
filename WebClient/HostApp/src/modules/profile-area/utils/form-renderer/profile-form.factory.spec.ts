import { Validators } from '@angular/forms';
import {
  InputForm,
  UserLanguageResponse,
  UserProfileItemEnum,
  UserProfileItemResponse,
  UserSkillResponse,
  UserResponse,
  DataItem
} from '@amarty/models';
import { LOCALIZATION_KEYS } from '@amarty/localizations';
import { ProfileFormFactory, ProfileFormItemCtrlNames } from './profile-form.factory';

// Mock LOCALIZATION_KEYS
jest.mock('@amarty/localizations', () => ({
  LOCALIZATION_KEYS: {
    COMMON: {
      POSITION: 'Position',
      START_DATE: 'Start Date',
      END_DATE: 'End Date',
      ISSUE_DATE: 'Issue Date',
      EXPIRATION_DATE: 'Expiration Date',
      LOCATION: 'Location',
      COUNTRY: 'Country',
      DESCRIPTION: 'Description',
      SKILLS: 'Skills',
      LANGUAGE: 'Language',
      EMAIL: 'Email',
      LOGIN: 'Login',
      FIRST_NAME: 'First Name',
      LAST_NAME: 'Last Name',
      CURRENCY: 'Currency',
      TIME_ZONE: 'Time Zone',
      PHONE: 'Phone',
      BUTTON: {
        CANCEL: 'Cancel',
        PROCEED: 'Proceed',
        UPDATE: 'Update',
      },
    },
    PROFILE: {
      COMPANY: { COMPANY: 'Company' },
      EDUCATION: { FIELD_OF_STUDY: 'Field of Study', INSTITUTION: 'Institution' },
      CERTIFICATION: { CERTIFICATION: 'Certification', ISSUER: 'Issuer' },
      PROJECT: { PROJECT: 'Project' },
      ACHIEVEMENT: { ACHIEVEMENT: 'Achievement' },
      SECTION: { AUTH_SECTION: 'Auth Section', PRIMARY_INFO: 'Primary Info', SECONDARY_INFO: 'Secondary Info', AI: 'AI Section' },
      HEADLINE: 'Headline',
      SHOW_CURRENT_POSITION: 'Show Current Position',
      SHOW_HIGHEST_EDUCATION: 'Show Highest Education',
      LINKS: 'Links',
      APPLICATION: { AI_TEXTAREA: 'AI Text Area' }
    },
    JOB_TYPE: { JOB_TYPE: 'Job Type' },
    WORK_ARRANGEMENT: { WORK_ARRANGEMENT: 'Work Arrangement' },
    SKILL_LEVEL: { SKILL_LEVEL: 'Skill Level' },
    LANGUAGE_LEVEL: { LANGUAGE_LEVEL: 'Language Level' },
  },
}));

describe('ProfileFormItemCtrlNames', () => {
  it('should set correct names for UserProfileItemEnum.Experience (default)', () => {
    const names = new ProfileFormItemCtrlNames(UserProfileItemEnum.Experience);
    expect(names.position).toBe(LOCALIZATION_KEYS.COMMON.POSITION);
    expect(names.company).toBe(LOCALIZATION_KEYS.PROFILE.COMPANY.COMPANY);
  });

  it('should set correct names for UserProfileItemEnum.Education', () => {
    const names = new ProfileFormItemCtrlNames(UserProfileItemEnum.Education);
    expect(names.position).toBe(LOCALIZATION_KEYS.PROFILE.EDUCATION.FIELD_OF_STUDY);
    expect(names.company).toBe(LOCALIZATION_KEYS.PROFILE.EDUCATION.INSTITUTION);
  });

  it('should set correct names for UserProfileItemEnum.Certification', () => {
    const names = new ProfileFormItemCtrlNames(UserProfileItemEnum.Certification);
    expect(names.position).toBe(LOCALIZATION_KEYS.PROFILE.CERTIFICATION.CERTIFICATION);
    expect(names.startDate).toBe(LOCALIZATION_KEYS.COMMON.ISSUE_DATE);
  });
   // Add more tests for other enums if necessary
});

describe('ProfileFormFactory', () => {
  let onSubmitSpy: jest.Mock;
  let onCancelSpy: jest.Mock;

  beforeEach(() => {
    onSubmitSpy = jest.fn();
    onCancelSpy = jest.fn();
  });

  describe('createSkillForm', () => {
    const mockSkills: DataItem[] = [{ id: 's1', name: 'Skill1' }];
    const mockSkillLevels: DataItem[] = [{ id: 'sl1', name: 'Level1' }];

    it('should create an InputForm for adding a new skill', () => {
      const form = ProfileFormFactory.createSkillForm(onSubmitSpy, onCancelSpy, undefined, mockSkills, mockSkillLevels);
      expect(form).toBeInstanceOf(InputForm);
      expect(form.submitButton?.onClick).toBe(onSubmitSpy);
      expect(form.cancelButton?.onClick).toBe(onCancelSpy);
      // Check a form item
      const skillIdItem = form.grids[0].items.find(i => i.name === 'skillId');
      expect(skillIdItem).toBeDefined();
      expect(skillIdItem?.validators).toContain(Validators.required);
    });

    it('should create an InputForm for editing an existing skill', () => {
      const existingSkill: UserSkillResponse = { id: 'uskill1', skillId: 1, skill: 'Angular', skillLevelId: 2, level: 5 };
      const form = ProfileFormFactory.createSkillForm(onSubmitSpy, onCancelSpy, existingSkill, mockSkills, mockSkillLevels);
      expect(form).toBeInstanceOf(InputForm);
      const skillLevelIdItem = form.grids[0].items.find(i => i.name === 'skillLevelId');
      expect(skillLevelIdItem?.defaultValue).toBe(existingSkill.skillLevelId);
       // Items are reordered in edit mode
      expect(form.grids[0].items[0].name).toBe('skillLevelId');
      expect(form.grids[0].items[1].name).toBe('skillId');
    });
  });

  describe('createLanguageForm', () => {
    const mockLanguages: DataItem[] = [{ id: 'l1', name: 'English' }];
    const mockLanguageLevels: DataItem[] = [{ id: 'll1', name: 'Native' }];

    it('should create an InputForm for adding a new language', () => {
      const form = ProfileFormFactory.createLanguageForm(onSubmitSpy, onCancelSpy, undefined, mockLanguages, mockLanguageLevels);
      expect(form).toBeInstanceOf(InputForm);
      const languageIdItem = form.grids[0].items.find(i => i.name === 'languageId');
      expect(languageIdItem).toBeDefined();
    });
    
    it('should create an InputForm for editing an existing language', () => {
      const existingLanguage: UserLanguageResponse = { id: 'ulang1', languageId: 1, language: 'English', languageLevelId: 2, level: 'Native' };
      const form = ProfileFormFactory.createLanguageForm(onSubmitSpy, onCancelSpy, existingLanguage, mockLanguages, mockLanguageLevels);
      expect(form).toBeInstanceOf(InputForm);
      const languageLevelIdItem = form.grids[0].items.find(i => i.name === 'languageLevelId');
      expect(languageLevelIdItem?.defaultValue).toBe(existingLanguage.languageLevelId);
      expect(form.grids[0].items[0].name).toBe('languageLevelId'); // Edit mode reorders
      expect(form.grids[0].items[1].name).toBe('languageId');
    });
  });

  describe('createUserPreferencesForm', () => {
    const mockUser: UserResponse = { id: 'u1', login: 'test', email: 'test@test.com', userSetting: { currencyId: 1, showCurrentPosition: true } };
    const mockLocales: DataItem[] = [{ id: 'loc1', name: 'en-US' }];
    const mockCountries: DataItem[] = [{ id: 'c1', name: 'USA' }];
    const mockCurrencies: DataItem[] = [{ id: 'cur1', name: 'USD' }];

    it('should create an InputForm for user preferences', () => {
      const form = ProfileFormFactory.createUserPreferencesForm(1, mockUser, mockLocales, mockCountries, mockCurrencies, onSubmitSpy, onCancelSpy);
      expect(form).toBeInstanceOf(InputForm);
      const emailItem = form.grids.flatMap(g => g.items).find(i => i.name === 'email');
      expect(emailItem?.defaultValue).toBe(mockUser.email);
      const showPosItem = form.grids.flatMap(g => g.items).find(i => i.name === 'showCurrentPosition');
      expect(showPosItem?.defaultValue).toBe(true);
    });
  });

  describe('createProfileItemForm', () => {
    const mockCountries: DataItem[] = [{ id: 'c1', name: 'USA' }];
    const mockJobTypes: DataItem[] = [{ id: 'jt1', name: 'Full-time' }];
    const mockWorkArrangements: DataItem[] = [{ id: 'wa1', name: 'Remote' }];
    const mockProfileItem: UserProfileItemResponse = {
      id: 'item1',
      profileItemType: UserProfileItemEnum.Experience,
      position: 'Dev',
      company: 'Amarty',
      countryId: 1,
      jobTypeId: 1,
      workArrangementId: 1
    };

    it('should create an InputForm for a profile item (e.g., Experience)', () => {
      const form = ProfileFormFactory.createProfileItemForm(
        UserProfileItemEnum.Experience,
        mockProfileItem,
        mockCountries,
        mockJobTypes,
        mockWorkArrangements,
        onSubmitSpy,
        onCancelSpy
      );
      expect(form).toBeInstanceOf(InputForm);
      const positionItem = form.grids.flatMap(g => g.items).find(i => i.name === 'position');
      expect(positionItem?.defaultValue).toBe(mockProfileItem.position);
      expect(positionItem?.label).toBe(LOCALIZATION_KEYS.COMMON.POSITION); // From ProfileFormItemCtrlNames
    });
  });
});
