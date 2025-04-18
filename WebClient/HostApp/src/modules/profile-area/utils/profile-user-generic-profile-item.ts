import { Directive } from '@angular/core';
import { BaseUnsubscribeComponent } from '@amarty/common';
import { BaseIdEntityOfGuid, InputError, InputForm } from '@amarty/models';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LocalizationService } from '@amarty/services';
import { catchError, Observable, takeUntil, tap, throwError } from 'rxjs';
import { LOCALIZATION_KEYS } from '@amarty/localizations';
import { MatDialogRef } from '@angular/material/dialog';
import { ApolloQueryResult } from '@apollo/client';

@Directive()
export abstract class ProfileUserGenericProfileItem<
  TUserGenericProfileItem,
  TUserGenericProfileItemDialog,
  TCreateGraphQlData = any,
  TUpdateGraphQlData = any,
> extends BaseUnsubscribeComponent {
  public renderForm: InputForm | undefined;
  public genericItem: TUserGenericProfileItem | undefined;
  public existingIds: string[] | undefined;
  public submitted = false;
  public genericItemInputError: InputError[] | undefined;

  protected readonly LOCALIZATION_KEYS = LOCALIZATION_KEYS;

  constructor(
    protected readonly dialogRef: MatDialogRef<TUserGenericProfileItemDialog>,
    protected readonly snackBar: MatSnackBar,
    protected readonly localizationService: LocalizationService,
    protected readonly createDataKey: keyof TCreateGraphQlData,
    protected readonly updateDataKey: keyof TUpdateGraphQlData,
  ) {
    super();
  }

  protected abstract buildForm(): void;

  protected onExistingIdValueChange(existingIdName: string): void {
    if (!this.genericItem) {
      this.renderForm?.inputFormGroup?.get(existingIdName)?.valueChanges
        .pipe(
          takeUntil(this.ngUnsubscribe),
          tap(existingId => {
            this.genericItemInputError =
              (this.existingIds?.includes(String(existingId)) ?? false)
                ? [{ error: LOCALIZATION_KEYS.ERROR.ALREADY_EXISTS }]
                : undefined;
          })
        )
        .subscribe();
    }
  }

  public submitForm(): void {
    this.submitted = true;

    if (!this.renderForm?.inputFormGroup || this.renderForm.inputFormGroup.invalid || this.genericItemInputError) {
      this.snackBar.open(
        LOCALIZATION_KEYS.COMMON.FIX_ERROR_BEFORE_CONTINUE,
        LOCALIZATION_KEYS.COMMON.BUTTON.OK,
        { duration: 5000, panelClass: ['error'] }
      );

      if (this.genericItemInputError) {
        this.genericItemInputError.forEach(error => {
          if (error.error) {
            this.localizationService.showError(error.error);
          }
        });
      }

      return;
    }

    if (this.genericItem) {
      this.updateUserGenericProfileItem();
    } else {
      this.createUserGenericProfileItem();
    }
  }

  protected abstract userProfileGenericInput(): any;

  protected abstract createMutation$(): Observable<ApolloQueryResult<TCreateGraphQlData>>;
  protected abstract updateMutation$(): Observable<ApolloQueryResult<TUpdateGraphQlData>>;

  protected createUserGenericProfileItem(): void {
    this.createMutation$()
      .pipe(
        takeUntil(this.ngUnsubscribe),
        tap((result: ApolloQueryResult<TCreateGraphQlData>) => {
          const id = (result.data?.[this.createDataKey] as BaseIdEntityOfGuid | undefined)?.id;
          this.dialogRef.close(id);
        }),
        catchError(err => {
          this.localizationService.handleApiError(err);
          return throwError(() => err);
        })
      )
      .subscribe();
  }

  protected updateUserGenericProfileItem(): void {
    this.updateMutation$()
      .pipe(
        takeUntil(this.ngUnsubscribe),
        tap(() => this.dialogRef.close(true)),
        catchError(err => {
          this.localizationService.handleApiError(err);
          return throwError(() => err);
        })
      )
      .subscribe();
  }
}
