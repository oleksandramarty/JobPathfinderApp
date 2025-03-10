import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileAreaComponent } from './profile-area.component';

describe('ProfileAreaComponent', () => {
  let component: ProfileAreaComponent;
  let fixture: ComponentFixture<ProfileAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileAreaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
