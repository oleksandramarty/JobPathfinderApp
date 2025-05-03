import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import {BaseUnsubscribeComponent} from '@amarty/common';
import {getLocalStorageItem, setLocalStorageItem} from '@amarty/utils';
import {FormGroup, Validators} from '@angular/forms';
import {DictionaryService} from '@amarty/services';

@Component({
  selector: 'app-salary-meter',
  imports: [
    CommonModule
  ],
  standalone: true,
  templateUrl: './salary-meter.component.html',
  styleUrl: './salary-meter.component.scss'
})
export class SalaryMeterComponent extends BaseUnsubscribeComponent {
  private _salaryPerHour = 0;
  private _totalEarnings = 0;

  public salaryFormGroup: FormGroup = new FormGroup({
    salary: new FormGroup({}, [Validators.min(0), Validators.max(1000000)]),
    currencyId: new FormGroup({}, [Validators.required]),
  });

  constructor(
    private readonly dictionaryService: DictionaryService,
  ) {
    super();
  }

  override ngOnInit(): void {
    super.ngOnInit();
  }

  public updateSalary(): void {
    let salary = this.salaryFormGroup.get('salary')?.value;
    setLocalStorageItem('salary', isNaN(salary) ? 0 : Number(salary));
    this.getSalary();
  }

  private getSalary(): void {
    this._salaryPerHour = getLocalStorageItem('salary') ?? 0;
  }
}
