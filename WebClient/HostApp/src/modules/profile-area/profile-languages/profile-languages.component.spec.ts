import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileLanguagesComponent } from './profile-languages.component';
import { CommonDialogService, DictionaryService } from '@amarty/services';
import { MatSnackBar } from '@angular/material/snack-bar';
import {UserLanguageResponse} from '@amarty/models';

describe('ProfileLanguagesComponent', () => {
  let component: ProfileLanguagesComponent;
  let fixture: ComponentFixture<ProfileLanguagesComponent>;

  const mockSnackBar = { open: jasmine.createSpy('open') };
  const mockDictionaryService = {
    getLanguageTitle: jasmine.createSpy('getLanguageTitle').and.returnValue('Mock Language')
  };

  const mockDialogService = {
    showDialog: jasmine.createSpy('showDialog')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileLanguagesComponent],
      providers: [
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: DictionaryService, useValue: mockDictionaryService },
        { provide: CommonDialogService, useValue: mockDialogService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileLanguagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should inject all services', () => {
    expect(component['snackBar']).toBeTruthy();
    expect(component['dictionaryService']).toBeTruthy();
    expect(component['dialogService']).toBeTruthy();
  });

  it('should call dictionaryService.getLanguageTitle', () => {
    const language: UserLanguageResponse = { id: '1' } as UserLanguageResponse;
    const result = component.getLanguageTitle(language);
    expect(mockDictionaryService.getLanguageTitle).toHaveBeenCalledWith(language);
    expect(result).toBe('Mock Language');
  });

  it('should open dialog and add new language', () => {
    const newLanguage: UserLanguageResponse = { id: 'abc', languageId: 1 } as UserLanguageResponse;

    mockDialogService.showDialog.and.callFake(
      <TDialog, TDialogResult>(
        _dialogComp: any,
        _dialogConfig: any,
        executableAction?: (result: TDialogResult) => void
      ) => {
        (executableAction as ((res: UserLanguageResponse) => void))?.(newLanguage);
      }
    );

    component.openLanguagesDialog(undefined, true);
    expect(component.languagesToAdd).toContain(newLanguage);
  });

  it('should update language if exists in list', () => {
    const updatedLanguage: UserLanguageResponse = { id: 'xyz', languageId: 2 } as UserLanguageResponse;
    component.existingLanguages = [{ id: 'xyz', languageId: 1 } as UserLanguageResponse];

    mockDialogService.showDialog.and.callFake(
      <TDialog, TDialogResult>(
        _dialogComp: any,
        _dialogConfig: any,
        executableAction?: (result: TDialogResult) => void
      ) => {
        (executableAction as (res: UserLanguageResponse) => void)?.(updatedLanguage);
      }
    );

    component.openLanguagesDialog('xyz', false);
    expect(component.existingLanguages?.[0].languageId).toBe(2);
  });

  it('should remove language from existingLanguages and track id', () => {
    const idToRemove = 'lang123';
    component.existingLanguages = [{ id: idToRemove, languageId: 5 } as UserLanguageResponse];
    component.removeLanguage(idToRemove, false);

    expect(component.existingLanguages).toEqual([]);
    expect(component.languageIdsToRemove).toContain(idToRemove);
  });

  it('should remove language from languagesToAdd only (isNew)', () => {
    const idToRemove = 'newLang123';
    component.languagesToAdd = [{ id: idToRemove, languageId: 7 } as UserLanguageResponse];
    component.removeLanguage(idToRemove, true);

    expect(component.languagesToAdd).toEqual([]);
    expect(component.languageIdsToRemove).not.toContain(idToRemove); // only for existing
  });
});
