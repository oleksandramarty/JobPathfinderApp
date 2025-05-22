import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileInfoComponent } from './profile-info.component';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonDialogService, DictionaryService, LocalizationService } from '@amarty/services';
import { Store } from '@ngrx/store';
import { GraphQlAuthService } from '../../../utils/api/services/graph-ql-auth.service';
import { TranslationPipe } from '@amarty/pipes';
import { UserProfileItemEnum, UserProfileResponse, UserResponse } from '@amarty/models';
import { CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations'; // For MatSnackBar
import { of } from 'rxjs';

// Mock TranslationPipe
@Pipe({
  name: 'translate',
  standalone: true,
})
class MockTranslationPipe implements PipeTransform {
  transform(value: string, ...args: any[]): string {
    return value + (args.length > 0 ? ':' + args.join(',') : '');
  }
}

// Mocks for services
class MockCommonDialogService {
  showDialog = jest.fn();
}

class MockLocalizationService {
  userLocaleChanged = jest.fn();
  handleApiError = jest.fn();
  getLocalizedText = jest.fn((key) => `localized-${key}`);
}

class MockStore {
  dispatch = jest.fn();
  select = jest.fn(() => of(null)); // Default mock for select
}

class MockGraphQlAuthService {
  currentUser = jest.fn(() => of({ data: { auth_gateway_current_user: {} } }));
}

class MockDictionaryService {
  countryData = [{ id: 1, title: 'Test Country' }];
  jobTypeData = [{ id: 1, title: 'Test Job Type' }];
  workArrangementData = [{ id: 1, title: 'Test Work Arrangement' }];
  getCountry = jest.fn(id => this.countryData.find(c => c.id === id)?.title);
  getJobType = jest.fn(id => this.jobTypeData.find(c => c.id === id)?.title);
  getWorkArrangement = jest.fn(id => this.workArrangementData.find(w => w.id === id)?.title);
}

class MockMatSnackBar {
  open = jest.fn();
}

describe('ProfileInfoComponent', () => {
  let component: ProfileInfoComponent;
  let fixture: ComponentFixture<ProfileInfoComponent>;
  let mockDictionaryService: MockDictionaryService;

  const mockUserProfile: UserProfileResponse = {
    id: 'up1',
    userId: 'u1',
    items: [
      {
        id: 'item1',
        profileItemType: UserProfileItemEnum.Experience,
        title: 'Software Engineer',
        company: 'TestCo',
        startDate: new Date('2022-01-01').toISOString(),
      },
      {
        id: 'item2',
        profileItemType: UserProfileItemEnum.Education,
        title: 'BSc Computer Science',
        company: 'Test University',
        startDate: new Date('2018-09-01').toISOString(),
      },
    ],
  };

  const mockCurrentUser: UserResponse = {
    id: 'u1',
    login: 'testuser',
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
  };

  beforeEach(async () => {
    mockDictionaryService = new MockDictionaryService();

    await TestBed.configureTestingModule({
      imports: [
        CommonModule, // Imported by the component
        NoopAnimationsModule, // For Material components like MatSnackBar
        ProfileInfoComponent, // The standalone component itself
        // MockTranslationPipe needs to be imported if not overridden below
      ],
      providers: [
        { provide: CommonDialogService, useClass: MockCommonDialogService },
        { provide: LocalizationService, useClass: MockLocalizationService },
        { provide: Store, useClass: MockStore },
        { provide: GraphQlAuthService, useClass: MockGraphQlAuthService },
        { provide: DictionaryService, useValue: mockDictionaryService },
        { provide: MatSnackBar, useClass: MockMatSnackBar },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // To ignore unknown elements in the template
    })
    .overrideComponent(ProfileInfoComponent, {
      remove: { imports: [TranslationPipe] }, // Remove original
      add: { imports: [MockTranslationPipe] }, // Add mock
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileInfoComponent);
    component = fixture.componentInstance;

    // Set Input properties
    component.currentUser = mockCurrentUser;
    component.userProfile = mockUserProfile;
    component.isCurrentUser = true;
    component.countryCode = 'US';

    fixture.detectChanges(); // Trigger ngOnInit and other lifecycle hooks
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize currentPosition and currentEducation from userProfile items', () => {
    expect(component.currentPosition).toBeDefined();
    expect(component.currentPosition?.title).toBe('Software Engineer');
    expect(component.currentEducation).toBeDefined();
    expect(component.currentEducation?.title).toBe('BSc Computer Science');
  });

  it('userDisplayName should return formatted name and login', () => {
    expect(component.userDisplayName).toBe('Test User | testuser');
  });
  
  it('userDisplayName should return only login if names are not present', () => {
    component.currentUser = { id: 'u2', login: 'anotheruser', email: 'another@example.com' };
    fixture.detectChanges();
    expect(component.userDisplayName).toBe('anotheruser');
  });

  it('getCountry should return country title from DictionaryService', () => {
    expect(component.getCountry(1)).toBe('Test Country');
    expect(mockDictionaryService.getCountry).toHaveBeenCalledWith(1);
  });

  it('openEditProfileDialog should not open dialog if not isCurrentUser', () => {
    const dialogService = TestBed.inject(CommonDialogService);
    component.isCurrentUser = false;
    fixture.detectChanges();
    component.openEditProfileDialog();
    expect(dialogService.showDialog).not.toHaveBeenCalled();
  });

  it('openEditProfileDialog should open dialog if isCurrentUser', () => {
    const dialogService = TestBed.inject(CommonDialogService);
    const graphQlAuthService = TestBed.inject(GraphQlAuthService);
    component.isCurrentUser = true;
    fixture.detectChanges();

    // Mock the currentUser call within the dialog's executable action
    graphQlAuthService.currentUser = jest.fn().mockReturnValue(of({
        data: { auth_gateway_current_user: mockCurrentUser }
    }));

    component.openEditProfileDialog();
    expect(dialogService.showDialog).toHaveBeenCalled();
    // Further tests could verify the dialog component and data passed
  });

});
