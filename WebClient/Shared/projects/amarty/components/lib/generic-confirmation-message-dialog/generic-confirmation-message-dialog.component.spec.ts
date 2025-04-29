import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GenericConfirmationMessageDialogComponent } from './generic-confirmation-message-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SanitizeHtmlPipe, TranslationPipe } from '@amarty/pipes';

describe('GenericConfirmationMessageDialogComponent', () => {
  let component: GenericConfirmationMessageDialogComponent;
  let fixture: ComponentFixture<GenericConfirmationMessageDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericConfirmationMessageDialogComponent],
      providers: [
        {
          provide: MatDialogRef,
          useValue: { close: jest.fn() }
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            yesBtn: 'Yes',
            noBtn: 'No',
            title: 'Confirm',
            descriptions: ['Are you sure you want to continue?'],
            htmlBlock: '<b>Bold</b>'
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GenericConfirmationMessageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the dialog component', () => {
    expect(component).toBeTruthy();
  });

  it('should render title and descriptions', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.modal__header-title')?.textContent).toContain('Confirm');
    expect(compiled.querySelector('.modal__body')?.textContent).toContain('Are you sure you want to continue?');
  });

  it('should call dialogRef.close(true) when Yes is clicked', () => {
    const yesBtn = fixture.nativeElement.querySelector('.button__filled__submit');
    yesBtn.click();
    expect(component.dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should call dialogRef.close(false) when No is clicked', () => {
    const noBtn = fixture.nativeElement.querySelector('.button__link');
    noBtn.click();
    expect(component.dialogRef.close).toHaveBeenCalledWith(false);
  });
});
