import { FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { DataItem, InputError } from './data-item.model';

export type InputType =
  | 'input'
  | 'select'
  | 'textarea'
  | 'password'
  | 'datepicker'
  | 'rangedatepicker'
  | 'radio'
  | 'checkbox'
  | 'autocomplete'
  | 'multiautocomplete'
  | null;

export interface InputFormItem {
  controlName?: string;
  inputType?: InputType;
  label?: string;
  placeholder?: string;
  className?: string;
  hint?: string;
  icon?: string;
  rows?: number;
  cols?: number;
  maxLength?: number;
  minLength?: number;
  minDate?: Date;
  maxDate?: Date;
  dataItems?: DataItem[];
  mode?: 'inline' | 'block' | null;
  errorArray?: InputError[];
  defaultValue?: any;
  validators?: ValidatorFn[];
  hidden?: boolean | undefined;
}

export interface InputFormItemGrid {
  title?: string | undefined;
  titleClass?: string | undefined;
  inputItems: InputFormItem[];
  gridCount?: 1 | 2 | 3 | 4;
}

export interface InputForm {
  inputFormGroup?: FormGroup;
  submitted?: boolean;
  className?: string;
  gridItems?: InputFormItemGrid[];
  resetButton?: InputFormAction;
  submitButton?: InputFormAction;
  cancelButton?: InputFormAction;
  onChange?: (form: FormGroup) => void;
  hasButtons?: boolean;
}

export interface InputFormAction {
  buttonText?: string;
  onClick?: () => void;
  isDisabled?: boolean;
  showButton?: boolean;
  className?: string;
}

export class InputFormItemBuilder {
  private _item: InputFormItem;

  constructor(controlName: string, inputType: InputType | null = 'input') {
    this._item = {
      controlName,
      inputType,
    };
  }

  withLabel(label: string): this {
    this._item.label = label;
    return this;
  }

  withPlaceholder(placeholder: string): this {
    this._item.placeholder = placeholder;
    return this;
  }

  withClassName(className: string): this {
    this._item.className = className;
    return this;
  }

  withHint(hint: string): this {
    this._item.hint = hint;
    return this;
  }

  withIcon(icon: string): this {
    this._item.icon = icon;
    return this;
  }

  withRows(rows: number): this {
    this._item.rows = rows;
    return this;
  }

  withCols(cols: number): this {
    this._item.cols = cols;
    return this;
  }

  withMaxLength(maxLength: number): this {
    this._item.maxLength = maxLength;
    return this;
  }

  withMinLength(minLength: number): this {
    this._item.minLength = minLength;
    return this;
  }

  withMinDate(minDate: Date): this {
    this._item.minDate = minDate;
    return this;
  }

  withMaxDate(maxDate: Date): this {
    this._item.maxDate = maxDate;
    return this;
  }

  withDataItems(dataItems: DataItem[]): this {
    this._item.dataItems = dataItems;
    return this;
  }

  withMode(mode: 'inline' | 'block' | null): this {
    this._item.mode = mode;
    return this;
  }

  withErrors(errors: InputError[]): this {
    this._item.errorArray = errors;
    return this;
  }

  withDefaultValue(value: any): this {
    this._item.defaultValue = value;
    return this;
  }

  withHidden(hidden: boolean = true): this {
    this._item.hidden = hidden;
    return this;
  }

  withValidators(validators: ValidatorFn[]): this {
    this._item.validators = validators;
    return this;
  }

  build(): InputFormItem {
    return this._item;
  }
}

export class InputFormGridBuilder {
  private _title?: string;
  private _titleClass?: string;
  private _inputItems: InputFormItem[] = [];
  private _gridCount: 1 | 2 | 3 | 4 = 1;

  withTitle(title: string): this {
    this._title = title;
    return this;
  }

  withTitleClass(titleClass: string): this {
    this._titleClass = titleClass;
    return this;
  }

  withGridCount(count: 1 | 2 | 3 | 4): this {
    this._gridCount = count;
    return this;
  }

  addItem(builder: InputFormItemBuilder): this {
    this._inputItems.push(builder.build());
    return this;
  }

  addItems(builders: InputFormItemBuilder[]): this {
    this._inputItems.push(...builders.map(b => b.build()));
    return this;
  }

  build(): InputFormItemGrid {
    return {
      title: this._title,
      titleClass: this._titleClass,
      gridCount: this._gridCount,
      inputItems: this._inputItems,
    };
  }
}

export class InputFormBuilder {
  private _gridItems: InputFormItemGrid[] = [];
  private _submitted = false;
  private _className = '';
  private _submitButton?: InputFormAction;
  private _resetButton?: InputFormAction;
  private _cancelButton?: InputFormAction;
  private _onChange?: (form: FormGroup) => void;

  addGrid(gridBuilder: InputFormGridBuilder): this {
    this._gridItems.push(gridBuilder.build());
    return this;
  }

  withSubmitButton(action: InputFormAction): this {
    this._submitButton = action;
    return this;
  }

  withResetButton(action: InputFormAction): this {
    this._resetButton = action;
    return this;
  }

  withCancelButton(action: InputFormAction): this {
    this._cancelButton = action;
    return this;
  }

  setSubmitted(value: boolean): this {
    this._submitted = value;
    return this;
  }

  setClassName(className: string): this {
    this._className = className;
    return this;
  }

  onFormChange(callback: (form: FormGroup) => void): this {
    this._onChange = callback;
    return this;
  }

  build(): InputForm {
    const flatItems = this._gridItems.flatMap(grid => grid.inputItems);

    const group: Record<string, FormControl> = {};
    for (const item of flatItems) {
      if (item.controlName) {
        group[item.controlName] = new FormControl(
          item.defaultValue ?? null,
          item.validators ?? []
        );
      }
    }

    const formGroup = new FormGroup(group);

    if (this._onChange) {
      formGroup.valueChanges.subscribe(() => this._onChange?.(formGroup));
    }

    return {
      inputFormGroup: formGroup,
      submitted: this._submitted,
      className: this._className,
      gridItems: this._gridItems,
      submitButton: this._submitButton,
      resetButton: this._resetButton,
      cancelButton: this._cancelButton,
      onChange: this._onChange,
      hasButtons: !!this._submitButton || !!this._cancelButton,
    };
  }
}

export class InputFormActionBuilder {
  private action: InputFormAction = {};

  withText(text: string): this {
    this.action.buttonText = text;
    return this;
  }

  onClick(callback: () => void): this {
    this.action.onClick = callback;
    return this;
  }

  isDisabled(value: boolean): this {
    this.action.isDisabled = value;
    return this;
  }

  show(value: boolean): this {
    this.action.showButton = value;
    return this;
  }

  withClass(className: string): this {
    this.action.className = className;
    return this;
  }

  build(): InputFormAction {
    return this.action;
  }
}
