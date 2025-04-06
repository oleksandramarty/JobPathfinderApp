import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileItemDialogComponent } from './profile-item-dialog.component';

describe('ProfileItemDialogComponent', () => {
  let component: ProfileItemDialogComponent;
  let fixture: ComponentFixture<ProfileItemDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileItemDialogComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ProfileItemDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
