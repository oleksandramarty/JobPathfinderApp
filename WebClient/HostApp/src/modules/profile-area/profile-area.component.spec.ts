import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileAreaComponent } from './profile-area.component';
import { CommonDialogService, DictionaryService } from '@amarty/services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import { selectUser } from '@amarty/store';
import { UserResponse } from '@amarty/api';
import { mockUserResponse } from '../../test/mock/user.mock';

describe('ProfileAreaComponent', () => {
  let component: ProfileAreaComponent;
  let fixture: ComponentFixture<ProfileAreaComponent>;
  let store: MockStore;

  const mockUser: UserResponse = mockUserResponse;

  const dictionaryServiceMock = {
    countryData: [
      { id: 1, code: 'CA' },
      { id: 2, code: 'US' }
    ]
  };

  const dialogServiceMock = {};
  const snackBarMock = { open: jasmine.createSpy('open') };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileAreaComponent],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: selectUser,
              value: mockUser
            }
          ]
        }),
        { provide: DictionaryService, useValue: dictionaryServiceMock },
        { provide: CommonDialogService, useValue: dialogServiceMock },
        { provide: MatSnackBar, useValue: snackBarMock }
      ]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(ProfileAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should inject all services', () => {
    expect(component['store']).toBeTruthy();
    expect(component['dictionaryService']).toBeTruthy();
    expect(component['dialogService']).toBeTruthy();
    expect(component['snackBar']).toBeTruthy();
  });

  it('should update currentUser and countryCode on init', () => {
    expect(component.currentUser).toEqual(mockUser);
    const expectedCode = dictionaryServiceMock.countryData.find(
      c => c.id === mockUser.userSetting?.countryId
    )?.code?.toLowerCase();
    expect(component.countryCode).toBe(expectedCode);
  });

  it('should set countryCode to undefined if no match found', () => {
    const noCountryUser = UserResponse.fromJS({
      ...mockUserResponse,
      userSetting: {
        ...mockUserResponse.userSetting,
        countryId: 999 // ID not in mock country list
      }
    });

    store.overrideSelector(selectUser, noCountryUser);
    store.refreshState();
    fixture.detectChanges();

    expect(component.currentUser?.userSetting?.countryId).toBe(999);
    expect(component.countryCode).toBeUndefined();
  });
});
