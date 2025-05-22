import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileSkillsComponent } from './profile-skills.component';
import { CommonModule } from '@angular/common';
import { CommonDialogService, DictionaryService } from '@amarty/services';
import { UserSkillResponse } from '@amarty/models';
import { TranslationPipe } from '@amarty/pipes';
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

// Mocks for services
class MockCommonDialogService {
  showDialog = jest.fn();
}

class MockDictionaryService {
  getSkillTitle = jest.fn(skill => skill?.skill || 'Mock Skill');
}

describe('ProfileSkillsComponent', () => {
  let component: ProfileSkillsComponent;
  let fixture: ComponentFixture<ProfileSkillsComponent>;
  let mockDialogService: MockCommonDialogService;
  let mockDictionaryService: MockDictionaryService;

  const mockExistingSkills: UserSkillResponse[] = [
    { id: 'skill1', skillId: 1, skill: 'Angular', level: 5 },
    { id: 'skill2', skillId: 2, skill: 'TypeScript', level: 4 },
  ];

  beforeEach(async () => {
    mockDialogService = new MockCommonDialogService();
    mockDictionaryService = new MockDictionaryService();

    await TestBed.configureTestingModule({
      imports: [
        CommonModule, // Imported by the component
        NoopAnimationsModule,
        ProfileSkillsComponent, // The standalone component
      ],
      providers: [
        { provide: CommonDialogService, useValue: mockDialogService },
        { provide: DictionaryService, useValue: mockDictionaryService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .overrideComponent(ProfileSkillsComponent, {
      remove: { imports: [TranslationPipe] },
      add: { imports: [MockTranslationPipe] },
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileSkillsComponent);
    component = fixture.componentInstance;

    // Set Input properties
    component.existingItems = mockExistingSkills;
    component.isCurrentUser = true;

    fixture.detectChanges(); // Trigger ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('isEmptySection should be false if existingItems has items', () => {
    expect(component.isEmptySection).toBe(false);
  });

  it('isEmptySection should be true if existingItems is empty', () => {
    component.existingItems = [];
    fixture.detectChanges();
    expect(component.isEmptySection).toBe(true);
  });

  it('isEmptySection should be true if existingItems is undefined', () => {
    component.existingItems = undefined;
    fixture.detectChanges();
    expect(component.isEmptySection).toBe(true);
  });

  it('getItemTitle should call dictionaryService.getSkillTitle', () => {
    const skill = mockExistingSkills[0];
    component.getItemTitle(skill);
    expect(mockDictionaryService.getSkillTitle).toHaveBeenCalledWith(skill);
  });

  it('openItemDialog should not open dialog if not isCurrentUser', () => {
    component.isCurrentUser = false;
    fixture.detectChanges();
    component.openItemDialog('skill1');
    expect(mockDialogService.showDialog).not.toHaveBeenCalled();
  });

  it('openItemDialog should open dialog if isCurrentUser', () => {
    component.isCurrentUser = true;
    fixture.detectChanges();
    component.openItemDialog('skill1');
    expect(mockDialogService.showDialog).toHaveBeenCalled();
    expect(mockDialogService.showDialog).toHaveBeenCalledWith(
      expect.any(Function), // ProfileSkillsDialogComponent
      expect.objectContaining({
        data: { skill: mockExistingSkills.find(item => item.id === 'skill1') },
      })
    );
  });

  it('removeItem should not do anything if not isCurrentUser (console.log is a side effect)', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    component.isCurrentUser = false;
    fixture.detectChanges();
    component.removeItem('skill1');
    expect(consoleSpy).not.toHaveBeenCalledWith('removeItem', 'skill1');
    consoleSpy.mockRestore();
  });

  it('removeItem should log removal if isCurrentUser (actual removal logic is not tested here)', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    component.isCurrentUser = true;
    fixture.detectChanges();
    component.removeItem('skill1');
    expect(consoleSpy).toHaveBeenCalledWith('removeItem', 'skill1');
    consoleSpy.mockRestore();
  });

  it('should have LOCALIZATION_KEYS defined', () => {
    expect(component['LOCALIZATION_KEYS']).toBeDefined();
    expect(component['LOCALIZATION_KEYS']).toEqual(LOCALIZATION_KEYS);
  });
});
