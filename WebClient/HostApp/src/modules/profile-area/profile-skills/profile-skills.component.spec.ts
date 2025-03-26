import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileSkillsComponent } from './profile-skills.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonDialogService, DictionaryService } from '@amarty/services';
import { UserSkillResponse } from '@amarty/api';
import { of } from 'rxjs';
import { TranslationPipe } from '@amarty/utils/pipes';
import {NO_ERRORS_SCHEMA, Type} from '@angular/core';
import {ProfileSkillsDialogComponent} from '../../dialogs/profile-skills-dialog/profile-skills-dialog.component';
import {MatDialogConfig} from '@angular/material/dialog';

describe('ProfileSkillsComponent', () => {
  let component: ProfileSkillsComponent;
  let fixture: ComponentFixture<ProfileSkillsComponent>;
  let dialogServiceMock: jasmine.SpyObj<CommonDialogService>;
  let dictionaryServiceMock: jasmine.SpyObj<DictionaryService>;

  const mockSkill: UserSkillResponse = {
    id: '1',
    skillId: 123,
    version: 'v1'
  } as UserSkillResponse;

  beforeEach(async () => {
    dialogServiceMock = jasmine.createSpyObj('CommonDialogService', ['showDialog']);
    dictionaryServiceMock = jasmine.createSpyObj('DictionaryService', ['getSkillTitle']);

    await TestBed.configureTestingModule({
      imports: [ProfileSkillsComponent, TranslationPipe],
      providers: [
        { provide: CommonDialogService, useValue: dialogServiceMock },
        { provide: DictionaryService, useValue: dictionaryServiceMock },
        { provide: MatSnackBar, useValue: { open: () => {} } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileSkillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should inject dependencies', () => {
    expect(component['dialogService']).toBeTruthy();
    expect(component['dictionaryService']).toBeTruthy();
    expect(component['snackBar']).toBeTruthy();
  });

  it('should get skill title using dictionaryService', () => {
    dictionaryServiceMock.getSkillTitle.and.returnValue('Skill Title');
    const title = component.getSkillTitle(mockSkill);
    expect(title).toBe('Skill Title');
    expect(dictionaryServiceMock.getSkillTitle).toHaveBeenCalledWith(mockSkill);
  });

  it('should open dialog with proper parameters and handle new skill', () => {
    const updatedSkill: UserSkillResponse = new UserSkillResponse({ ...mockSkill, skillId: 456 });

    dialogServiceMock.showDialog.and.callFake(<TDialog, TDialogResult>(
      dialogComp: Type<TDialog>,
      dialogConfig: MatDialogConfig,
      executableAction?: (result: TDialogResult) => void
    ) => {
      // Принудительно кастим, так как мы знаем, что это UserSkillResponse
      (executableAction as ((res: UserSkillResponse) => void))?.(updatedSkill);
    });


    component.openSkillsDialog(undefined, true);

    expect(component.skillsToAdd?.length).toBe(1);
    expect(component.skillsToAdd?.[0]).toEqual(updatedSkill);
  });

  it('should remove new skill from skillsToAdd', () => {
    component.skillsToAdd = [mockSkill];
    component.removeSkill(mockSkill.id!, true);

    expect(component.skillsToAdd?.length).toBe(0);
  });

  it('should remove existing skill and add id to skillIdsToRemove', () => {
    component.existingSkills = [mockSkill];
    component.removeSkill(mockSkill.id!, false);

    expect(component.existingSkills?.length).toBe(0);
    expect(component.skillIdsToRemove).toContain(mockSkill.id!);
  });
});
