import {
  InputForm,
  InputFormBuilder,
  InputFormGridBuilder,
  InputFormItemBuilder
} from '@amarty/models';
import { Validators } from '@angular/forms';
import { DataItem } from '@amarty/models';
import { LOCALIZATION_KEYS } from '@amarty/localizations';

export class ApplicationFormFactory {
  static createApplicationForm(
    isEdit: boolean,
    user: any,
    experienceLevels: DataItem[],
    jobTypes: DataItem[],
    jobSources: DataItem[],
    currencies: DataItem[],
    onSubmit: () => void,
    onCancel: () => void
  ): InputForm {
    return new InputFormBuilder()
      .addGrid(new InputFormGridBuilder()
        .withGridCount(3)
        .addItems([
          new InputFormItemBuilder('title', 'input')
            .withLabel(LOCALIZATION_KEYS.COMMON.JOB_TITLE)
            .withPlaceholder(LOCALIZATION_KEYS.COMMON.JOB_TITLE)
            .withValidators([Validators.required, Validators.maxLength(100)]),
          new InputFormItemBuilder('company', 'input')
            .withLabel(LOCALIZATION_KEYS.PROFILE.COMPANY.COMPANY)
            .withValidators([Validators.required]),
          new InputFormItemBuilder('location', 'input')
            .withLabel(LOCALIZATION_KEYS.COMMON.LOCATION)
            .withValidators([Validators.required]),
          new InputFormItemBuilder('experienceLevel', 'autocomplete')
            .withLabel(LOCALIZATION_KEYS.EXPERIENCE_LEVEL.EXPERIENCE_LEVEL)
            .withDataItems(experienceLevels)
            .withValidators([Validators.required]),
          new InputFormItemBuilder('jobType', 'autocomplete')
            .withLabel(LOCALIZATION_KEYS.JOB_TYPE.JOB_TYPE)
            .withDataItems(jobTypes)
            .withValidators([Validators.required]),
          new InputFormItemBuilder('source', 'autocomplete')
            .withLabel(LOCALIZATION_KEYS.COMMON.SOURCE)
            .withDataItems(jobSources)
            .withValidators([Validators.required]),
          new InputFormItemBuilder('salaryFrom', 'input')
            .withLabel(LOCALIZATION_KEYS.COMMON.SALARY_RANGE)
            .withValidators([Validators.min(0)]),
          new InputFormItemBuilder('salaryTo', 'input')
            .withLabel(' ')
            .withPlaceholder(LOCALIZATION_KEYS.COMMON.TO)
            .withValidators([Validators.min(0)]),
          new InputFormItemBuilder('currency', 'autocomplete')
            .withLabel(LOCALIZATION_KEYS.COMMON.CURRENCY)
            .withDataItems(currencies),
          new InputFormItemBuilder('postedDate', 'datepicker')
            .withLabel(LOCALIZATION_KEYS.COMMON.POSTED_DATE)
            .withValidators([Validators.required])
            .withDefaultValue(new Date()),
          new InputFormItemBuilder('applicationDeadline', 'datepicker')
            .withLabel(LOCALIZATION_KEYS.COMMON.DEADLINE),
          new InputFormItemBuilder('contactEmail', 'input')
            .withLabel(LOCALIZATION_KEYS.COMMON.CONTACT_EMAIL)
            .withValidators([Validators.required, Validators.email]),
        ]))
      .addGrid(new InputFormGridBuilder()
        .withGridCount(1)
        .addItem(
          new InputFormItemBuilder('applicationLink', 'input')
            .withLabel(LOCALIZATION_KEYS.APPLICATION.APPLICATION_LINK)
            .withPlaceholder(LOCALIZATION_KEYS.APPLICATION.APPLICATION_LINK)
            .withValidators([Validators.pattern('https?://.+')])
        ))
      .addGrid(new InputFormGridBuilder()
        .withGridCount(2)
        .addItems([
          new InputFormItemBuilder('description', 'textarea')
            .withLabel(LOCALIZATION_KEYS.COMMON.DESCRIPTION)
            .withMinLength(10)
            .withValidators([Validators.required]),
          new InputFormItemBuilder('notes', 'textarea')
            .withLabel(LOCALIZATION_KEYS.COMMON.NOTES)
            .withMinLength(10)
        ])
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
        buttonText: isEdit
          ? LOCALIZATION_KEYS.COMMON.BUTTON.EDIT
          : LOCALIZATION_KEYS.COMMON.BUTTON.CREATE,
        showButton: true,
        className: 'button__filled__submit',
        onClick: onSubmit
      })
      .build();
  }
}
