import { Injectable, Type } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { take, tap } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CommonDialogService {
  constructor(
    private readonly dialog: MatDialog
  ) {}

  public showDialog<TDialog>(
    dialogComp: Type<any>,
    dialogConfig?: MatDialogConfig,
    executableAction?: () => void,
    executableCancelAction?: () => void
  ): void {
    this._handleExecutableAction<TDialog>(
      this._getDialog<TDialog>(dialogComp, dialogConfig),
      executableAction,
      executableCancelAction
    );
  }

  private _getDialog<TDialog>(
    dialogComp: Type<any>,
    dialogConfig?: MatDialogConfig
  ): MatDialogRef<TDialog, any> {
    return this.dialog.open(dialogComp, dialogConfig);
  }

  private _handleExecutableAction<TDialogRef>(
    dialogRef: MatDialogRef<TDialogRef, any>,
    executableAction?: () => void,
    executableCancelAction?: () => void): void {
    dialogRef.afterClosed()
      .pipe(
        take(1),
        tap((result) => {
          result && executableAction && executableAction();
          !result && executableCancelAction && executableCancelAction();
        })
      ).subscribe();
  }
}
