import { Validators } from '@angular/forms';
import {
  InputForm,
  InputFormBuilder,
  InputFormItemBuilder
} from '@amarty/models';

export class AuthFormFactory {
  static createSignInForm(onCancel: () => void, onSubmit: () => void): InputForm {
    return new InputFormBuilder()
      .addInputItem(
        new InputFormItemBuilder('loginEmail', 'input')
          .withPlaceholder('COMMON.LOGIN_OR_EMAIL')
          .withValidators([Validators.required])
      )
      .addInputItem(
        new InputFormItemBuilder('password', 'password')
          .withPlaceholder('COMMON.PASSWORD')
          .withValidators([Validators.required])
      )
      .addInputItem(
        new InputFormItemBuilder('rememberMe', 'checkbox')
          .withLabel('COMMON.REMEMBER_ME')
          .withDefaultValue(false)
      )
      .setSubmitted(false)
      .setClassName('container__box__body')
      .withCancelButton({
        buttonText: 'COMMON.FORGOT',
        showButton: true,
        className: 'button__link',
        onClick: onCancel,
      })
      .withSubmitButton({
        buttonText: 'COMMON.SIGN_IN',
        showButton: true,
        className: 'button__filled__submit',
        onClick: onSubmit,
      })
      .build();
  }

  static createForgotForm(onCancel: () => void, onSubmit: () => void): InputForm {
    return new InputFormBuilder()
      .addInputItem(
        new InputFormItemBuilder('email', 'input')
          .withPlaceholder('COMMON.EMAIL')
          .withValidators([Validators.required, Validators.email])
      )
      .addInputItem(
        new InputFormItemBuilder('login', 'input')
          .withPlaceholder('COMMON.LOGIN')
          .withValidators([Validators.required])
      )
      .setSubmitted(false)
      .setClassName('container__box__body')
      .withCancelButton({
        buttonText: 'COMMON.SIGN_IN',
        showButton: true,
        className: 'button__link',
        onClick: onCancel,
      })
      .withSubmitButton({
        buttonText: 'COMMON.PROCEED',
        showButton: true,
        className: 'button__filled__submit',
        onClick: onSubmit,
      })
      .build();
  }

  static createSignUpForm(onSubmit: () => void): InputForm {
    return new InputFormBuilder()
      .addInputItem(new InputFormItemBuilder('firstName', 'input')
        .withPlaceholder('COMMON.FIRST_NAME')
        .withValidators([Validators.required]))

      .addInputItem(new InputFormItemBuilder('lastName', 'input')
        .withPlaceholder('COMMON.LAST_NAME'))

      .addInputItem(new InputFormItemBuilder('email', 'input')
        .withPlaceholder('COMMON.EMAIL')
        .withValidators([Validators.required, Validators.email]))

      .addInputItem(new InputFormItemBuilder('confirmEmail', 'input')
        .withPlaceholder('COMMON.CONFIRM_EMAIL')
        .withValidators([Validators.required, Validators.email]))

      .addInputItem(new InputFormItemBuilder('newPassword', 'password')
        .withPlaceholder('COMMON.PASSWORD')
        .withValidators([Validators.required]))

      .addInputItem(new InputFormItemBuilder('confirmNewPassword', 'password')
        .withPlaceholder('COMMON.CONFIRM_PASSWORD')
        .withValidators([Validators.required]))

      .addInputItem(new InputFormItemBuilder('noComplaints', 'checkbox')
        .withLabel('COMMON.NO_COMPLAINTS')
        .withValidators([Validators.requiredTrue]))

      .setSubmitted(false)
      .setClassName('container__box__body grid-2fr')
      .withSubmitButton({
        buttonText: 'COMMON.SIGN_UP',
        showButton: true,
        className: 'button__filled__submit',
        onClick: onSubmit,
      })
      .build();
  }
}
