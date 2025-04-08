import { Validators } from '@angular/forms';
import {
  InputForm,
  InputFormBuilder,
  InputFormItemBuilder,
  InputFormGridBuilder
} from '@amarty/models';

export class AuthFormFactory {
  static createSignInForm(onCancel: () => void, onSubmit: () => void): InputForm {
    return new InputFormBuilder()
      .addGrid(new InputFormGridBuilder()
        .withGridCount(1)
        .addItem(
          new InputFormItemBuilder('loginEmail', 'input')
            .withPlaceholder('COMMON.LOGIN_OR_EMAIL')
            .withValidators([Validators.required])
        )
        .addItem(
          new InputFormItemBuilder('password', 'password')
            .withPlaceholder('COMMON.PASSWORD')
            .withValidators([Validators.required])
        )
        .addItem(
          new InputFormItemBuilder('rememberMe', 'checkbox')
            .withLabel('COMMON.REMEMBER_ME')
            .withDefaultValue(false)
        ))
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
      .addGrid(new InputFormGridBuilder()
        .withGridCount(1)
        .addItem(
          new InputFormItemBuilder('email', 'input')
            .withPlaceholder('COMMON.EMAIL')
            .withValidators([Validators.required, Validators.email])
        )
        .addItem(
          new InputFormItemBuilder('login', 'input')
            .withPlaceholder('COMMON.LOGIN')
            .withValidators([Validators.required])
        ))
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
      .addGrid(new InputFormGridBuilder()
        .withGridCount(2)
        .addItem(
          new InputFormItemBuilder('firstName', 'input')
            .withPlaceholder('COMMON.FIRST_NAME')
            .withValidators([Validators.required])
        )
        .addItem(
          new InputFormItemBuilder('lastName', 'input')
            .withPlaceholder('COMMON.LAST_NAME')
        )
        .addItem(
          new InputFormItemBuilder('email', 'input')
            .withPlaceholder('COMMON.EMAIL')
            .withValidators([Validators.required, Validators.email])
        )
        .addItem(
          new InputFormItemBuilder('confirmEmail', 'input')
            .withPlaceholder('COMMON.CONFIRM_EMAIL')
            .withValidators([Validators.required, Validators.email])
        )
        .addItem(
          new InputFormItemBuilder('newPassword', 'password')
            .withPlaceholder('COMMON.PASSWORD')
            .withValidators([Validators.required])
        )
        .addItem(
          new InputFormItemBuilder('confirmNewPassword', 'password')
            .withPlaceholder('COMMON.CONFIRM_PASSWORD')
            .withValidators([Validators.required])
        )
        .addItem(
          new InputFormItemBuilder('noComplaints', 'checkbox')
            .withLabel('COMMON.NO_COMPLAINTS')
            .withValidators([Validators.requiredTrue])
        ))
      .setSubmitted(false)
      .setClassName('container__box__body grid-1fr')
      .withSubmitButton({
        buttonText: 'COMMON.SIGN_UP',
        showButton: true,
        className: 'button__filled__submit',
        onClick: onSubmit,
      })
      .build();
  }
}
