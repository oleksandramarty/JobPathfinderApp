import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LandingComponent } from './landing.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonDialogService, LocalizationService } from '@amarty/services';
import { of } from 'rxjs';
import { selectUser } from '@amarty/store';
import { UserResponse } from '@amarty/api';
import { mockUserResponse } from '../../test/mock/user.mock';
import {Store} from '@ngrx/store'; // путь подгони под свой проект

describe('LandingComponent', () => {
  let component: LandingComponent;
  let fixture: ComponentFixture<LandingComponent>;
  let store: MockStore;
  const mockUser: UserResponse = mockUserResponse;

  const localizationServiceMock = {
    localeChangedSub: of(true),
    getTranslation: (key: string) => key,
    shortDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  };

  const dialogServiceMock = {
    showDialog: jasmine.createSpy('showDialog')
  };

  const snackBarMock = {
    open: jasmine.createSpy('open')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingComponent],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: selectUser,
              value: mockUser
            }
          ]
        }),
        { provide: LocalizationService, useValue: localizationServiceMock },
        { provide: CommonDialogService, useValue: dialogServiceMock },
        { provide: MatSnackBar, useValue: snackBarMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LandingComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store) as MockStore;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user and set countryCode', () => {
    expect(component.currentUser).toEqual(mockUser);
    expect(typeof component.countryCode).toBe('string');
  });

  it('should localize menu items on localeChangedSub emit', () => {
    component.menuItems.forEach(item => {
      expect(item.title).toBe(item.key);
    });
  });

  it('should call dialogService.showDialog when openApplicationDialog is called', () => {
    component.openApplicationDialog();
    expect(dialogServiceMock.showDialog).toHaveBeenCalled();
  });
});
