import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { GenericInputComponent } from '../generic-input/generic-input.component';
import { InputForm, InputFormItem } from '@amarty/models';
import { TranslationPipe } from '@amarty/pipes';

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
  styleUrl: './generic-form-renderer.component.css'
})
export class GenericFormRendererComponent {
  @Input() renderForm: InputForm | undefined;
  @Input() showButtons: boolean = true;

  get safeInputItems(): InputFormItem[] {
    return Array.isArray(this.renderForm?.inputItems) ? this.renderForm!.inputItems! : [];
  }

  isGroup(item: InputFormItem): boolean {
    return !!item.children && item.children.length > 0;
  }
}
