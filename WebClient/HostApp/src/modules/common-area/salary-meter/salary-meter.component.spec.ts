import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms'; 
import { CommonModule } from '@angular/common';

import { SalaryMeterComponent } from './salary-meter.component';
import { DictionaryService } from '@amarty/services';
import * as utils from '@amarty/utils'; 

// Mock localStorage interaction via @amarty/utils
let mockLocalStorageStore: { [key: string]: any } = {};

jest.mock('@amarty/utils', () => ({
  ...jest.requireActual('@amarty/utils'), 
  getLocalStorageItem: jest.fn((key: string) => mockLocalStorageStore[key]),
  setLocalStorageItem: jest.fn((key: string, value: any) => { mockLocalStorageStore[key] = value; }),
}));

class MockDictionaryService {}

describe('SalaryMeterComponent', () => {
  let component: SalaryMeterComponent;
  let fixture: ComponentFixture<SalaryMeterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SalaryMeterComponent, 
        ReactiveFormsModule, 
      ],
      providers: [
        { provide: DictionaryService, useClass: MockDictionaryService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SalaryMeterComponent);
    component = fixture.componentInstance;
    
    mockLocalStorageStore = {};
    (utils.getLocalStorageItem as jest.Mock).mockClear();
    (utils.setLocalStorageItem as jest.Mock).mockClear();
    
    fixture.detectChanges(); 
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize salaryFormGroup with salary and currencyId FormGroups', () => {
    expect(component.salaryFormGroup).toBeInstanceOf(FormGroup);
    expect(component.salaryFormGroup.get('salary')).toBeInstanceOf(FormGroup); // As per component code
    expect(component.salaryFormGroup.get('currencyId')).toBeInstanceOf(FormGroup); // As per component code
  });
  
  it('salary FormGroup should have validator function attached (min/max)', () => {
    const salaryControl = component.salaryFormGroup.get('salary');
    // This checks if a validator function is present, actual validation logic is harder with FormGroup here
    expect(salaryControl?.validator).toBeInstanceOf(Function);
  });

  it('currencyId FormGroup should have validator function attached (required)', () => {
    const currencyIdControl = component.salaryFormGroup.get('currencyId');
    expect(currencyIdControl?.validator).toBeInstanceOf(Function);
  });


  describe('updateSalary method', () => {
    let getSalarySpy: jest.SpyInstance;
    
    beforeEach(() => {
        // Spy on private getSalary for verification of call
        getSalarySpy = jest.spyOn(component as any, 'getSalary'); 
        // Mock actual form controls inside the FormGroups for testing value setting
        (component.salaryFormGroup.get('salary') as FormGroup).addControl('amount', new FormControl(null));
    });

    afterEach(() => {
        getSalarySpy.mockRestore();
    });

    it('should set salary in localStorage and call getSalary', () => {
      // To set a value that updateSalary reads, we need a FormControl inside the 'salary' FormGroup
      (component.salaryFormGroup.get('salary') as FormGroup).get('amount')?.setValue(50000);
      // For the test, we'll assume updateSalary reads from the 'salary' FormGroup's value directly
      // If the component's `updateSalary` was `this.salaryFormGroup.get('salary.amount')?.value` it'd be different.
      // Given `this.salaryFormGroup.get('salary')?.value`, this value will be the object from the inner FormGroup.
      // Let's adjust the spy to reflect what the component actually does.
      // The component code is `let salary = this.salaryFormGroup.get('salary')?.value;`
      // If 'salary' is a FormGroup, its value is an object of its controls.
      // To make this testable as written, we'd need to mock the .value of the salary FormGroup.
      Object.defineProperty(component.salaryFormGroup.get('salary')!, 'value', { value: 50000, configurable: true });

      component.updateSalary();
      expect(utils.setLocalStorageItem).toHaveBeenCalledWith('salary', 50000);
      expect(getSalarySpy).toHaveBeenCalled();
    });

    it('should store 0 in localStorage if salary value is NaN', () => {
      Object.defineProperty(component.salaryFormGroup.get('salary')!, 'value', { value: NaN, configurable: true });
      component.updateSalary();
      expect(utils.setLocalStorageItem).toHaveBeenCalledWith('salary', 0);
    });
    
    it('should correctly update _salaryPerHour after updateSalary', () => {
      Object.defineProperty(component.salaryFormGroup.get('salary')!, 'value', { value: 12345, configurable: true });
      component.updateSalary();
      expect((component as any)._salaryPerHour).toBe(12345);
    });
  });

  describe('getSalary method (private, tested via updateSalary effects)', () => {
    it('should set _salaryPerHour from localStorage if value exists', () => {
      mockLocalStorageStore['salary'] = 75000;
      (component as any).getSalary();
      expect((component as any)._salaryPerHour).toBe(75000);
    });

    it('should set _salaryPerHour to 0 if value does not exist in localStorage', () => {
      delete mockLocalStorageStore['salary']; 
      (component as any).getSalary();
      expect((component as any)._salaryPerHour).toBe(0);
    });
     it('should set _salaryPerHour to 0 if localStorage value is null', () => {
      mockLocalStorageStore['salary'] = null;
      (component as any).getSalary();
      expect((component as any)._salaryPerHour).toBe(0);
    });
  });
  
  describe('Template (Basic Form Structure)', () => {
    // These tests are conceptual due to the unusual FormGroup structure for scalar values.
    it('should have a FormGroup for salary', () => {
        expect(component.salaryFormGroup.get('salary')).toBeDefined();
    });

    it('should have a FormGroup for currencyId', () => {
        expect(component.salaryFormGroup.get('currencyId')).toBeDefined();
    });
  });
  
  it('should unsubscribe on destroy', () => {
    fixture.detectChanges(); 
    const ngUnsubscribeNextSpy = jest.spyOn(component.ngUnsubscribe, 'next');
    const ngUnsubscribeCompleteSpy = jest.spyOn(component.ngUnsubscribe, 'complete');
    
    component.ngOnDestroy(); 
    
    expect(ngUnsubscribeNextSpy).toHaveBeenCalled();
    expect(ngUnsubscribeCompleteSpy).toHaveBeenCalled();
  });
});
