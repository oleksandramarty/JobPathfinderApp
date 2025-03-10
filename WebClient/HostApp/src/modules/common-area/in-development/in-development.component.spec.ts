import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InDevelopmentComponent } from './in-development.component';

describe('InDevelopmentComponent', () => {
  let component: InDevelopmentComponent;
  let fixture: ComponentFixture<InDevelopmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InDevelopmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InDevelopmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
