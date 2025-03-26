import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthAreaComponent } from './auth-area.component';

describe('AuthAreaComponent', () => {
  let component: AuthAreaComponent;
  let fixture: ComponentFixture<AuthAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthAreaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
