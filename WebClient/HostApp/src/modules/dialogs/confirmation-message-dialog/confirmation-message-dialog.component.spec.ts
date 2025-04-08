import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationMessageDialogComponent } from './confirmation-message-dialog.component';

describe('ConfirmationMessageComponent', () => {
  let component: ConfirmationMessageDialogComponent;
  let fixture: ComponentFixture<ConfirmationMessageDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmationMessageDialogComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ConfirmationMessageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
