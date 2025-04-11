import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { debounceTime, filter, Observable, startWith, takeUntil, tap } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule, MatDatepickerIntl } from '@angular/material/datepicker';
import { MatNativeDateModule, DateAdapter } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { DataItem, InputError, InputType } from '@amarty/models';
import { generateRandomId } from '@amarty/utils';
import { LocalizationService } from '@amarty/services';
import { TranslationPipe } from '@amarty/pipes';
import { TranslationDirective } from '@amarty/directives';
import { BaseUnsubscribeComponent } from '@amarty/common';
import {LOCALIZATION_KEYS} from '@amarty/localizations';

@Component({
  selector: 'app-generic-input',
  standalone: true,
  templateUrl: './generic-input.component.html',
  styleUrl: './generic-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-id': generateRandomId(12)
  },
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    TranslationPipe,
    TranslationDirective
  ]
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
    private readonly localizationService: LocalizationService,
    private readonly adapter: DateAdapter<unknown>,
    private readonly intl: MatDatepickerIntl
  ) {
    super();
    this.inputId = generateRandomId(12);
    this.displayFn = this.displayFn.bind(this);
  }

  protected readonly value = signal('');
  hide = signal(true);

  override ngOnInit(): void {
    if (!this.formGroup) {
      if (this.type === 'rangedatepicker') {
        this.formGroup = new FormGroup({
          start: new FormControl(null),
          end: new FormControl(null)
        });
      } else {
        this.formGroup = new FormGroup({
          [this.controlName]: new FormControl(null)
        });
      }
    }

    if (this.dataItems) {
      this.dataItems.sort((a, b) => (b.isImportant ? 1 : 0) - (a.isImportant ? 1 : 0));
    }

    if (this.type === 'autocomplete' || this.type === 'multiautocomplete') {
      this.internalFormGroup = new FormGroup({
        autocomplete: new FormControl(this.dataItems?.find(x => x.id === this.currentValue))
      });

      this.type === 'autocomplete' && this.formGroup.get(this.controlName)?.valueChanges
        .pipe(
          takeUntil(this.ngUnsubscribe),
          filter(value => !value),
          tap(() => this.internalFormGroup?.get('autocomplete')?.setValue(undefined)),
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

    if (this.type === 'datepicker' || this.type === 'rangedatepicker') {
      this.localizationService.localeChangedSub
        .pipe(
          takeUntil(this.ngUnsubscribe),
          tap(locale => {
            if (locale) {
              this.adapter.setLocale(this.localizationService.currentCulture);
              this.updateCalendarLabels(this.localizationService.currentCulture);
            }
          })
        )
        .subscribe();
    }

    super.ngOnInit();
  }

  private updateCalendarLabels(locale: string): void {
    const labels: Record<string, string> = {
      'en': 'Close calendar',
      'fr': 'Fermer le calendrier',
      'uk': 'Закрити календар',
      'ru': 'Закрыть календарь',
      'es': 'Cerrar el calendario',
      'de': 'Kalender schließen',
      'ja-JP': 'カレンダーを閉じる'
    };

    this.intl.closeCalendarLabel = labels[locale] ?? labels['en'];
    this.intl.changes.next();
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
    return this.currentControl?.disabled ?? false;
  }

  protected onInput(event: Event) {
    this.value.set((event.target as HTMLInputElement).value);
  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  displayFn(dataItem: DataItem): string {
    return this.localizationService.getTranslation(dataItem?.name) ?? '';
  }

  private _filterAutoComplete(name: string): DataItem[] | undefined {
    const filterValue = name.toLowerCase();

    if (this.formGroup?.get(this.controlName)?.value ===
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
      const newItem = this.internalFormGroup?.get('autocomplete')?.value;
      if (newItem && !this.selectedDataItems.some(item => item.id === newItem.id)) {
        this.selectedDataItems.push(newItem);
      }
      this.formGroup?.get(this.controlName)?.setValue(this.selectedDataItems.map(x => x.id).join(','));
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
    console.log(this.dataItems);
  }

  protected readonly LOCALIZATION_KEYS = LOCALIZATION_KEYS;
}
