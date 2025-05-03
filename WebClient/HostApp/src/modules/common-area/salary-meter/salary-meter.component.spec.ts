import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryMeterComponent } from './salary-meter.component';

describe('SalaryMeterComponent', () => {
  let component: SalaryMeterComponent;
  let fixture: ComponentFixture<SalaryMeterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalaryMeterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalaryMeterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
