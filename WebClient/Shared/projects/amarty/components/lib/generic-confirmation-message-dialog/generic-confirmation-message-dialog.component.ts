import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SanitizeHtmlPipe, TranslationPipe } from '@amarty/pipes';

@Component({
  selector: 'app-generic-confirmation-message-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    TranslationPipe,
    SanitizeHtmlPipe
  ],
  templateUrl: './generic-confirmation-message-dialog.component.html',
  styleUrls: ['./generic-confirmation-message-dialog.component.scss']
})
export class GenericConfirmationMessageDialogComponent {
  yesBtn: string | undefined;
  noBtn: string | undefined;
  title: string | undefined;
  descriptions: string[] | undefined;
  htmlBlock: string | undefined;

  constructor(
    public dialogRef: MatDialogRef<GenericConfirmationMessageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      yesBtn?: string;
      noBtn?: string;
      title?: string;
      descriptions?: string[];
      htmlBlock?: string;
    } | undefined,
  ) {
    this.yesBtn = data?.yesBtn;
    this.noBtn = data?.noBtn;
    this.title = data?.title;
    this.descriptions = data?.descriptions;
    this.htmlBlock = data?.htmlBlock;
  }
}
