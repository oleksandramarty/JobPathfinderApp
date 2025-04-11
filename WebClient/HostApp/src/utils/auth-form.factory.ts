import { Validators } from '@angular/forms';
import {
  InputForm,
  InputFormBuilder,
  InputFormItemBuilder,
  InputFormGridBuilder
} from '@amarty/models';
import {LOCALIZATION_KEYS} from "@amarty/localizations";

export class AuthFormFactory {
  static createSignInForm(onCancel: () => void, onSubmit: () => void): InputForm {
    return new InputFormBuilder()
      .addGrid(new InputFormGridBuilder()
        .withGridCount(1)
        .addItem(
          new InputFormItemBuilder('loginEmail', 'input')
            .withPlaceholder(LOCALIZATION_KEYS.AUTH.SIGN_IN.LOGIN_OR_EMAIL)
            .withValidators([Validators.required])
        )
        .addItem(
          new InputFormItemBuilder('password', 'password')
            .withPlaceholder(LOCALIZATION_KEYS.COMMON.PASSWORD)
            .withValidators([Validators.required])
        )
        .addItem(
          new InputFormItemBuilder('rememberMe', 'checkbox')
            .withLabel(LOCALIZATION_KEYS.AUTH.SIGN_IN.REMEMBER_ME)
            .withDefaultValue(false)
        ))
      .setSubmitted(false)
      .setClassName('container__box__body')
      .withCancelButton({
        buttonText: LOCALIZATION_KEYS.AUTH.FORGOT,
        showButton: true,
        className: 'button__link',
        onClick: onCancel,
      })
      .withSubmitButton({
        buttonText: LOCALIZATION_KEYS.AUTH.SIGN_IN.SIGN_IN,
        showButton: true,
        className: 'button__filled__submit',
        onClick: onSubmit,
      })
      .build();
  }

  static createForgotForm(onCancel: () => void, onSubmit: () => void): InputForm {
    return new InputFormBuilder()
      .addGrid(new InputFormGridBuilder()
        .withGridCount(1)
        .addItem(
          new InputFormItemBuilder('email', 'input')
            .withPlaceholder(LOCALIZATION_KEYS.COMMON.EMAIL)
            .withValidators([Validators.required, Validators.email])
        )
        .addItem(
          new InputFormItemBuilder('login', 'input')
            .withPlaceholder(LOCALIZATION_KEYS.COMMON.LOGIN)
            .withValidators([Validators.required])
        ))
      .setSubmitted(false)
      .setClassName('container__box__body')
      .withCancelButton({
        buttonText: LOCALIZATION_KEYS.AUTH.SIGN_IN.SIGN_IN,
        showButton: true,
        className: 'button__link',
        onClick: onCancel,
      })
      .withSubmitButton({
        buttonText: LOCALIZATION_KEYS.COMMON.BUTTON.PROCEED,
        showButton: true,
        className: 'button__filled__submit',
        onClick: onSubmit,
      })
      .build();
  }

  static createSignUpForm(onSubmit: () => void): InputForm {
    return new InputFormBuilder()
      .addGrid(new InputFormGridBuilder()
        .withGridCount(2)
        .addItem(
          new InputFormItemBuilder('firstName', 'input')
            .withPlaceholder(LOCALIZATION_KEYS.COMMON.FIRST_NAME)
            .withValidators([Validators.required])
        )
        .addItem(
          new InputFormItemBuilder('lastName', 'input')
            .withPlaceholder(LOCALIZATION_KEYS.COMMON.LAST_NAME)
        )
        .addItem(
          new InputFormItemBuilder('email', 'input')
            .withPlaceholder(LOCALIZATION_KEYS.COMMON.EMAIL)
            .withValidators([Validators.required, Validators.email])
        )
        .addItem(
          new InputFormItemBuilder('confirmEmail', 'input')
            .withPlaceholder(LOCALIZATION_KEYS.COMMON.CONFIRM_EMAIL)
            .withValidators([Validators.required, Validators.email])
        )
        .addItem(
          new InputFormItemBuilder('newPassword', 'password')
            .withPlaceholder(LOCALIZATION_KEYS.COMMON.PASSWORD)
            .withValidators([Validators.required])
        )
        .addItem(
          new InputFormItemBuilder('confirmNewPassword', 'password')
            .withPlaceholder(LOCALIZATION_KEYS.COMMON.CONFIRM_PASSWORD)
            .withValidators([Validators.required])
        )
        .addItem(
          new InputFormItemBuilder('noComplaints', 'checkbox')
            .withLabel(LOCALIZATION_KEYS.COMMON.NO_COMPLAINTS)
            .withValidators([Validators.requiredTrue])
        ))
      .setSubmitted(false)
      .setClassName('container__box__body grid-1fr')
      .withSubmitButton({
        buttonText: LOCALIZATION_KEYS.COMMON.SIGN_UP,
        showButton: true,
        className: 'button__filled__submit',
        onClick: onSubmit,
      })
      .build();
  }
}
