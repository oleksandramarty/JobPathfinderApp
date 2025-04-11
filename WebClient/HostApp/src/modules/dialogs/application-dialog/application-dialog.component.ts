import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { generateRandomId } from '@amarty/utils';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { takeUntil, tap } from 'rxjs';
import { TranslationPipe } from '@amarty/pipes';
import { BaseUnsubscribeComponent } from '@amarty/common';
import { DictionaryService } from '@amarty/services';
import { selectUser } from '@amarty/store';
import { InputForm, UserResponse } from '@amarty/models';
import {GenericFormRendererComponent, GenericInputComponent} from '@amarty/components';
import { LOCALIZATION_KEYS } from '@amarty/localizations';
import {ApplicationFormFactory} from '../../../utils/application-form.factory';

@Component({
  selector: 'app-application-dialog',
  standalone: true,
  imports: [
    CommonModule,
    TranslationPipe,
    MatDialogTitle,
    GenericFormRendererComponent,
    GenericInputComponent
  ],
  templateUrl: './application-dialog.component.html',
  styleUrl: './application-dialog.component.scss',
  host: { 'data-id': generateRandomId(12) }
})
export class ApplicationDialogComponent extends BaseUnsubscribeComponent {
  public renderForm: InputForm | undefined;
  public submitted = false;
  public aiPrompt = false;
  public user: UserResponse | undefined;

  private readonly isEdit: boolean;

  constructor(
    public dialogRef: MatDialogRef<ApplicationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { applicationId?: string } | undefined,
    private readonly snackBar: MatSnackBar,
    private readonly store: Store,
    private readonly dictionaryService: DictionaryService
  ) {
    super();
    this.isEdit = !!data?.applicationId;
  }

  override ngOnInit(): void {
    this.store.select(selectUser)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        tap(user => {
          this.user = user;
          this.aiPrompt = !!user?.userSetting?.applicationAiPrompt;
          this.buildForm();
        })
      )
      .subscribe();
  }

  get dialogTitle(): string {
    return this.isEdit
      ? LOCALIZATION_KEYS.COMMON.BUTTON.EDIT
      : LOCALIZATION_KEYS.COMMON.BUTTON.CREATE;
  }

  private buildForm(): void {
    this.renderForm = ApplicationFormFactory.createApplicationForm(
      this.isEdit,
      this.user,
      this.dictionaryService.experienceLevelDataItems ?? [],
      this.dictionaryService.jobTypeDataItems ?? [],
      this.dictionaryService.jobSourceDataItems ?? [],
      this.dictionaryService.currencyDataItems ?? [],
      () => this.onSubmit(),
      () => this.dialogRef.close(false)
    );
  }

  public onSubmit(): void {
    this.submitted = true;
    if (this.renderForm?.inputFormGroup?.invalid) {
      this.snackBar.open(
        LOCALIZATION_KEYS.COMMON.FIX_ERROR_BEFORE_CONTINUE,
        LOCALIZATION_KEYS.COMMON.BUTTON.OK,
        { duration: 5000, panelClass: ['error'] }
      );
      return;
    }

    this.dialogRef.close(this.renderForm!.inputFormGroup!.value);
  }

  public parsePrompt(): void {
    if (!this.renderForm?.inputFormGroup) return;

    try {
      const model = JSON.parse(this.renderForm.inputFormGroup.get('prompt')?.value ?? '{}');
      Object.entries(model).forEach(([key, value]) => {
        if (this.renderForm?.inputFormGroup?.get(key)) {
          this.renderForm.inputFormGroup.get(key)?.setValue(value);
        }
      });
    } catch (e) {
      console.warn('Invalid JSON prompt');
    }
  }
}

// <pre class="code"><code>&#123;
// "title": "Senior Angular Developer",
//   "company": "ABC Company",
//   "location": "Montreal",
//   "jobType": "full-time",
//   "source": null,
//   "salaryFrom": 80000,
//   "salaryTo": 100000,
//   "currency": "CAD",
//   "postedDate": "2025-03-10",
//   "applicationDeadline": "2025-03-20",
//   "contactEmail": "jobs&#64;abc.com",
//   "applicationLink": "https://abc.com/job",
//   "notes": null
// &#125;</code></pre>
