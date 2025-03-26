import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileSkillsDialogComponent } from './profile-skills-dialog.component';

describe('ProfileSkillsDialogComponent', () => {
  let component: ProfileSkillsDialogComponent;
  let fixture: ComponentFixture<ProfileSkillsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileSkillsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileSkillsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
