import { Validators } from '@angular/forms';
import {
  InputForm,
  InputFormBuilder,
  InputFormItemBuilder, UserLanguageResponse, UserSkillResponse
} from '@amarty/models';
import { DataItem } from '@amarty/models';

export class ProfileFormFactory {
  static createSkillForm(
    onSubmit: () => void,
    onCancel: () => void,
    skill: UserSkillResponse | undefined,
    skills?: DataItem[],
    skillLevels?: DataItem[]
  ): InputForm {
    const isEdit = !!skill;
    const formBuilder = new InputFormBuilder();

    if (isEdit) {
      formBuilder
        .addInputItem(new InputFormItemBuilder('skillLevelId', 'autocomplete')
          .withLabel('COMMON.EXPERIENCE_LEVEL')
          .withPlaceholder('COMMON.EXPERIENCE_LEVEL')
          .withValidators([Validators.required])
          .withDataItems(skillLevels ?? [])
          .withDefaultValue(skill?.skillLevelId))
        .addInputItem(new InputFormItemBuilder('skillId', 'autocomplete')
          .withLabel('COMMON.SKILLS')
          .withPlaceholder('COMMON.SKILLS')
          .withValidators([Validators.required])
          .withDataItems(skills ?? [])
          .withDefaultValue(skill?.skillId));
    } else {
      formBuilder
        .addInputItem(new InputFormItemBuilder('skillId', 'autocomplete')
          .withLabel('COMMON.SKILLS')
          .withPlaceholder('COMMON.SKILLS')
          .withValidators([Validators.required])
          .withDataItems(skills ?? []))
        .addInputItem(new InputFormItemBuilder('skillLevelId', 'autocomplete')
          .withLabel('COMMON.EXPERIENCE_LEVEL')
          .withPlaceholder('COMMON.EXPERIENCE_LEVEL')
          .withValidators([Validators.required])
          .withDataItems(skillLevels ?? []));
    }

    return formBuilder
      .setSubmitted(false)
      .setClassName('modal__body grid-1fr grid-gap')
      .withCancelButton({
        buttonText: 'COMMON.CANCEL',
        showButton: true,
        className: 'button__link',
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
    const formBuilder = new InputFormBuilder();

    if (isEdit) {
      formBuilder
        .addInputItem(new InputFormItemBuilder('languageLevelId', 'autocomplete')
          .withLabel('COMMON.LANGUAGE_LEVEL')
          .withPlaceholder('COMMON.LANGUAGE_LEVEL')
          .withValidators([Validators.required])
          .withDefaultValue(language?.languageLevelId)
          .withDataItems(languageLevels ?? []))
        .addInputItem(new InputFormItemBuilder('languageId', 'autocomplete')
          .withLabel('COMMON.LANGUAGE')
          .withPlaceholder('COMMON.LANGUAGE')
          .withValidators([Validators.required])
          .withDefaultValue(language?.languageId)
          .withDataItems(languages ?? []));
    } else {
      formBuilder
        .addInputItem(new InputFormItemBuilder('languageId', 'autocomplete')
          .withLabel('COMMON.LANGUAGE')
          .withPlaceholder('COMMON.LANGUAGE')
          .withValidators([Validators.required])
          .withDataItems(languages ?? []))
        .addInputItem(new InputFormItemBuilder('languageLevelId', 'autocomplete')
          .withLabel('COMMON.LANGUAGE_LEVEL')
          .withPlaceholder('COMMON.LANGUAGE_LEVEL')
          .withValidators([Validators.required])
          .withDataItems(languageLevels ?? []));
    }

    return formBuilder
      .setSubmitted(false)
      .setClassName('modal__body grid-1fr grid-gap')
      .withCancelButton({
        buttonText: 'COMMON.CANCEL',
        showButton: true,
        className: 'button__link',
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
      .addInputItem(new InputFormItemBuilder('email', 'input')
        .withLabel('COMMON.EMAIL')
        .withPlaceholder('COMMON.EMAIL')
        .withDefaultValue(user.email))
      .addInputItem(new InputFormItemBuilder('login', 'input')
        .withLabel('COMMON.LOGIN')
        .withPlaceholder('COMMON.LOGIN')
        .withDefaultValue(user.login))
      .addInputItem(new InputFormItemBuilder('firstName', 'input')
        .withLabel('COMMON.FIRST_NAME')
        .withPlaceholder('COMMON.FIRST_NAME')
        .withDefaultValue(user.firstName))
      .addInputItem(new InputFormItemBuilder('lastName', 'input')
        .withLabel('COMMON.LAST_NAME')
        .withPlaceholder('COMMON.LAST_NAME')
        .withDefaultValue(user.lastName))
      .addInputItem(new InputFormItemBuilder('defaultLocale', 'autocomplete')
        .withLabel('COMMON.LANGUAGE')
        .withPlaceholder('COMMON.LANGUAGE')
        .withDataItems(locales)
        .withDefaultValue(defaultLocaleId))
      .addInputItem(new InputFormItemBuilder('timeZone', 'autocomplete')
        .withLabel('COMMON.TIME_ZONE')
        .withPlaceholder('COMMON.TIME_ZONE')
        .withDataItems([])
        .withDefaultValue(user.userSetting?.timeZone))
      .addInputItem(new InputFormItemBuilder('countryId', 'autocomplete')
        .withLabel('COMMON.COUNTRY')
        .withPlaceholder('COMMON.COUNTRY')
        .withDataItems(countries)
        .withDefaultValue(user.userSetting?.countryId))
      .addInputItem(new InputFormItemBuilder('currencyId', 'autocomplete')
        .withLabel('COMMON.CURRENCY')
        .withPlaceholder('COMMON.CURRENCY')
        .withDataItems(currencies)
        .withDefaultValue(user.userSetting?.currencyId))
      .addInputItem(new InputFormItemBuilder('linkedInUrl', 'input')
        .withLabel('LinkedIn')
        .withPlaceholder('LinkedIn')
        .withDefaultValue(user.userSetting?.linkedInUrl))
      .addInputItem(new InputFormItemBuilder('npmUrl', 'input')
        .withLabel('npm')
        .withPlaceholder('npm')
        .withDefaultValue(user.userSetting?.npmUrl))
      .addInputItem(new InputFormItemBuilder('gitHubUrl', 'input')
        .withLabel('GitHub')
        .withPlaceholder('GitHub')
        .withDefaultValue(user.userSetting?.gitHubUrl))
      .addInputItem(new InputFormItemBuilder('phone', 'input')
        .withLabel('COMMON.PHONE')
        .withPlaceholder('COMMON.PHONE')
        .withDefaultValue(user.phone))
      .addInputItem(new InputFormItemBuilder('applicationAiPrompt', 'checkbox')
        .withLabel('COMMON.APPLICATION_AI_TEXTAREA')
        .withDefaultValue(user.userSetting?.applicationAiPrompt ?? false))
      .setSubmitted(false)
      .setClassName('modal__body grid-2fr grid-gap')
      .withCancelButton({
        buttonText: 'COMMON.CANCEL',
        showButton: true,
        className: 'button__link',
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
}
