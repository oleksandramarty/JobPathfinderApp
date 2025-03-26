import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import {SanitizeHtmlPipe, TranslationPipe} from '@amarty/utils/pipes'
import {generateRandomId, traceCreation} from '@amarty/utils'

@Component({
    selector: 'app-confirmation-message-dialog',
    imports: [
      CommonModule,
      TranslationPipe,
      SanitizeHtmlPipe,
      MatButtonModule,
      MatDialogTitle
    ],
  standalone: true,
  templateUrl: './confirmation-message-dialog.component.html',
  styleUrls: ['./confirmation-message-dialog.component.scss'],
  host: { 'data-id': generateRandomId(12) }
})
export class ConfirmationMessageDialogComponent {
  yesBtn: string | undefined;
  noBtn: string | undefined;
  title: string | undefined;
  descriptions: string[] | undefined;
  htmlBlock: string | undefined;

  constructor(
    public dialogRef: MatDialogRef<ConfirmationMessageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      yesBtn: string | undefined,
      noBtn: string | undefined,
      title: string | undefined,
      descriptions?: string[] | undefined,
      htmlBlock?: string | undefined;
    } | undefined,
  ) {
    traceCreation(this);
    this.yesBtn = data?.yesBtn;
    this.noBtn = data?.noBtn;
    this.title = data?.title;
    this.descriptions = data?.descriptions;
    this.htmlBlock = data?.htmlBlock;
  }
}
