import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core';
import { BaseUnsubscribeComponent } from '../../common/base-unsubscribe.compoinent';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataItem, InputError } from '@amarty/models';
import { CommonModule } from '@angular/common';
import { generateRandomId } from '@amarty/utils';

export type InputType =
  'input' |
  'select' |
  'textarea' |
  'password' |
  'datepicker' |
  'radio' |
  'checkbox' |
  null;

@Component({
  selector: 'app-generic-input',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './generic-input.component.html',
  styleUrl: './generic-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  host: { 'data-id': generateRandomId(12) }
})
export class GenericInputComponent extends BaseUnsubscribeComponent {
  @Input() className: string | undefined;
  @Input() type: InputType = 'input';
  @Input() placeholder: string | undefined;
  @Input() hint: string | undefined;
  @Input() icon: string | undefined;
  @Input() label: string | undefined;
  @Input() rows: number | undefined;
  @Input() cols: number | undefined;
  @Input() maxLength: number | undefined;
  @Input() minLength: number | undefined;
  @Input() minDate: Date | undefined;
  @Input() maxDate: Date | undefined;
  @Input() formGroup: FormGroup | undefined;
  @Input() controlName: string = 'inputControl';
  @Input() dataItems: DataItem[] | undefined;
  @Input() mode: 'inline' | 'block' | null = 'block';
  @Input() errorArray: InputError[] | undefined;
  @Input() submitted: boolean = true;

  internalFormGroup: FormGroup | undefined;

  inputId: string | undefined;

  constructor() {
    super();

    this.inputId = generateRandomId(12);

    if (this.dataItems) {
      this.dataItems.sort((a, b) => (b.isImportant ? 1 : 0) - (a.isImportant ? 1 : 0));
    }
  }

  protected readonly value = signal('');
  hide = signal(true);

  protected onInput(event: Event) {
    this.value.set((event.target as HTMLInputElement).value);
  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  override ngOnInit(): void {
    if (!this.formGroup) {
      this.formGroup = new FormGroup({
        inputControl: new FormControl(null)
      });
    }
  }

  get currentControl(): any {
    return this.formGroup?.get(this.controlName);
  }

  get isInvalid(): boolean {
    return (this.submitted && (this.currentControl?.errors || this.errorArray)) ?? false;
  }

  get currentValue(): any {
    return this.formGroup?.get(this.controlName)?.value ?? undefined;
  }

  get isRequired(): boolean {
    return this.currentControl?.hasValidator(Validators.required) ?? false;
  }

  get isDisabled(): boolean {
    return this.currentControl.disabled ?? false;
  }

  public showDebugInfo(): void {
    console.log(this.formGroup);
    console.log(this.currentControl);
    console.log(this.currentValue);
    console.log(this.dataItems)
  }
}
