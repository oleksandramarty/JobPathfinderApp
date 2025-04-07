import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { GenericInputComponent } from '../generic-input/generic-input.component';
import { InputForm, InputFormItem } from '@amarty/models';
import { TranslationPipe } from '@amarty/pipes';
import { BaseUnsubscribeComponent } from '@amarty/common';
import {takeUntil, tap} from 'rxjs';

@Component({
  selector: 'app-generic-form-renderer',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    GenericInputComponent,
    TranslationPipe,
    TranslationPipe,
    TranslationPipe,
    TranslationPipe
  ],
  templateUrl: './generic-form-renderer.component.html',
  styleUrl: './generic-form-renderer.component.scss'
})
export class GenericFormRendererComponent extends BaseUnsubscribeComponent {
  @Input() renderForm: InputForm | undefined;
  @Input() showButtons: boolean = true;

  constructor() {
    super();
  }

  override ngOnInit(): void {
    if (!!this.renderForm?.onChange) {
      this.renderForm.inputFormGroup?.valueChanges
        .pipe(
          takeUntil(this.ngUnsubscribe),
          tap(() => {
            this.renderForm!.onChange!(this.renderForm!.inputFormGroup!.value);
          }
        ))
        .subscribe();
    }
    super.ngOnInit();
  }

  get safeInputItems(): InputFormItem[] {
    return Array.isArray(this.renderForm?.inputItems) ? this.renderForm!.inputItems! : [];
  }

  isGroup(item: InputFormItem): boolean {
    return !!item.children && item.children.length > 0;
  }
}
