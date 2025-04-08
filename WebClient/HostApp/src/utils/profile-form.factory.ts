import { Validators } from '@angular/forms';
import {
  InputForm,
  InputFormBuilder,
  InputFormItemBuilder,
  UserLanguageResponse, UserProfileItemEnum, UserProfileItemResponse,
  UserSkillResponse
} from '@amarty/models';
import { DataItem } from '@amarty/models';

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
        this.position = 'COMMON.FIELD_OF_STUDY';
        this.company = 'COMMON.INSTITUTION';
        this.startDate = 'COMMON.START_DATE';
        this.endDate = 'COMMON.END_DATE';
        break;
      case UserProfileItemEnum.Certification:
        this.position = 'COMMON.CERTIFICATION';
        this.company = 'COMMON.ISSUER';
        this.startDate = 'COMMON.ISSUE_DATE';
        this.endDate = 'COMMON.EXPIRATION_DATE';
        break;
      case UserProfileItemEnum.Project:
        this.position = 'COMMON.PROJECT';
        this.company = 'COMMON.COMPANY';
        this.startDate = 'COMMON.START_DATE';
        this.endDate = 'COMMON.END_DATE';
        break;
      case UserProfileItemEnum.Achievement:
        this.position = 'COMMON.ACHIEVEMENT';
        this.company = 'COMMON.COMPANY';
        this.startDate = 'COMMON.START_DATE';
        this.endDate = 'COMMON.END_DATE';
        break;
      default:
        this.position = 'COMMON.POSITION';
        this.company = 'COMMON.COMPANY';
        this.startDate = 'COMMON.START_DATE';
        this.endDate = 'COMMON.END_DATE';
        break;
    }

    this.location = 'COMMON.LOCATION';
    this.country = 'COMMON.COUNTRY';
    this.jobType = 'COMMON.JOB_TYPE';
    this.workArrangement = 'COMMON.WORK_ARRANGEMENT';
    this.description = 'COMMON.DESCRIPTION';
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
      .withLabel('COMMON.SKILLS')
      .withPlaceholder('COMMON.SKILLS')
      .withValidators([Validators.required])
      .withDataItems(skills ?? [])
      .withDefaultValue(skill?.skillId);

    const skillLevelIdInput = new InputFormItemBuilder('skillLevelId', 'autocomplete')
      .withLabel('COMMON.EXPERIENCE_LEVEL')
      .withPlaceholder('COMMON.EXPERIENCE_LEVEL')
      .withValidators([Validators.required])
      .withDataItems(skillLevels ?? [])
      .withDefaultValue(skill?.skillLevelId);

    return new InputFormBuilder()
      .addGridItem(
        (isEdit ? [skillLevelIdInput, skillIdInput] : [skillIdInput, skillLevelIdInput]),
        1)
      .setSubmitted(false)
      .setClassName('modal__body grid-1fr grid-gap')
      .withCancelButton({
        buttonText: 'COMMON.CANCEL',
        showButton: true,
        className: 'button__unfilled__submit',
        onClick: onCancel
      })
      .withSubmitButton({
        buttonText: 'COMMON.PROCEED',
        showButton: true,
        className: 'button__filled__submit',
        onClick: onSubmit
      })
      .build();
  }

  static createLanguageForm(
    onSubmit: () => void,
    onCancel: () => void,
    language?: UserLanguageResponse | undefined,
    languages?: DataItem[],
    languageLevels?: DataItem[]
  ): InputForm {
    const isEdit = !!language;

    const languageIdInput = new InputFormItemBuilder('languageId', 'autocomplete')
      .withLabel('COMMON.LANGUAGE')
      .withPlaceholder('COMMON.LANGUAGE')
      .withValidators([Validators.required])
      .withDataItems(languages ?? [])
      .withDefaultValue(language?.languageId);

    const languageLevelIdInput = new InputFormItemBuilder('languageLevelId', 'autocomplete')
      .withLabel('COMMON.LANGUAGE_LEVEL')
      .withPlaceholder('COMMON.LANGUAGE_LEVEL')
      .withValidators([Validators.required])
      .withDataItems(languageLevels ?? [])
      .withDefaultValue(language?.languageLevelId);

    return new InputFormBuilder()
      .addGridItem(
        (isEdit ? [languageLevelIdInput, languageIdInput] : [languageIdInput, languageLevelIdInput]),
        1)
      .setSubmitted(false)
      .setClassName('modal__body grid-1fr grid-gap')
      .withCancelButton({
        buttonText: 'COMMON.CANCEL',
        showButton: true,
        className: 'button__unfilled__submit',
        onClick: onCancel
      })
      .withSubmitButton({
        buttonText: 'COMMON.PROCEED',
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
      .addGridItem([
        new InputFormItemBuilder('email', 'input')
          .withLabel('COMMON.EMAIL')
          .withPlaceholder('COMMON.EMAIL')
          .withDefaultValue(user.email),
        new InputFormItemBuilder('login', 'input')
          .withLabel('COMMON.LOGIN')
          .withPlaceholder('COMMON.LOGIN')
          .withDefaultValue(user.login),
        new InputFormItemBuilder('firstName', 'input')
          .withLabel('COMMON.FIRST_NAME')
          .withPlaceholder('COMMON.FIRST_NAME')
          .withDefaultValue(user.firstName),
        new InputFormItemBuilder('lastName', 'input')
          .withLabel('COMMON.LAST_NAME')
          .withPlaceholder('COMMON.LAST_NAME')
          .withDefaultValue(user.lastName),
        new InputFormItemBuilder('defaultLocale', 'autocomplete')
          .withLabel('COMMON.LANGUAGE')
          .withPlaceholder('COMMON.LANGUAGE')
          .withDataItems(locales)
          .withDefaultValue(defaultLocaleId),
        new InputFormItemBuilder('timeZone', 'autocomplete')
          .withLabel('COMMON.TIME_ZONE')
          .withPlaceholder('COMMON.TIME_ZONE')
          .withDataItems([])
          .withDefaultValue(user.userSetting?.timeZone),
        new InputFormItemBuilder('countryId', 'autocomplete')
          .withLabel('COMMON.COUNTRY')
          .withPlaceholder('COMMON.COUNTRY')
          .withDataItems(countries)
          .withDefaultValue(user.userSetting?.countryId),
        new InputFormItemBuilder('currencyId', 'autocomplete')
          .withLabel('COMMON.CURRENCY')
          .withPlaceholder('COMMON.CURRENCY')
          .withDataItems(currencies)
          .withDefaultValue(user.userSetting?.currencyId),
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
          .withDefaultValue(user.userSetting?.gitHubUrl),
        new InputFormItemBuilder('phone', 'input')
          .withLabel('COMMON.PHONE')
          .withPlaceholder('COMMON.PHONE')
          .withDefaultValue(user.phone),
        new InputFormItemBuilder('applicationAiPrompt', 'checkbox')
          .withLabel('COMMON.APPLICATION_AI_TEXTAREA')
          .withDefaultValue(user.userSetting?.applicationAiPrompt ?? false)
      ],
      2
      )
      .setSubmitted(false)
      .setClassName('modal__body grid-1fr grid-gap')
      .withCancelButton({
        buttonText: 'COMMON.CANCEL',
        showButton: true,
        className: 'button__unfilled__submit',
        onClick: onCancel
      })
      .withSubmitButton({
        buttonText: 'COMMON.UPDATE',
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
    return new InputFormBuilder().addGridItem([
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
    ], 1)
      .addGridItem([
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
          .withDefaultValue(profileItem?.workArrangementId),
      ], 2)
      .addGridItem([
        new InputFormItemBuilder('description', 'textarea')
          .withLabel(ctrlNames.description)
          .withRows(2)
          .withMaxLength(500)
          .withDefaultValue(profileItem?.description)
      ], 1)
      .setSubmitted(false)
      .setClassName('modal__body grid-1fr grid-gap')
      .withCancelButton({
        buttonText: 'COMMON.CANCEL',
        showButton: true,
        className: 'button__unfilled__submit',
        onClick: onCancel
      })
      .withSubmitButton({
        buttonText: 'COMMON.PROCEED',
        showButton: true,
        className: 'button__filled__submit',
        onClick: onSubmit
      }).build();
  }
}
