import { Injectable, Type } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { take, tap } from 'rxjs';
import {traceCreation} from '@amarty/utils';


@Injectable({
  providedIn: 'root'
})
export class CommonDialogService {
  constructor(
    private readonly dialog: MatDialog
  ) {
    traceCreation(this);
  }

  public showDialog<TDialog, TDialogResult>(
    dialogComp: Type<any>,
    dialogConfig?: MatDialogConfig,
    executableAction?: (result: TDialogResult) => void,
    executableCancelAction?: () => void
  ): void {
    this._handleExecutableAction<TDialog, TDialogResult>(
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

  private _handleExecutableAction<TDialogRef, TDialogResult>(
    dialogRef: MatDialogRef<TDialogRef, any>,
    executableAction?: (result: TDialogResult) => void,
    executableCancelAction?: () => void): void {
    dialogRef.afterClosed()
      .pipe(
        take(1),
        tap((result: TDialogResult) => {
          result && executableAction && executableAction(result);
          !result && executableCancelAction && executableCancelAction();
        })
      ).subscribe();
  }
}
