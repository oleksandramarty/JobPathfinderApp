import { Component, Inject } from '@angular/core';
import {generateRandomId} from '@amarty/utils';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { GenericInputComponent } from '@amarty/components';
import { BaseUnsubscribeComponent } from '@amarty/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataItem, InputError } from '@amarty/models';
import { DictionaryService } from '@amarty/services';
import { Store } from '@ngrx/store';
import { selectUser } from '@amarty/store';
import { takeUntil, tap } from 'rxjs';
import { TranslationPipe } from '@amarty/pipes';

@Component({
  selector: 'app-application-dialog',
  imports: [
    CommonModule,
    TranslationPipe,
    MatButtonModule,
    MatDialogTitle,
    ReactiveFormsModule,
    FormsModule,
    GenericInputComponent
  ],
  standalone: true,
  templateUrl: './application-dialog.component.html',
  styleUrl: './application-dialog.component.scss',
  host: { 'data-id': generateRandomId(12) }
})
export class ApplicationDialogComponent extends BaseUnsubscribeComponent{
  private readonly _applicationId: string | undefined;

  public applicationForm: FormGroup | undefined;
  public submitted: boolean = false;
  public aiPrompt: boolean = false;
  public salaryInputError: InputError[] | undefined;

  constructor(
    public dialogRef: MatDialogRef<ApplicationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      applicationId?: string | undefined
    } | undefined,
    private readonly snackBar: MatSnackBar,
    private readonly dictionaryService: DictionaryService,
    private readonly store: Store
  ) {
    super();

    this._applicationId = data?.applicationId;

    this.store.select(selectUser)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        tap(user => {
          this.aiPrompt = !!user?.userSetting?.applicationAiPrompt;
        })
      )

    this.createFormGroup();
  }

  get dialogTitle(): string {
    return this._applicationId ? 'COMMON.EDIT' : 'COMMON.CREATE';
  }

  get saveButtonLabel(): string {
    return this._applicationId ? 'COMMON.EDIT' : 'COMMON.CREATE';
  }

  get experienceLevels(): DataItem[] {
    return this.dictionaryService.experienceLevelDataItems ?? [];
  }
  get jobTypes(): DataItem[] {
    return this.dictionaryService.jobTypeDataItems ?? [];
  }
  get jobSources(): DataItem[] {
    return this.dictionaryService.jobSourceDataItems ?? [];
  }

  get currencies(): DataItem[] {
    return this.dictionaryService.currencyDataItems ?? [];
  }

  createFormGroup(): void {
    this.applicationForm = new FormGroup({
      title: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      company: new FormControl('', Validators.required),
      location: new FormControl('', Validators.required),
      jobType: new FormControl('', Validators.required),
      source: new FormControl('', Validators.required),
      salaryFrom: new FormControl(null, [Validators.min(0)]),
      salaryTo: new FormControl(null, [Validators.min(0)]),
      currency: new FormControl(''),
      description: new FormControl('', [Validators.required, Validators.minLength(10)]),
      experienceLevel: new FormControl('', Validators.required),
      postedDate: new FormControl(new Date(), Validators.required),
      applicationDeadline: new FormControl(null),
      contactEmail: new FormControl('', [Validators.required, Validators.email]),
      applicationLink: new FormControl('', [Validators.pattern('https?://.+')]),
      notes: new FormControl(null),
      prompt: new FormControl(null),
    });
  }

  public onApplicationSubmit(): void {
    this.submitted = true;
    if (this.applicationForm?.invalid) {
      this.snackBar.open(
        'Fix the errors before submitting',
        'OK',
        {
          duration: 5000,
          panelClass: ['error']
        });
      return;
    }

    this.dialogRef.close(true)
  }

  public parsePrompt(): void {
    if (!this.applicationForm) {
      return;
    }
    const model = JSON.parse(this.applicationForm?.value.prompt);
    Object.keys(this.applicationForm.controls).forEach(controlName => {
      if (this.applicationForm?.get(controlName) && model[controlName]) {
        this.applicationForm?.get(controlName)?.setValue(model[controlName]);
      }
    });
  }
}
