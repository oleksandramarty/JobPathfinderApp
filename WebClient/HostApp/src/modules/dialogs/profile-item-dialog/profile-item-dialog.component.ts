import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationPipe } from '@amarty/pipes';
import { GenericFormRendererComponent } from '@amarty/components';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { BaseUnsubscribeComponent } from '@amarty/common';
import {
  DataItem,
  InputForm,
  InputFormBuilder,
  InputFormItemBuilder,
  UserProfileItemEnum,
  UserProfileItemResponse,
  UserResponse
} from '@amarty/models';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DictionaryService, LoaderService, LocalizationService } from '@amarty/services';
import { UserApiClient } from '@amarty/api';
import { Store } from '@ngrx/store';
import { takeUntil, tap } from 'rxjs';
import { itemTypeTitle } from '../../profile-area/base-profile-section.component';
import { selectUser } from '@amarty/store';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-profile-item-dialog',
  standalone: true,
  imports: [
    CommonModule,
    TranslationPipe,
    GenericFormRendererComponent,
    MatDialogTitle
  ],
  templateUrl: './profile-item-dialog.component.html',
  styleUrl: './profile-item-dialog.component.scss'
})
export class ProfileItemDialogComponent extends BaseUnsubscribeComponent {
  public renderForm: InputForm | undefined;
  public profileItem: UserProfileItemResponse | undefined;
  public profileItemType: UserProfileItemEnum | undefined;
  public submitted = false;
  public currentUser: UserResponse | undefined;
  public title: string | undefined;

  constructor(
    public dialogRef: MatDialogRef<ProfileItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      profileItem: UserProfileItemResponse | undefined,
      profileItemType: UserProfileItemEnum | undefined;
    } | undefined,
    private readonly snackBar: MatSnackBar,
    private readonly localizationService: LocalizationService,
    private readonly loaderService: LoaderService,
    private readonly userApiClient: UserApiClient,
    private readonly dictionaryService: DictionaryService,
    private readonly store: Store
  ) {
    super();

    this.profileItem = data?.profileItem;
    this.profileItemType = data?.profileItemType;
  }

  override ngOnInit(): void {
    this.title = `COMMON.ADD_${itemTypeTitle(this.profileItemType)}`;

    this.store.select(selectUser)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        tap(user => {
          this.currentUser = user;
          this.buildForm();
        })
      ).subscribe();

    super.ngOnInit();
  }

  get countries(): DataItem[] {
    return this.dictionaryService.countryDataItems ?? [];
  }

  get jobTypes(): DataItem[] {
    return this.dictionaryService.jobTypeDataItems ?? [];
  }

  get workArrangements(): DataItem[] {
    return this.dictionaryService.workArrangementDataItems ?? [];
  }

  private buildForm(): void {
    const builder = new InputFormBuilder();

    builder.addGridItem([
      new InputFormItemBuilder('position', 'input')
        .withLabel('COMMON.POSITION')
        .withPlaceholder('COMMON.POSITION')
        .withValidators([Validators.required])
        .withDefaultValue(this.profileItem?.position),
      new InputFormItemBuilder('company', 'input')
        .withLabel('COMMON.COMPANY')
        .withPlaceholder('COMMON.COMPANY')
        .withValidators([Validators.required])
        .withDefaultValue(this.profileItem?.company)
    ], 1)
      .addGridItem([
        new InputFormItemBuilder('startDate', 'datepicker')
          .withLabel('COMMON.START_DATE')
          .withValidators([Validators.required])
          .withDefaultValue(this.profileItem?.startDate),
        new InputFormItemBuilder('endDate', 'datepicker')
          .withLabel('COMMON.END_DATE')
          .withDefaultValue(this.profileItem?.endDate),
        new InputFormItemBuilder('location', 'input')
          .withLabel('COMMON.LOCATION')
          .withPlaceholder('COMMON.LOCATION')
          .withDefaultValue(this.profileItem?.location),
        new InputFormItemBuilder('countryId', 'autocomplete')
          .withLabel('COMMON.COUNTRY')
          .withPlaceholder('COMMON.COUNTRY')
          .withDataItems(this.countries)
          .withValidators([Validators.required])
          .withDefaultValue(this.profileItem?.countryId),
        new InputFormItemBuilder('jobTypeId', 'autocomplete')
          .withLabel('COMMON.JOB_TYPE')
          .withPlaceholder('COMMON.JOB_TYPE')
          .withDataItems(this.jobTypes)
          .withValidators([Validators.required])
          .withDefaultValue(this.profileItem?.jobTypeId),
        new InputFormItemBuilder('workArrangementId', 'autocomplete')
          .withLabel('COMMON.WORK_ARRANGEMENT')
          .withPlaceholder('COMMON.WORK_ARRANGEMENT')
          .withDataItems(this.workArrangements)
          .withValidators([Validators.required])
          .withDefaultValue(this.profileItem?.workArrangementId),
      ], 2)
      .addGridItem([
        new InputFormItemBuilder('description', 'textarea')
          .withLabel('COMMON.DESCRIPTION')
          .withRows(2)
          .withMaxLength(500)
          .withDefaultValue(this.profileItem?.description)
      ], 1)
      .setSubmitted(false)
      .setClassName('modal__body grid-1fr grid-gap')
      .withCancelButton({
        buttonText: 'COMMON.CANCEL',
        showButton: true,
        className: 'button__link',
        onClick: () => this.dialogRef.close(false)
      })
      .withSubmitButton({
        buttonText: 'COMMON.PROCEED',
        showButton: true,
        className: 'button__filled__submit',
        onClick: () => this.proceedItem()
      });

    this.renderForm = builder.build();
  }

  public proceedItem(): void {
    this.submitted = true;

    if (this.renderForm?.inputFormGroup?.invalid) {
      this.snackBar.open(
        'Fix the errors before submitting',
        'OK',
        {
          duration: 5000,
          panelClass: ['error']
        });
      return;
    }

    this.dialogRef.close(this.renderForm!.inputFormGroup?.value);
  }
}
