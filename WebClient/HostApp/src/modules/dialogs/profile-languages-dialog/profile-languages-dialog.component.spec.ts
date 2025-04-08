import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileLanguagesDialogComponent } from './profile-languages-dialog.component';

describe('ProfileLanguagesDialogComponent', () => {
  let component: ProfileLanguagesDialogComponent;
  let fixture: ComponentFixture<ProfileLanguagesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileLanguagesDialogComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ProfileLanguagesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
