import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationPipe } from '@amarty/pipes';
import { GenericFormRendererComponent } from '@amarty/components';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import {
  BaseIdEntityOfGuid,
  BaseBoolResponse,
  DataItem,
  UserProfileItemEnum,
  UserProfileItemResponse,
  UserResponse
} from '@amarty/models';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DictionaryService, LocalizationService } from '@amarty/services';
import { Store } from '@ngrx/store';
import {Observable, takeUntil, tap} from 'rxjs';
import { ApolloQueryResult } from '@apollo/client';
import { GraphQlProfileService } from '../../../utils/api/services/graph-ql-profile.service';
import { ProfileUserGenericProfileItem } from '../../profile-area/utils/profile-user-generic-profile-item';
import { selectUser } from '@amarty/store';
import { ProfileFormFactory } from '../../profile-area/utils/form-renderer/profile-form.factory';
import {formatDateToYMD, mapEnumValue} from '@amarty/utils';

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
export class ProfileItemDialogComponent
  extends ProfileUserGenericProfileItem<
    UserProfileItemResponse,
    ProfileItemDialogComponent,
    { profile_create_user_profile_item: BaseIdEntityOfGuid | undefined },
    { profile_update_user_profile_item: BaseBoolResponse | undefined }
  >
{
  public profileItemType: UserProfileItemEnum | undefined;
  public title: string | undefined;
  public currentUser: UserResponse | undefined;

  constructor(
    override readonly dialogRef: MatDialogRef<ProfileItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      profileItem: UserProfileItemResponse | undefined,
      profileItemType: UserProfileItemEnum | undefined,
      title: string | undefined;
    },
    override readonly snackBar: MatSnackBar,
    override readonly localizationService: LocalizationService,
    private readonly dictionaryService: DictionaryService,
    private readonly store: Store,
    private readonly graphQlProfileService: GraphQlProfileService
  ) {
    super(
      dialogRef,
      snackBar,
      localizationService,
      'profile_create_user_profile_item',
      'profile_update_user_profile_item'
    );

    this.genericItem = data?.profileItem;
    this.profileItemType = data?.profileItemType;
    this.title = data?.title;
  }

  override ngOnInit(): void {
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

  protected override buildForm(): void {
    this.renderForm = ProfileFormFactory.createProfileItemForm(
      this.profileItemType ?? UserProfileItemEnum.Experience,
      this.genericItem,
      this.countries,
      this.jobTypes,
      this.workArrangements,
      () => this.submitForm(),
      () => this.dialogRef.close(false)
    );
  }

  protected override userProfileGenericInput(): any {
    const formValue = this.renderForm!.inputFormGroup?.value;

    return {
      ...formValue,
      userId: this.currentUser?.id,
      profileItemType: Number(formValue.profileItemType),
      startDate: formValue.startDate ? formatDateToYMD(formValue.startDate) : null,
      endDate: formValue.endDate ? formatDateToYMD(formValue.endDate) : null,
      countryId: formValue.countryId ? Number(formValue.countryId) : null,
      jobTypeId: formValue.jobTypeId ? Number(formValue.jobTypeId) : null,
      workArrangementId: formValue.workArrangementId ? Number(formValue.workArrangementId) : null,
    };
  }

  protected override createMutation$(): Observable<ApolloQueryResult<{ profile_create_user_profile_item: BaseIdEntityOfGuid | undefined }>> {
    return this.graphQlProfileService.createUserProfileItem(this.userProfileGenericInput());
  }

  protected override updateMutation$(): Observable<ApolloQueryResult<{ profile_update_user_profile_item: BaseBoolResponse | undefined }>> {
    return this.graphQlProfileService.updateUserProfileItem(this.genericItem!.id!, this.userProfileGenericInput());
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
}
