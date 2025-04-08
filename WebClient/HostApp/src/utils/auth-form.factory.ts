import { Validators } from '@angular/forms';
import {
  InputForm,
  InputFormBuilder,
  InputFormItemBuilder
} from '@amarty/models';

export class AuthFormFactory {
  static createSignInForm(onCancel: () => void, onSubmit: () => void): InputForm {
    return new InputFormBuilder()
      .addGridItem([
        new InputFormItemBuilder('loginEmail', 'input')
          .withPlaceholder('COMMON.LOGIN_OR_EMAIL')
          .withValidators([Validators.required]),
        new InputFormItemBuilder('password', 'password')
          .withPlaceholder('COMMON.PASSWORD')
          .withValidators([Validators.required]),
        new InputFormItemBuilder('rememberMe', 'checkbox')
          .withLabel('COMMON.REMEMBER_ME')
          .withDefaultValue(false)
      ],
      1
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
      .addGridItem([
        new InputFormItemBuilder('email', 'input')
          .withPlaceholder('COMMON.EMAIL')
          .withValidators([Validators.required, Validators.email]),
        new InputFormItemBuilder('login', 'input')
          .withPlaceholder('COMMON.LOGIN')
          .withValidators([Validators.required])
      ],
      1
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
      .addGridItem([
        new InputFormItemBuilder('firstName', 'input')
          .withPlaceholder('COMMON.FIRST_NAME')
          .withValidators([Validators.required]),
        new InputFormItemBuilder('lastName', 'input')
          .withPlaceholder('COMMON.LAST_NAME'),
        new InputFormItemBuilder('email', 'input')
          .withPlaceholder('COMMON.EMAIL')
          .withValidators([Validators.required, Validators.email]),
        new InputFormItemBuilder('confirmEmail', 'input')
          .withPlaceholder('COMMON.CONFIRM_EMAIL')
          .withValidators([Validators.required, Validators.email]),
        new InputFormItemBuilder('newPassword', 'password')
          .withPlaceholder('COMMON.PASSWORD')
          .withValidators([Validators.required]),
        new InputFormItemBuilder('confirmNewPassword', 'password')
          .withPlaceholder('COMMON.CONFIRM_PASSWORD')
          .withValidators([Validators.required]),
        new InputFormItemBuilder('noComplaints', 'checkbox')
          .withLabel('COMMON.NO_COMPLAINTS')
          .withValidators([Validators.requiredTrue])
      ],
      2
      )
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
