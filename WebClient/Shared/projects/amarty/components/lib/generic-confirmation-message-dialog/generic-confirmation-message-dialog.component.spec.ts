import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericConfirmationMessageDialogComponent } from './generic-confirmation-message-dialog.component';

describe('ConfirmationMessageComponent', () => {
  let component: GenericConfirmationMessageDialogComponent;
  let fixture: ComponentFixture<GenericConfirmationMessageDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericConfirmationMessageDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenericConfirmationMessageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
