import { UserResponse } from '@amarty/models';
import { BaseUnsubscribeComponent } from '@amarty/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  @Output() currentUserChange: EventEmitter<UserResponse> = new EventEmitter<UserResponse>();

  constructor(
    private readonly dialogService: CommonDialogService,
    private readonly snackBar: MatSnackBar
  ) {
    super();
  }

  get userDisplayName(): string {
    const parts: string[] = [];
    let hasName: boolean = false;

    if (this.currentUser?.firstName) {
      parts.push(this.currentUser.firstName);
      hasName = true;
    }

    if (this.currentUser?.lastName) {
      parts.push(this.currentUser.lastName);
      hasName = true;
    }

    const namePart = parts.length > 0 ? parts.join(' ') : '';
    const loginPart = this.currentUser?.login ? this.currentUser.login : '';

    return namePart + (hasName ? ' | ' : '') + loginPart;
  }

  public openEditProfileDialog(): void {
    const executableAction = (model: UserResponse | undefined) => {
      const isCurrentUserChanged =
        this.currentUser?.firstName !== model?.firstName ||
        this.currentUser?.lastName !== model?.lastName ||
        this.currentUser?.login !== model?.login ||
        this.currentUser?.email !== model?.email ||
        this.currentUser?.phone !== model?.phone ||
        this.currentUser?.headline !== model?.headline ||
        this.currentUser?.userSetting?.defaultLocale !== model?.userSetting?.defaultLocale ||
        this.currentUser?.userSetting?.timeZone !== model?.userSetting?.timeZone ||
        this.currentUser?.userSetting?.countryId !== model?.userSetting?.countryId ||
        this.currentUser?.userSetting?.currencyId !== model?.userSetting?.currencyId ||
        this.currentUser?.userSetting?.linkedInUrl !== model?.userSetting?.linkedInUrl ||
        this.currentUser?.userSetting?.npmUrl !== model?.userSetting?.npmUrl ||
        this.currentUser?.userSetting?.gitHubUrl !== model?.userSetting?.gitHubUrl ||
        this.currentUser?.userSetting?.applicationAiPrompt !== model?.userSetting?.applicationAiPrompt ||
        this.currentUser?.userSetting?.showCurrentPosition !== model?.userSetting?.showCurrentPosition ||
        this.currentUser?.userSetting?.showHighestEducation !== model?.userSetting?.showHighestEducation;

      this.currentUser = model;

      if (isCurrentUserChanged) {
        this.currentUserChange.emit(this.currentUser);
      }
    };

    this.dialogService.showDialog<UserPreferencesDialogComponent, any>(
      UserPreferencesDialogComponent,
      {
        data: {
          user: { ...this.currentUser },
        },
        width: '800px',
        maxWidth: '90vw',
      },
      executableAction
    );
  }
}
