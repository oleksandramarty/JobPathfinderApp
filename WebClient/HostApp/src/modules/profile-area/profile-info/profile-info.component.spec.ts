import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileInfoComponent } from './profile-info.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonDialogService } from '@amarty/services';
import { UserPreferencesDialogComponent } from '../../dialogs/user-preferences-dialog/user-preferences-dialog.component';

describe('ProfileInfoComponent', () => {
  let component: ProfileInfoComponent;
  let fixture: ComponentFixture<ProfileInfoComponent>;

  const dialogServiceMock = {
    showDialog: jasmine.createSpy('showDialog')
  };

  const snackBarMock = { open: jasmine.createSpy('open') };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileInfoComponent],
      providers: [
        { provide: CommonDialogService, useValue: dialogServiceMock },
        { provide: MatSnackBar, useValue: snackBarMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should inject all services', () => {
    expect(component['dialogService']).toBeTruthy();
    expect(component['snackBar']).toBeTruthy();
  });

  it('should open user preferences dialog', () => {
    component.openEditProfileDialog();

    expect(dialogServiceMock.showDialog).toHaveBeenCalledWith(
      UserPreferencesDialogComponent,
      {
        width: '800px',
        maxWidth: '90vw'
      }
    );
  });
});
