import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core';
import { BaseUnsubscribeComponent } from '@amarty/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataItem, InputError, InputType } from '@amarty/models';
import { AsyncPipe, CommonModule } from '@angular/common';
import {generateRandomId} from '@amarty/utils';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocomplete, MatAutocompleteModule, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatOption } from '@angular/material/core';
import { debounceTime, filter, Observable, startWith, takeUntil, tap } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatChipsModule } from '@angular/material/chips';
import { LocalizationService } from '@amarty/services';
import { TranslationPipe } from '@amarty/pipes';
import { TranslationDirective } from '@amarty/directives';

@Component({
  selector: 'app-generic-input',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    AsyncPipe,
    FormsModule,
    MatAutocomplete,
    MatAutocompleteTrigger,
    MatOption,
    MatAutocompleteModule,
    MatChipsModule,
    TranslationPipe,
    TranslationDirective
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

  filteredDataItems: Observable<DataItem[] | undefined> | undefined;
  selectedDataItems: DataItem[] = [];

  internalFormGroup: FormGroup | undefined;

  inputId: string | undefined;

  constructor(
    private readonly localizationService: LocalizationService
  ) {
    super();

    this.inputId = generateRandomId(12);

    if (this.dataItems) {
      this.dataItems.sort((a, b) => (b.isImportant ? 1 : 0) - (a.isImportant ? 1 : 0));
    }

    this.displayFn = this.displayFn.bind(this);
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

    if (this.type === 'autocomplete' || this.type === 'multiautocomplete') {
      this.internalFormGroup = new FormGroup({
        autocomplete: new FormControl(this.dataItems?.find(x => x.id === this.currentValue))
      });

      this.type === 'autocomplete' && this.formGroup.get(this.controlName)?.valueChanges
        .pipe(
          takeUntil(this.ngUnsubscribe),
          filter(value => !value),
          tap((value) => this.internalFormGroup?.get('autocomplete')?.setValue(undefined)),
        )
        .subscribe();

      if (!!this.currentValue) {
        const initialItem = this.dataItems?.find(item => item.id === String(this.currentValue));
        if (initialItem) {
          this.internalFormGroup?.get('autocomplete')?.setValue(initialItem);
        }
      }

      this.filteredDataItems = this.internalFormGroup?.get('autocomplete')?.valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        map(value => {
          const name = typeof value === 'string' ? value : value?.name;
          return name && name.length >= 2 ? this._filterAutoComplete(name as string) : this.dataItems?.slice();
        }),
      );
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

  displayFn(dataItem: DataItem): string {
    return this.localizationService.getTranslation(dataItem?.name) ?? '';
  }

  private _filterAutoComplete(name: string): DataItem[] | undefined {
    const filterValue = name.toLowerCase();

    if (this.formGroup?.get(this.controlName)!.value ===
      this.internalFormGroup?.get('autocomplete')?.value?.id) {
      return this.dataItems;
    }

    return this.dataItems?.filter(item =>
      item.filteredFields?.some(field => field?.toLowerCase().includes(filterValue)) ||
      item.id?.toLowerCase().includes(filterValue) ||
      item.name?.toLowerCase().includes(filterValue));
  }

  public onAutoCompleteChecked(): void {
    if (this.type === 'multiautocomplete') {
      if (this.internalFormGroup?.get('autocomplete')?.value) {
        const newItem = this.internalFormGroup?.get('autocomplete')?.value;
        if (!this.selectedDataItems.some(item => item.id === newItem.id)) {
          this.selectedDataItems.push(newItem);
        }
        this.formGroup?.get(this.controlName)?.setValue(this.selectedDataItems.map(x => x.id).join(','));
      }
      this.internalFormGroup?.get('autocomplete')?.setValue(null);

      this.internalFormGroup?.get('autocomplete')?.setErrors(this.formGroup?.get(this.controlName)?.errors ?? null);
    }

    if (this.type === 'autocomplete') {
      this.formGroup?.get(this.controlName)?.setValue(this.internalFormGroup?.get('autocomplete')?.value?.id);
    }
  }

  removeOnAutoComplete(item: DataItem): void {
    const index = this.selectedDataItems?.indexOf(item);
    if (index >= 0) {
      this.selectedDataItems.splice(index, 1);
      this.formGroup?.get(this.controlName)?.setValue(this.selectedDataItems.map(x => x.id).join(','));
      this.internalFormGroup?.get('autocomplete')?.setErrors(this.formGroup?.get(this.controlName)?.errors ?? null);
    }
  }

  toggleChildrenSelection(item: DataItem, selected: boolean): void {
    const index = this.selectedDataItems.findIndex(selectedItem => selectedItem.id === item.id);
    if (selected && index === -1) {
      this.selectedDataItems.push(item);
    } else if (!selected && index !== -1) {
      this.selectedDataItems.splice(index, 1);
    }

    if (item.children) {
      item.children.forEach(child => {
        const childIndex = this.selectedDataItems.findIndex(selectedItem => selectedItem.id === child.id);
        if (selected && childIndex === -1) {
          this.selectedDataItems.push(child);
        } else if (!selected && childIndex !== -1) {
          this.selectedDataItems.splice(childIndex, 1);
        }
        this.toggleChildrenSelection(child, selected);
      });
    }
    this.formGroup?.get(this.controlName)?.setValue(this.selectedDataItems.map(x => x.id));
  }

  public showDebugInfo(): void {
    console.log(this.formGroup);
    console.log(this.currentControl);
    console.log(this.currentValue);
    console.log(this.dataItems)
  }
}
