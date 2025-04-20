import { ChangeDetectionStrategy, Component, Input, ViewChild, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { debounceTime, filter, Observable, startWith, takeUntil, tap } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule, MatDatepickerIntl, MatDatepicker } from '@angular/material/datepicker';
import {MatNativeDateModule, DateAdapter, MAT_DATE_FORMATS} from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { DataItem, InputError, InputType, InputDatepickerType, DATE_FORMATS_DAY_MONTH_YEAR, DATE_FORMATS_MONTH_YEAR } from '@amarty/models';
import { generateRandomId } from '@amarty/utils';
import { LocalizationService } from '@amarty/services';
import { TranslationPipe } from '@amarty/pipes';
import { TranslationDirective } from '@amarty/directives';
import { BaseUnsubscribeComponent } from '@amarty/common';
import { LOCALIZATION_KEYS } from '@amarty/localizations';
import {MonthYearDateAdapter} from '../month-year-date-adapter';

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
  ],
  providers: [
    {
      provide: DateAdapter,
      useClass: MonthYearDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS,
      useFactory: (component: GenericInputComponent) => {
        return component.datepickerFormat === 'month-year'
          ? DATE_FORMATS_MONTH_YEAR
          : DATE_FORMATS_DAY_MONTH_YEAR;
      },
      deps: [GenericInputComponent],
    }
  ]
})
export class GenericInputComponent extends BaseUnsubscribeComponent {
  @Input() className?: string;
  @Input() type: InputType = 'input';
  @Input() placeholder?: string;
  @Input() hint?: string;
  @Input() icon?: string;
  @Input() label?: string;
  @Input() rows?: number;
  @Input() cols?: number;
  @Input() maxLength?: number;
  @Input() minLength?: number;
  @Input() minDate?: Date;
  @Input() maxDate?: Date;
  @Input() formGroup?: FormGroup;
  @Input() controlName = 'inputControl';
  @Input() dataItems?: DataItem[];
  @Input() mode: 'inline' | 'block' | null = 'block';
  @Input() errorArray?: InputError[];
  @Input() submitted = true;
  @Input() hidden = false;
  @Input() datepickerFormat: InputDatepickerType = 'day-month-year';

  @ViewChild('picker') picker?: MatDatepicker<Date>;
  @ViewChild('monthPicker') monthPicker?: MatDatepicker<Date>;

  filteredDataItems?: Observable<DataItem[]>;
  selectedDataItems: DataItem[] = [];
  internalFormGroup?: FormGroup;
  inputId: string = generateRandomId(12);

  protected readonly value = signal('');
  hide = signal(true);

  constructor(
    private readonly localizationService: LocalizationService,
    private readonly adapter: DateAdapter<unknown>,
    private readonly intl: MatDatepickerIntl
  ) {
    super();
    this.displayFn = this.displayFn.bind(this);
  }

  override ngOnInit(): void {
    if (!this.formGroup) {
      this.formGroup = this.type === 'rangedatepicker'
        ? new FormGroup({ start: new FormControl(null), end: new FormControl(null) })
        : new FormGroup({ [this.controlName]: new FormControl(null) });
    }

    if (this.dataItems) {
      this.dataItems.sort((a, b) => (b.isImportant ? 1 : 0) - (a.isImportant ? 1 : 0));
    }

    if (this.type === 'autocomplete' || this.type === 'multiautocomplete') {
      this.setupAutocomplete();
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

  private setupAutocomplete(): void {
    this.internalFormGroup = new FormGroup({
      autocomplete: new FormControl(this.dataItems?.find(x => x.id === this.currentValue))
    });

    this.type === 'autocomplete' && this.formGroup?.get(this.controlName)?.valueChanges
      .pipe(
        takeUntil(this.ngUnsubscribe),
        filter(value => !value),
        tap(() => this.internalFormGroup?.get('autocomplete')?.setValue(undefined)),
      )
      .subscribe();

    if (this.currentValue) {
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
        if (!this.dataItems) {
          return [];
        }
        return name && name.length >= 2
          ? this.dataItems.filter(item =>
            item.filteredFields?.some(field => field?.toLowerCase().includes(name.toLowerCase())) ||
            item.id?.toLowerCase().includes(name.toLowerCase()) ||
            item.name?.toLowerCase().includes(name.toLowerCase())
          )
          : this.dataItems.slice();
      })
    );
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

  get currentControl() {
    return this.formGroup?.get(this.controlName);
  }

  get isInvalid(): boolean {
    return this.submitted && (this.currentControl?.invalid || !!this.errorArray?.length);
  }

  get currentValue(): any {
    return this.formGroup?.get(this.controlName)?.value;
  }

  get isRequired(): boolean {
    return this.currentControl?.hasValidator(Validators.required) ?? false;
  }

  get isDisabled(): boolean {
    return this.currentControl?.disabled ?? false;
  }

  protected onInput(event: Event): void {
    this.value.set((event.target as HTMLInputElement).value);
  }

  clickEvent(event: MouseEvent): void {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  displayFn(dataItem: DataItem): string {
    return this.localizationService.getTranslation(dataItem?.name) ?? '';
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
    const index = this.selectedDataItems.indexOf(item);
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

    item.children?.forEach(child => this.toggleChildrenSelection(child, selected));
    this.formGroup?.get(this.controlName)?.setValue(this.selectedDataItems.map(x => x.id));
  }

  chosenMonthHandler(normalizedMonth: Date, datepicker: MatDatepicker<Date>): void {
    const ctrl = this.formGroup?.get(this.controlName);
    if (ctrl) {
      ctrl.setValue(normalizedMonth);
    }
    datepicker.close();
  }

  public showDebugInfo(): void {
    console.log('FormGroup:', this.formGroup);
    console.log('Current Control:', this.currentControl);
    console.log('Current Value:', this.currentValue);
    console.log('Data Items:', this.dataItems);
  }

  protected readonly LOCALIZATION_KEYS = LOCALIZATION_KEYS;
}
