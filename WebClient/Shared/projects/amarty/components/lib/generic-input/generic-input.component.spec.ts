import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GenericInputComponent } from './generic-input.component';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';

// Mocks to allow setup without real Angular Material or @amarty dependencies
const createFormGroup = (controlName: string, validators: any[] = []) => {
  return new FormGroup({
    [controlName]: new FormControl('', validators),
  });
};

describe('GenericInputComponent', () => {
  let component: GenericInputComponent;
  let fixture: ComponentFixture<GenericInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericInputComponent, ReactiveFormsModule, CommonModule, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(GenericInputComponent);
    component = fixture.componentInstance;
    component.controlName = 'test';
  });

  function setType(type: any, control?: FormControl) {
    component.type = type;
    component.formGroup = new FormGroup({
      [component.controlName]: control ?? new FormControl('')
    });
  }

  it('should create the component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render input field', () => {
    setType('input');
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input'));
    expect(input).toBeTruthy();
  });

  it('should render select with dataItems', () => {
    setType('select');
    component.dataItems = [
      { id: '1', name: 'Option 1', children: [] },
      { id: '2', name: 'Option 2', children: [] }
    ];
    fixture.detectChanges();
    const options = fixture.debugElement.queryAll(By.css('option'));
    expect(options.length).toBe(2);
  });

  it('should render textarea with rows and cols', () => {
    setType('textarea');
    component.rows = 3;
    component.cols = 50;
    fixture.detectChanges();
    const textarea = fixture.debugElement.query(By.css('textarea'));
    expect(textarea).toBeTruthy();
    expect(textarea.attributes['rows']).toBe('3');
    expect(textarea.attributes['cols']).toBe('50');
  });

  it('should toggle password visibility', () => {
    setType('password');
    fixture.detectChanges();
    const eyeIcon = fixture.debugElement.query(By.css('i'));
    expect(eyeIcon).toBeTruthy();
    eyeIcon.triggerEventHandler('click', new MouseEvent('click'));
    expect(component.hide()).toBeFalsy();
  });

  it('should render radio buttons from dataItems', () => {
    setType('radio');
    component.dataItems = [
      { id: 'a', name: 'Yes', children: [] },
      { id: 'b', name: 'No', children: [] }
    ];
    fixture.detectChanges();
    const radios = fixture.debugElement.queryAll(By.css('input[type="radio"]'));
    expect(radios.length).toBe(2);
  });

  it('should render checkbox input', () => {
    setType('checkbox');
    fixture.detectChanges();
    const checkbox = fixture.debugElement.query(By.css('input[type="checkbox"]'));
    expect(checkbox).toBeTruthy();
  });

  it('should handle autocomplete form control', () => {
    setType('autocomplete');
    component.dataItems = [
      { id: '1', name: 'Alpha', children: [] },
      { id: '2', name: 'Beta', children: [] }
    ];
    fixture.detectChanges();
    expect(component.internalFormGroup?.get('autocomplete')).toBeTruthy();
  });

  it('should handle multiautocomplete selections', () => {
    setType('multiautocomplete');
    component.dataItems = [
      { id: '1', name: 'Alpha', children: [] },
      { id: '2', name: 'Beta', children: [] }
    ];
    fixture.detectChanges();
    component.internalFormGroup?.get('autocomplete')?.setValue(component.dataItems[0]);
    component.onAutoCompleteChecked();
    expect(component.selectedDataItems.length).toBe(1);
  });

  it('should render datepicker input', () => {
    setType('datepicker');
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('.datepicker input'));
    expect(input).toBeTruthy();
  });

  it('should render rangedatepicker inputs', () => {
    setType('rangedatepicker');
    fixture.detectChanges();
    const inputs = fixture.debugElement.queryAll(By.css('input.date-input'));
    expect(inputs.length).toBeGreaterThanOrEqual(2);
  });

  it('should hide component when hidden = true', () => {
    component.hidden = true;
    setType('input');
    fixture.detectChanges();
    expect(fixture.nativeElement.innerHTML.includes('input')).toBeFalsy();
  });

  it('should show required error message', () => {
    setType('input', new FormControl('', Validators.required));
    component.submitted = true;
    fixture.detectChanges();
    const errorContainer = fixture.nativeElement.querySelector('.input__error__container__body');
    expect(errorContainer?.textContent).toContain('FIELD_REQUIRED');
  });

  it('should not crash without controlName', () => {
    component.controlName = '';
    component.formGroup = new FormGroup({});
    setType('input');
    fixture.detectChanges();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
