import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationPipe } from '@amarty/pipes';
import { GenericFormRendererComponent } from '@amarty/components';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { BaseUnsubscribeComponent } from '@amarty/common';
import {
  DataItem,
  InputForm,
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
import { ProfileFormFactory } from '../../../utils/profile-form.factory';

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
    this.renderForm = ProfileFormFactory.createProfileItemForm(
      this.profileItemType ?? UserProfileItemEnum.Experience,
      this.profileItem,
      this.countries,
      this.jobTypes,
      this.workArrangements,
      () => this.proceedItem(),
      () => this.dialogRef.close()
    );
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
