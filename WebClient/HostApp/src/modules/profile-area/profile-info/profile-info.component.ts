import { UserResponse } from '@amarty/models';
import { BaseUnsubscribeComponent } from '@amarty/common';
import { Component, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserPreferencesDialogComponent } from '../../dialogs/user-preferences-dialog/user-preferences-dialog.component';
import { CommonDialogService } from '@amarty/services';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-info',
  imports: [
    CommonModule
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
    const executableAction = (model: UserResponse | undefined) => {
      this.currentUser = model;
    };

    this.dialogService.showDialog<UserPreferencesDialogComponent, any>(
      UserPreferencesDialogComponent,
      {
        data: {
          user: this.currentUser
        },
        width: '800px',
        maxWidth: '90vw',
      },
      executableAction
    );
  }
}
