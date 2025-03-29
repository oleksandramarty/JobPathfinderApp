import { UserResponse } from '@amarty/api';
import { BaseUnsubscribeComponent } from '@amarty/shared/components';
import { Component, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserPreferencesDialogComponent } from '../../dialogs/user-preferences-dialog/user-preferences-dialog.component';
import { CommonDialogService } from '@amarty/services';
import { CommonModule } from '@angular/common';
import { TranslationPipe } from '@amarty/utils/pipes';

@Component({
  selector: 'app-profile-info',
  imports: [
    CommonModule,
    TranslationPipe
  ],
  standalone: true,
  templateUrl: './profile-info.component.html',
  styleUrl: '../profile-area.component.scss'
})
export class ProfileInfoComponent extends BaseUnsubscribeComponent {
  @Input() currentUser: UserResponse | undefined;
  @Input() countryCode: string | undefined;

  constructor(
    private readonly dialogService: CommonDialogService,
    private readonly snackBar: MatSnackBar
  ) {
    super();
  }

  public openEditProfileDialog(): void {
    this.dialogService.showDialog<UserPreferencesDialogComponent, any>(
      UserPreferencesDialogComponent,
      {
        width: '800px',
        maxWidth: '90vw',
      });
  }
}
