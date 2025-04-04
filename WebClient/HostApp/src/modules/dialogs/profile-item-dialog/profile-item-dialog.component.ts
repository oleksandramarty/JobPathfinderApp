import {Component, Inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslationPipe} from '@amarty/pipes';
import {GenericInputComponent} from '@amarty/components';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {BaseUnsubscribeComponent} from '@amarty/common';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {
  DataItem,
  InputError,
  UserProfileItemEnum,
  UserProfileItemResponse,
  UserResponse
} from '@amarty/models';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DictionaryService, LoaderService, LocalizationService} from '@amarty/services';
import {UserApiClient} from '@amarty/api';
import {Store} from '@ngrx/store';
import {takeUntil, tap} from 'rxjs';
import {itemTypeTitle} from '../../profile-area/base-profile-section.component';
import {selectUser} from '@amarty/store';

@Component({
  selector: 'app-profile-item-dialog',
  imports: [
    CommonModule,
    TranslationPipe,
    GenericInputComponent,
    MatDialogTitle
  ],
  standalone: true,
  templateUrl: './profile-item-dialog.component.html',
  styleUrl: './profile-item-dialog.component.scss'
})
export class ProfileItemDialogComponent extends BaseUnsubscribeComponent{
  public profileItemForm: FormGroup | undefined;
  public profileItem: UserProfileItemResponse | undefined;
  public profileItemType: UserProfileItemEnum | undefined;
  public submitted: boolean = false;
  public dateInputError: InputError[] | undefined;

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
    this.createFormGroup();
  }

  override ngOnInit(): void {
    this.title = `COMMON.ADD_${itemTypeTitle(this.profileItemType)}`;

    this.store.select(selectUser)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        tap(user => {
          this.currentUser = user;
        })
      ).subscribe();

    super.ngOnInit();
  }

  get countries(): DataItem[] | undefined {
    return this.dictionaryService.countryDataItems;
  }

  get jobTypes(): DataItem[] | undefined {
    return this.dictionaryService.jobTypeDataItems;
  }

  get workArrangements(): DataItem[] | undefined {
    return this.dictionaryService.workArrangementDataItems;
  }

  get languages(): DataItem[] | undefined {
    return this.dictionaryService.languageDataItems?.filter(
      item =>
        this.currentUser?.languages?.findIndex(
          lang => lang.id === item.id));
  }

  get skills(): DataItem[] | undefined {
    return this.dictionaryService.skillDataItems?.filter(
      item =>
        this.currentUser?.skills?.findIndex(
          skill => skill.id === item.id));
  }

  createFormGroup(): void {
    if (!!this.profileItemForm) {
      return
    }

    this.profileItemForm = new FormGroup({
      startDate: new FormControl(this.profileItem?.startDate, [Validators.required]),
      endDate: new FormControl(this.profileItem?.endDate),
      position: new FormControl(this.profileItem?.position, [Validators.required]),
      description: new FormControl(this.profileItem?.description),
      company: new FormControl(this.profileItem?.company, [Validators.required]),
      location: new FormControl(this.profileItem?.location),
      countryId: new FormControl(this.profileItem?.countryId, [Validators.required]),
      jobTypeId: new FormControl(this.profileItem?.jobTypeId, [Validators.required]),
      workArrangementId: new FormControl(this.profileItem?.workArrangementId, [Validators.required]),
      languages: new FormControl(this.profileItem?.languages),
      skills: new FormControl(this.profileItem?.skills)
    });

    this.profileItemForm?.valueChanges
      .pipe(
        takeUntil(this.ngUnsubscribe),
        tap(values => {
          const { startDate, endDate } = values;

          if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);

            this.dateInputError = start > end ? [{ error: 'COMMON.WRONG_DATE' }] : undefined;
          } else {
            this.dateInputError = undefined;
          }
        })
      )
      .subscribe();
  }

  public proceedItem(): void {
    this.submitted = true;
    if (this.profileItemForm?.invalid ||
      !this.profileItemForm?.value.skillId ||
      !this.profileItemForm?.value.skillLevelId ||
      !!this.dateInputError) {
      this.snackBar.open(
        'Fix the errors before submitting',
        'OK',
        {
          duration: 5000,
          panelClass: ['error']
        });
      return;
    }

    this.dialogRef.close(this.profileItemForm?.value);
  }
}
