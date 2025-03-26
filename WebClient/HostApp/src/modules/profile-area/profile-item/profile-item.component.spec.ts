import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileItemComponent } from './profile-item.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonDialogService, DictionaryService } from '@amarty/services';
import { UserProfileItemEnum, UserSkillResponse, UserLanguageResponse } from '@amarty/api';
import { SafeHtml } from '@angular/platform-browser';

describe('ProfileItemComponent', () => {
  let component: ProfileItemComponent;
  let fixture: ComponentFixture<ProfileItemComponent>;

  const dictionaryServiceMock = {
    getSkillTitle: jasmine.createSpy('getSkillTitle').and.returnValue('Mock Skill Title'),
    getLanguageTitle: jasmine.createSpy('getLanguageTitle').and.returnValue('<b>Mock Language</b>' as SafeHtml)
  };

  const dialogServiceMock = {};
  const snackBarMock = { open: jasmine.createSpy('open') };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileItemComponent],
      providers: [
        { provide: CommonDialogService, useValue: dialogServiceMock },
        { provide: MatSnackBar, useValue: snackBarMock },
        { provide: DictionaryService, useValue: dictionaryServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileItemComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should inject all services', () => {
    expect(component['dialogService']).toBeTruthy();
    expect(component['snackBar']).toBeTruthy();
    expect(component['dictionaryService']).toBeTruthy();
  });

  it('should set title and addButtonTitle in ngOnInit', () => {
    component.itemType = UserProfileItemEnum.Experience;
    component.ngOnInit();
    expect(component.title).toBe('COMMON.EXPERIENCE');
    expect(component.addButtonTitle).toBe('COMMON.ADD_EXPERIENCE');
  });

  it('should return skill title from dictionary service', () => {
    const mockSkill = {} as UserSkillResponse;
    const title = component.getSkillTitle(mockSkill);
    expect(title).toBe('Mock Skill Title');
    expect(dictionaryServiceMock.getSkillTitle).toHaveBeenCalledWith(mockSkill);
  });

  it('should return language title from dictionary service', () => {
    const mockLanguage = {} as UserLanguageResponse;
    const title = component.getLanguageTitle(mockLanguage);
    expect(title).toBe('<b>Mock Language</b>');
    expect(dictionaryServiceMock.getLanguageTitle).toHaveBeenCalledWith(mockLanguage);
  });
});
