import { TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LocalizationService } from '@amarty/services';
import { InputForm, InputFormGroup, InputError, BaseIdEntityOfGuid } from '@amarty/models';
import { of, throwError, Subject } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms'; // For mock form
import { ProfileUserGenericProfileItem } from './profile-user-generic-profile-item';
import { ApolloQueryResult } from '@apollo/client/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations'; // For MatSnackBar
import { LOCALIZATION_KEYS } from '@amarty/localizations';

// Define mock types for generic arguments
type MockItemType = { id?: string; name: string };
type MockDialogType = {}; // Simple mock dialog type
type MockCreateData = { createMockItem: BaseIdEntityOfGuid };
type MockUpdateData = { updateMockItem: BaseIdEntityOfGuid };


// Concrete implementation for testing
class TestableProfileItem extends ProfileUserGenericProfileItem<
  MockItemType,
  MockDialogType,
  MockCreateData,
  MockUpdateData
> {
  constructor(
    dialogRef: MatDialogRef<MockDialogType>,
    snackBar: MatSnackBar,
    localizationService: LocalizationService,
  ) {
    super(dialogRef, snackBar, localizationService, 'createMockItem', 'updateMockItem');
    this.buildForm(); // Call buildForm in constructor for testing
  }

  // Mock implementation for abstract methods
  protected buildForm(): void {
    this.renderForm = {
      inputFormGroup: new FormGroup({
        name: new FormControl('', Validators.required),
        existingIdField: new FormControl('') // For onExistingIdValueChange test
      })
    } as InputForm; // Cast to InputForm, assuming other properties are not critical for these tests
  }

  public userProfileGenericInput(): any {
    return { name: this.renderForm?.inputFormGroup?.get('name')?.value };
  }

  public createMutation$ = jest.fn(() => of({ data: { createMockItem: { id: 'new-id' } } } as ApolloQueryResult<MockCreateData>));
  public updateMutation$ = jest.fn(() => of({ data: { updateMockItem: { id: this.genericItem?.id || 'updated-id' } } } as ApolloQueryResult<MockUpdateData>));

  // Expose for testing
  public testOnExistingIdValueChange(existingIdName: string) {
    this.onExistingIdValueChange(existingIdName);
  }
}

// Mocks for services
class MockMatDialogRef {
  close = jest.fn();
}

class MockMatSnackBar {
  open = jest.fn();
}

class MockLocalizationService {
  handleApiError = jest.fn();
  showError = jest.fn();
  getLocalizedText = jest.fn(key => key); // Simple passthrough
}


describe('ProfileUserGenericProfileItem', () => {
  let component: TestableProfileItem;
  let mockDialogRef: MockMatDialogRef;
  let mockSnackBar: MockMatSnackBar;
  let mockLocalizationService: MockLocalizationService;

  beforeEach(() => {
    mockDialogRef = new MockMatDialogRef();
    mockSnackBar = new MockMatSnackBar();
    mockLocalizationService = new MockLocalizationService();

    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule], // For MatSnackBar
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: LocalizationService, useValue: mockLocalizationService },
      ]
    });

    component = new TestableProfileItem(
      TestBed.inject(MatDialogRef) as MatDialogRef<MockDialogType>, // Cast needed
      TestBed.inject(MatSnackBar),
      TestBed.inject(LocalizationService)
    );
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
    expect(component.renderForm).toBeDefined();
  });

  describe('submitForm', () => {
    it('should show snackbar and errors if form is invalid', () => {
      component.renderForm!.inputFormGroup!.get('name')!.setValue(''); // Make form invalid
      component.submitForm();
      expect(mockSnackBar.open).toHaveBeenCalledWith(
        LOCALIZATION_KEYS.COMMON.FIX_ERROR_BEFORE_CONTINUE,
        LOCALIZATION_KEYS.COMMON.BUTTON.OK,
        expect.any(Object)
      );
      expect(component.createMutation$).not.toHaveBeenCalled();
      expect(component.updateMutation$).not.toHaveBeenCalled();
    });

    it('should show snackbar and errors if genericItemInputError is present', () => {
      component.renderForm!.inputFormGroup!.get('name')!.setValue('Test Name');
      component.genericItemInputError = [{ error: 'Test input error' }];
      component.submitForm();
      expect(mockSnackBar.open).toHaveBeenCalled();
      expect(mockLocalizationService.showError).toHaveBeenCalledWith('Test input error');
      expect(component.createMutation$).not.toHaveBeenCalled();
    });

    it('should call createUserGenericProfileItem if form is valid and no genericItem (create mode)', () => {
      component.renderForm!.inputFormGroup!.get('name')!.setValue('New Item');
      component.genericItem = undefined; // Ensure create mode
      component.submitForm();
      expect(component.createMutation$).toHaveBeenCalled();
      expect(mockDialogRef.close).toHaveBeenCalledWith('new-id');
    });

    it('should call updateUserGenericProfileItem if form is valid and genericItem exists (update mode)', () => {
      component.renderForm!.inputFormGroup!.get('name')!.setValue('Updated Item');
      component.genericItem = { id: 'item-1', name: 'Old Item' }; // Ensure update mode
      component.submitForm();
      expect(component.updateMutation$).toHaveBeenCalled();
      expect(mockDialogRef.close).toHaveBeenCalledWith(true);
    });

    it('should handle error during createMutation', () => {
      component.renderForm!.inputFormGroup!.get('name')!.setValue('New Item');
      component.genericItem = undefined;
      const error = new Error('Create failed');
      component.createMutation$.mockReturnValue(throwError(() => error));
      component.submitForm();
      expect(mockLocalizationService.handleApiError).toHaveBeenCalledWith(error);
      expect(mockDialogRef.close).not.toHaveBeenCalled();
    });

    it('should handle error during updateMutation', () => {
      component.renderForm!.inputFormGroup!.get('name')!.setValue('Updated Item');
      component.genericItem = { id: 'item-1', name: 'Old Item' };
      const error = new Error('Update failed');
      component.updateMutation$.mockReturnValue(throwError(() => error));
      component.submitForm();
      expect(mockLocalizationService.handleApiError).toHaveBeenCalledWith(error);
      expect(mockDialogRef.close).not.toHaveBeenCalled();
    });
  });

  describe('onExistingIdValueChange', () => {
    it('should set genericItemInputError if ID exists', (done) => {
      component.genericItem = undefined; // Only checks when creating new
      component.existingIds = ['123', '456'];
      component.testOnExistingIdValueChange('existingIdField'); // Call the exposed method

      const control = component.renderForm!.inputFormGroup!.get('existingIdField')!;
      control.setValue('123'); // Simulate user input

      // Allow microtask queue to flush for the tap operator
      Promise.resolve().then(() => {
        expect(component.genericItemInputError).toEqual([{ error: LOCALIZATION_KEYS.ERROR.ALREADY_EXISTS }]);
        done();
      });
    });

    it('should clear genericItemInputError if ID does not exist', (done) => {
      component.genericItem = undefined;
      component.existingIds = ['123', '456'];
      component.testOnExistingIdValueChange('existingIdField');

      const control = component.renderForm!.inputFormGroup!.get('existingIdField')!;
      control.setValue('789'); 

      Promise.resolve().then(() => {
        expect(component.genericItemInputError).toBeUndefined();
        done();
      });
    });
    
    it('should not attach listener if genericItem is defined (update mode)', () => {
        component.genericItem = { id: 'item-1', name: 'Some name' };
        // To properly test this, we'd need to spy on the 'pipe' method of the valueChanges observable.
        // However, the valueChanges is an observable, so we check if it's not subscribed by checking side effects.
        // For this test, we'll assume if genericItem is set, the subscription logic inside onExistingIdValueChange is skipped.
        // A more robust test would involve spying on `pipe` on the specific control's valueChanges.
        // For now, this test is more of a conceptual check.
        const control = component.renderForm!.inputFormGroup!.get('existingIdField')!;
        const valueChangesSpy = jest.spyOn(control.valueChanges, 'pipe');
        component.testOnExistingIdValueChange('existingIdField');
        expect(valueChangesSpy).not.toHaveBeenCalled(); // This confirms the `pipe` method wasn't called on valueChanges
    });
  });
  
  it('should unsubscribe on ngOnDestroy', () => {
    const ngUnsubscribeCompleteSpy = jest.spyOn(component.ngUnsubscribe, 'complete');
    const ngUnsubscribeNextSpy = jest.spyOn(component.ngUnsubscribe, 'next');
    component.ngOnDestroy();
    expect(ngUnsubscribeNextSpy).toHaveBeenCalled();
    expect(ngUnsubscribeCompleteSpy).toHaveBeenCalled();
  });
});
