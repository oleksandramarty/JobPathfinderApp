import { Validators } from '@angular/forms';
import {
  InputForm,
  InputFormBuilder,
  InputFormItemBuilder,
  InputFormGridBuilder,
  UserLanguageResponse,
  UserProfileItemEnum,
  UserProfileItemResponse,
  UserSkillResponse
} from '@amarty/models';
import { DataItem } from '@amarty/models';
import { LOCALIZATION_KEYS } from '@amarty/localizations';

export interface IProfileFormItemCtrlNames {
  position: string;
  company: string;
  startDate: string;
  endDate: string;
  location: string;
  country: string;
  jobType: string;
  workArrangement: string;
  description: string;
}

export class ProfileFormItemCtrlNames implements IProfileFormItemCtrlNames {
  position: string;
  company: string;
  startDate: string;
  endDate: string;
  location: string;
  country: string;
  jobType: string;
  workArrangement: string;
  description: string;

  constructor(itemType: UserProfileItemEnum) {
    switch (itemType) {
    case UserProfileItemEnum.Education:
      this.position = LOCALIZATION_KEYS.PROFILE.EDUCATION.FIELD_OF_STUDY;
      this.company = LOCALIZATION_KEYS.PROFILE.EDUCATION.INSTITUTION;
      this.startDate = LOCALIZATION_KEYS.COMMON.START_DATE;
      this.endDate = LOCALIZATION_KEYS.COMMON.END_DATE;
      break;
    case UserProfileItemEnum.Certification:
      this.position = LOCALIZATION_KEYS.PROFILE.CERTIFICATION.CERTIFICATION;
      this.company = LOCALIZATION_KEYS.PROFILE.CERTIFICATION.ISSUER;
      this.startDate = LOCALIZATION_KEYS.COMMON.ISSUE_DATE;
      this.endDate = LOCALIZATION_KEYS.COMMON.EXPIRATION_DATE;
      break;
    case UserProfileItemEnum.Project:
      this.position = LOCALIZATION_KEYS.PROFILE.PROJECT.PROJECT;
      this.company = LOCALIZATION_KEYS.PROFILE.COMPANY.COMPANY;
      this.startDate = LOCALIZATION_KEYS.COMMON.START_DATE;
      this.endDate = LOCALIZATION_KEYS.COMMON.END_DATE;
      break;
    case UserProfileItemEnum.Achievement:
      this.position = LOCALIZATION_KEYS.PROFILE.ACHIEVEMENT.ACHIEVEMENT;
      this.company = LOCALIZATION_KEYS.PROFILE.COMPANY.COMPANY;
      this.startDate = LOCALIZATION_KEYS.COMMON.START_DATE;
      this.endDate = LOCALIZATION_KEYS.COMMON.END_DATE;
      break;
    default:
      this.position = LOCALIZATION_KEYS.COMMON.POSITION;
      this.company = LOCALIZATION_KEYS.PROFILE.COMPANY.COMPANY;
      this.startDate = LOCALIZATION_KEYS.COMMON.START_DATE;
      this.endDate = LOCALIZATION_KEYS.COMMON.END_DATE;
      break;
    }

    this.location = LOCALIZATION_KEYS.COMMON.LOCATION;
    this.country = LOCALIZATION_KEYS.COMMON.COUNTRY;
    this.jobType = LOCALIZATION_KEYS.JOB_TYPE.JOB_TYPE;
    this.workArrangement = LOCALIZATION_KEYS.WORK_ARRANGEMENT.WORK_ARRANGEMENT;
    this.description = LOCALIZATION_KEYS.COMMON.DESCRIPTION;
  }
}

export class ProfileFormFactory {
  static createSkillForm(
    onSubmit: () => void,
    onCancel: () => void,
    skill: UserSkillResponse | undefined,
    skills?: DataItem[],
    skillLevels?: DataItem[]
  ): InputForm {
    const isEdit = !!skill;

    const skillIdInput = new InputFormItemBuilder('skillId', 'autocomplete')
      .withLabel(LOCALIZATION_KEYS.COMMON.SKILLS)
      .withPlaceholder(LOCALIZATION_KEYS.COMMON.SKILLS)
      .withValidators([Validators.required])
      .withDataItems(skills ?? [])
      .withDefaultValue(skill?.skillId);

    const skillLevelIdInput = new InputFormItemBuilder('skillLevelId', 'autocomplete')
      .withLabel(LOCALIZATION_KEYS.SKILL_LEVEL.SKILL_LEVEL)
      .withPlaceholder(LOCALIZATION_KEYS.SKILL_LEVEL.SKILL_LEVEL)
      .withValidators([Validators.required])
      .withDataItems(skillLevels ?? [])
      .withDefaultValue(skill?.skillLevelId);

    return new InputFormBuilder()
      .addGrid(new InputFormGridBuilder()
        .withGridCount(1)
        .addItems(isEdit ?
          [skillLevelIdInput, skillIdInput] :
          [skillIdInput, skillLevelIdInput])
      )
      .setSubmitted(false)
      .setClassName('modal__body grid-1fr grid-gap')
      .withCancelButton({
        buttonText: LOCALIZATION_KEYS.COMMON.BUTTON.CANCEL,
        showButton: true,
        className: 'button__unfilled__submit',
        onClick: onCancel
      })
      .withSubmitButton({
        buttonText: LOCALIZATION_KEYS.COMMON.BUTTON.PROCEED,
        showButton: true,
        className: 'button__filled__submit',
        onClick: onSubmit
      })
      .build();
  }

  static createLanguageForm(
    onSubmit: () => void,
    onCancel: () => void,
    language?: UserLanguageResponse,
    languages?: DataItem[],
    languageLevels?: DataItem[]
  ): InputForm {
    const isEdit = !!language;

    const languageIdInput = new InputFormItemBuilder('languageId', 'autocomplete')
      .withLabel(LOCALIZATION_KEYS.COMMON.LANGUAGE)
      .withPlaceholder(LOCALIZATION_KEYS.COMMON.LANGUAGE)
      .withValidators([Validators.required])
      .withDataItems(languages ?? [])
      .withDefaultValue(language?.languageId);

    const languageLevelIdInput = new InputFormItemBuilder('languageLevelId', 'autocomplete')
      .withLabel(LOCALIZATION_KEYS.LANGUAGE_LEVEL.LANGUAGE_LEVEL)
      .withPlaceholder(LOCALIZATION_KEYS.LANGUAGE_LEVEL.LANGUAGE_LEVEL)
      .withValidators([Validators.required])
      .withDataItems(languageLevels ?? [])
      .withDefaultValue(language?.languageLevelId);

    return new InputFormBuilder()
      .addGrid(new InputFormGridBuilder()
        .withGridCount(1)
        .addItems(isEdit ?
          [languageLevelIdInput, languageIdInput] :
          [languageIdInput, languageLevelIdInput])
      )
      .setSubmitted(false)
      .setClassName('modal__body grid-1fr grid-gap')
      .withCancelButton({
        buttonText: LOCALIZATION_KEYS.COMMON.BUTTON.CANCEL,
        showButton: true,
        className: 'button__unfilled__submit',
        onClick: onCancel
      })
      .withSubmitButton({
        buttonText: LOCALIZATION_KEYS.COMMON.BUTTON.PROCEED,
        showButton: true,
        className: 'button__filled__submit',
        onClick: onSubmit
      })
      .build();
  }

  static createUserPreferencesForm(
    defaultLocaleId: number,
    user: any,
    locales: DataItem[],
    countries: DataItem[],
    currencies: DataItem[],
    onSubmit: () => void,
    onCancel: () => void
  ): InputForm {
    return new InputFormBuilder()
      .addGrid(new InputFormGridBuilder()
        .withGridCount(2)
        .withTitle(LOCALIZATION_KEYS.PROFILE.SECTION.AUTH_SECTION)
        .withTitleClass('section__title')
        .addItems([
          new InputFormItemBuilder('email', 'input')
            .withLabel(LOCALIZATION_KEYS.COMMON.EMAIL)
            .withPlaceholder(LOCALIZATION_KEYS.COMMON.EMAIL)
            .withDefaultValue(user.email),
          new InputFormItemBuilder('login', 'input')
            .withLabel(LOCALIZATION_KEYS.COMMON.LOGIN)
            .withPlaceholder(LOCALIZATION_KEYS.COMMON.LOGIN)
            .withDefaultValue(user.login),
        ]))
      .addGrid(new InputFormGridBuilder()
        .withGridCount(2)
        .withTitle(LOCALIZATION_KEYS.PROFILE.SECTION.PRIMARY_INFO)
        .withTitleClass('section__title')
        .addItems([
          new InputFormItemBuilder('firstName', 'input')
            .withLabel(LOCALIZATION_KEYS.COMMON.FIRST_NAME)
            .withPlaceholder(LOCALIZATION_KEYS.COMMON.FIRST_NAME)
            .withDefaultValue(user.firstName),
          new InputFormItemBuilder('lastName', 'input')
            .withLabel(LOCALIZATION_KEYS.COMMON.LAST_NAME)
            .withPlaceholder(LOCALIZATION_KEYS.COMMON.LAST_NAME)
            .withDefaultValue(user.lastName),
        ]))
      .addGrid(new InputFormGridBuilder()
        .withGridCount(1)
        .addItems([
          new InputFormItemBuilder('headline', 'input')
            .withLabel(LOCALIZATION_KEYS.PROFILE.HEADLINE)
            .withPlaceholder(LOCALIZATION_KEYS.PROFILE.HEADLINE)
            .withDefaultValue(user.headline)
        ]))
      .addGrid(new InputFormGridBuilder()
        .withGridCount(2)
        .withTitle(LOCALIZATION_KEYS.PROFILE.SECTION.SECONDARY_INFO)
        .withTitleClass('section__title')
        .addItems([
          new InputFormItemBuilder('defaultLocale', 'autocomplete')
            .withLabel(LOCALIZATION_KEYS.COMMON.LANGUAGE)
            .withPlaceholder(LOCALIZATION_KEYS.COMMON.LANGUAGE)
            .withDataItems(locales)
            .withDefaultValue(defaultLocaleId),
          new InputFormItemBuilder('currencyId', 'autocomplete')
            .withLabel(LOCALIZATION_KEYS.COMMON.CURRENCY)
            .withPlaceholder(LOCALIZATION_KEYS.COMMON.CURRENCY)
            .withDataItems(currencies)
            .withDefaultValue(user.userSetting?.currencyId),
          new InputFormItemBuilder('timeZone', 'autocomplete')
            .withLabel(LOCALIZATION_KEYS.COMMON.TIME_ZONE)
            .withPlaceholder(LOCALIZATION_KEYS.COMMON.TIME_ZONE)
            .withDataItems([])
            .withDefaultValue(user.userSetting?.timeZone),
          new InputFormItemBuilder('countryId', 'autocomplete')
            .withLabel(LOCALIZATION_KEYS.COMMON.COUNTRY)
            .withPlaceholder(LOCALIZATION_KEYS.COMMON.COUNTRY)
            .withDataItems(countries)
            .withDefaultValue(user.userSetting?.countryId),
        ]))
      .addGrid(new InputFormGridBuilder()
        .withGridCount(3)
        .withTitle(LOCALIZATION_KEYS.PROFILE.LINKS)
        .withTitleClass('section__title')
        .addItems([
          new InputFormItemBuilder('linkedInUrl', 'input')
            .withLabel('LinkedIn')
            .withPlaceholder('LinkedIn')
            .withDefaultValue(user.userSetting?.linkedInUrl),
          new InputFormItemBuilder('npmUrl', 'input')
            .withLabel('npm')
            .withPlaceholder('npm')
            .withDefaultValue(user.userSetting?.npmUrl),
          new InputFormItemBuilder('gitHubUrl', 'input')
            .withLabel('GitHub')
            .withPlaceholder('GitHub')
            .withDefaultValue(user.userSetting?.gitHubUrl)
        ]))
      .addGrid(new InputFormGridBuilder()
        .withGridCount(2)
        .withTitle(LOCALIZATION_KEYS.PROFILE.LINKS)
        .withTitleClass('section__title')
        .addItems([
          new InputFormItemBuilder('phone', 'input')
            .withLabel(LOCALIZATION_KEYS.COMMON.PHONE)
            .withPlaceholder(LOCALIZATION_KEYS.COMMON.PHONE)
            .withDefaultValue(user.phone)
        ]))
      .addGrid(new InputFormGridBuilder()
        .withGridCount(1)
        .withTitle(LOCALIZATION_KEYS.PROFILE.SECTION.AI)
        .withTitleClass('section__title')
        .addItems([
          new InputFormItemBuilder('applicationAiPrompt', 'checkbox')
            .withLabel(LOCALIZATION_KEYS.PROFILE.APPLICATION.AI_TEXTAREA)
            .withDefaultValue(user.userSetting?.applicationAiPrompt ?? false)
        ]))
      .setSubmitted(false)
      .setClassName('modal__body grid-1fr grid-gap')
      .withCancelButton({
        buttonText: LOCALIZATION_KEYS.COMMON.BUTTON.CANCEL,
        showButton: true,
        className: 'button__unfilled__submit',
        onClick: onCancel
      })
      .withSubmitButton({
        buttonText: LOCALIZATION_KEYS.COMMON.BUTTON.UPDATE,
        showButton: true,
        className: 'button__filled__submit',
        onClick: onSubmit
      })
      .build();
  }

  static createProfileItemForm(
    profileItemType: UserProfileItemEnum,
    profileItem: UserProfileItemResponse | undefined,
    countries: DataItem[],
    jobTypes: DataItem[],
    workArrangements: DataItem[],
    onSubmit: () => void,
    onCancel: () => void
  ): InputForm {
    const ctrlNames = new ProfileFormItemCtrlNames(profileItemType);
    return new InputFormBuilder()
      .addGrid(new InputFormGridBuilder()
        .withGridCount(1)
        .addItems([
          new InputFormItemBuilder('id', 'input')
            .withDefaultValue(profileItem?.id)
            .withHidden(),
          new InputFormItemBuilder('profileItemType', 'input')
            .withDefaultValue(profileItemType)
            .withHidden(),
          new InputFormItemBuilder('position', 'input')
            .withLabel(ctrlNames.position)
            .withPlaceholder(ctrlNames.position)
            .withValidators([Validators.required])
            .withDefaultValue(profileItem?.position),
          new InputFormItemBuilder('company', 'input')
            .withLabel(ctrlNames.company)
            .withPlaceholder(ctrlNames.company)
            .withValidators([Validators.required])
            .withDefaultValue(profileItem?.company)
        ])
      )
      .addGrid(new InputFormGridBuilder()
        .withGridCount(2)
        .addItems([
          new InputFormItemBuilder('startDate', 'datepicker')
            .withLabel(ctrlNames.startDate)
            .withValidators([Validators.required])
            .withDefaultValue(profileItem?.startDate),
          new InputFormItemBuilder('endDate', 'datepicker')
            .withLabel(ctrlNames.endDate)
            .withDefaultValue(profileItem?.endDate),
          new InputFormItemBuilder('location', 'input')
            .withLabel(ctrlNames.location)
            .withPlaceholder(ctrlNames.location)
            .withDefaultValue(profileItem?.location),
          new InputFormItemBuilder('countryId', 'autocomplete')
            .withLabel(ctrlNames.country)
            .withPlaceholder(ctrlNames.country)
            .withDataItems(countries)
            .withValidators([Validators.required])
            .withDefaultValue(profileItem?.countryId),
          new InputFormItemBuilder('jobTypeId', 'autocomplete')
            .withLabel(ctrlNames.jobType)
            .withPlaceholder(ctrlNames.jobType)
            .withDataItems(jobTypes)
            .withValidators([Validators.required])
            .withDefaultValue(profileItem?.jobTypeId),
          new InputFormItemBuilder('workArrangementId', 'autocomplete')
            .withLabel(ctrlNames.workArrangement)
            .withPlaceholder(ctrlNames.workArrangement)
            .withDataItems(workArrangements)
            .withValidators([Validators.required])
            .withDefaultValue(profileItem?.workArrangementId)
        ])
      )
      .addGrid(new InputFormGridBuilder()
        .withGridCount(1)
        .addItem(
          new InputFormItemBuilder('description', 'textarea')
            .withLabel(ctrlNames.description)
            .withRows(2)
            .withMaxLength(500)
            .withDefaultValue(profileItem?.description)
        )
      )
      .setSubmitted(false)
      .setClassName('modal__body grid-1fr grid-gap')
      .withCancelButton({
        buttonText: LOCALIZATION_KEYS.COMMON.BUTTON.CANCEL,
        showButton: true,
        className: 'button__unfilled__submit',
        onClick: onCancel
      })
      .withSubmitButton({
        buttonText: LOCALIZATION_KEYS.COMMON.BUTTON.PROCEED,
        showButton: true,
        className: 'button__filled__submit',
        onClick: onSubmit
      })
      .build();
  }
}
