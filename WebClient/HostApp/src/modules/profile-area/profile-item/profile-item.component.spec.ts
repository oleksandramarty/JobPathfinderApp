import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileItemComponent } from './profile-item.component';
import { CommonModule } from '@angular/common';
import { CommonDialogService, DictionaryService } from '@amarty/services';
import { UserProfileItemEnum, UserProfileItemResponse } from '@amarty/models';
import { TranslationPipe, MonthYearFormatPipe } from '@amarty/pipes';
import { CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { LOCALIZATION_KEYS } from '@amarty/localizations'; // Used by the component

// Mock TranslationPipe
@Pipe({ name: 'translate', standalone: true })
class MockTranslationPipe implements PipeTransform {
  transform(value: string, ...args: any[]): string {
    return value; // Simple passthrough
  }
}

// Mock MonthYearFormatPipe
@Pipe({ name: 'monthYearFormat', standalone: true })
class MockMonthYearFormatPipe implements PipeTransform {
  transform(value: any, ...args: any[]): string {
    return String(value); // Simple passthrough
  }
}

// Mocks for services
class MockCommonDialogService {
  showDialog = jest.fn();
}

class MockDictionaryService {
  getSkillTitle = jest.fn(skill => skill?.skill || 'Mock Skill');
  getLanguageTitle = jest.fn(lang => lang?.language || 'Mock Language');
  countryData = [{ id: 1, title: 'Test Country' }];
  jobTypeData = [{ id: 1, title: 'Test Job Type' }];
  workArrangementData = [{ id: 1, title: 'Test Work Arrangement' }];
}

describe('ProfileItemComponent', () => {
  let component: ProfileItemComponent;
  let fixture: ComponentFixture<ProfileItemComponent>;
  let mockDialogService: MockCommonDialogService;
  let mockDictionaryService: MockDictionaryService;

  const mockExistingItems: UserProfileItemResponse[] = [
    { id: 'exp1', profileItemType: UserProfileItemEnum.Experience, title: 'Developer' },
    { id: 'edu1', profileItemType: UserProfileItemEnum.Education, title: 'Degree' },
  ];

  beforeEach(async () => {
    mockDialogService = new MockCommonDialogService();
    mockDictionaryService = new MockDictionaryService();

    await TestBed.configureTestingModule({
      imports: [
        CommonModule, // Imported by the component
        NoopAnimationsModule,
        ProfileItemComponent, // The standalone component
      ],
      providers: [
        { provide: CommonDialogService, useValue: mockDialogService },
        { provide: DictionaryService, useValue: mockDictionaryService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .overrideComponent(ProfileItemComponent, {
      remove: { imports: [TranslationPipe, MonthYearFormatPipe] },
      add: { imports: [MockTranslationPipe, MockMonthYearFormatPipe] },
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileItemComponent);
    component = fixture.componentInstance;

    // Set Input properties
    component.itemType = UserProfileItemEnum.Experience;
    component.existingItems = mockExistingItems;
    component.isCurrentUser = true;

    fixture.detectChanges(); // Trigger ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the title based on itemType during ngOnInit', () => {
    expect(component.title).toBe(LOCALIZATION_KEYS.PROFILE.SECTION.WORK_EXPERIENCE);
    
    component.itemType = UserProfileItemEnum.Education;
    component.ngOnInit(); // Re-trigger with new input
    fixture.detectChanges();
    expect(component.title).toBe(LOCALIZATION_KEYS.PROFILE.SECTION.EDUCATION);
  });

  it('isEmptySection should be false if items of the given type exist', () => {
    component.itemType = UserProfileItemEnum.Experience;
    component.existingItems = mockExistingItems;
    fixture.detectChanges();
    expect(component.isEmptySection).toBe(false);
  });

  it('isEmptySection should be true if no items of the given type exist', () => {
    component.itemType = UserProfileItemEnum.Project; // No project items in mock
    component.existingItems = mockExistingItems;
    fixture.detectChanges();
    expect(component.isEmptySection).toBe(true);
  });
  
  it('isEmptySection should be true if existingItems is undefined', () => {
    component.itemType = UserProfileItemEnum.Experience;
    component.existingItems = undefined;
    fixture.detectChanges();
    expect(component.isEmptySection).toBe(true);
  });

  it('openItemDialog should not open dialog if not isCurrentUser', () => {
    component.isCurrentUser = false;
    fixture.detectChanges();
    component.openItemDialog('exp1');
    expect(mockDialogService.showDialog).not.toHaveBeenCalled();
  });

  it('openItemDialog should open dialog if isCurrentUser', () => {
    component.isCurrentUser = true;
    fixture.detectChanges();
    component.openItemDialog('exp1');
    expect(mockDialogService.showDialog).toHaveBeenCalled();
    expect(mockDialogService.showDialog).toHaveBeenCalledWith(
      expect.any(Function), // ProfileItemDialogComponent
      expect.objectContaining({
        data: expect.objectContaining({
          profileItem: mockExistingItems.find(item => item.id === 'exp1'),
          profileItemType: UserProfileItemEnum.Experience,
        }),
      })
    );
  });

  it('removeItem should not do anything if not isCurrentUser (console.log is a side effect)', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    component.isCurrentUser = false;
    fixture.detectChanges();
    component.removeItem('exp1');
    expect(consoleSpy).not.toHaveBeenCalledWith('removeItem', 'exp1');
    consoleSpy.mockRestore();
  });

  it('removeItem should log removal if isCurrentUser (actual removal logic is not tested here)', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    component.isCurrentUser = true;
    fixture.detectChanges();
    component.removeItem('exp1');
    expect(consoleSpy).toHaveBeenCalledWith('removeItem', 'exp1');
    consoleSpy.mockRestore();
  });
});
