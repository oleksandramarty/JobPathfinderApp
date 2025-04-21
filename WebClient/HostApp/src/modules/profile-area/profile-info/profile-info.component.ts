import {UserProfileItemEnum, UserProfileItemResponse, UserProfileResponse, UserResponse} from '@amarty/models';
import {BaseUnsubscribeComponent} from '@amarty/common';
import {Component, Input} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {UserPreferencesDialogComponent} from '../../dialogs/user-preferences-dialog/user-preferences-dialog.component';
import {CommonDialogService, DictionaryService, LocalizationService} from '@amarty/services';
import {CommonModule} from '@angular/common';
import {catchError, takeUntil, tap, throwError} from 'rxjs';
import {ApolloQueryResult} from '@apollo/client';
import {auth_setUser} from '@amarty/store';
import {Store} from '@ngrx/store';
import {GraphQlAuthService} from '../../../utils/api/services/graph-ql-auth.service';
import {TranslationPipe} from '@amarty/pipes';
import {LOCALIZATION_KEYS} from '@amarty/localizations';

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
  @Input() userProfile: UserProfileResponse | undefined;
  @Input() isCurrentUser: boolean | undefined;

  public currentPosition: UserProfileItemResponse | undefined;
  public currentEducation: UserProfileItemResponse | undefined;

  constructor(
    private readonly dialogService: CommonDialogService,
    private readonly localizationService: LocalizationService,
    private readonly store: Store,
    private readonly graphQlAuthService: GraphQlAuthService,
    private readonly dictionaryService: DictionaryService,
    private readonly snackBar: MatSnackBar
  ) {
    super();
  }

  override ngOnInit() {
    if (this.userProfile?.items) {
      const items = [...this.userProfile.items];

      this.currentPosition = items
        .filter(item => item.profileItemType === UserProfileItemEnum.Experience)
        .sort((a, b) => {
          const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
          const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
          return dateB - dateA;
        })[0];

      this.currentEducation = items
        .filter(item => item.profileItemType === UserProfileItemEnum.Education)
        .sort((a, b) => {
          const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
          const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
          return dateB - dateA;
        })[0];
    }

    super.ngOnInit();
  }

  public getCountry(id: number | undefined): string | undefined {
    return this.dictionaryService.countryData?.find(item => item.id === id)?.title;
  }

  public getJobType(id: number | undefined): string | undefined {
    return this.dictionaryService.jobTypeData?.find(item => item.id === id)?.title;
  }

  public getWorkArrangement(id: number | undefined): string | undefined {
    return this.dictionaryService.workArrangementData?.find(item => item.id === id)?.title;
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
    if (!this.isCurrentUser) {
      return;
    }

    const executableAction = () => {
      this.graphQlAuthService.currentUser()
        .pipe(
          takeUntil(this.ngUnsubscribe),
          tap((result: ApolloQueryResult<{ auth_gateway_current_user: UserResponse | undefined; }> | undefined ) => {
            const user = result?.data?.auth_gateway_current_user as UserResponse;
            if (!!user) {
              this.store.dispatch(auth_setUser({ user }));
              this.localizationService.userLocaleChanged(user);
            }
          }),
          catchError((error: any) => {
            this.localizationService.handleApiError(error);
            return throwError(() => error);
          })
        ).subscribe();
    };

    this.dialogService.showDialog<UserPreferencesDialogComponent, any>(
      UserPreferencesDialogComponent,
      {
        data: {
          user: this.currentUser,
        },
        width: '800px',
        maxWidth: '90vw',
      },
      executableAction
    );
  }

  protected readonly LOCALIZATION_KEYS = LOCALIZATION_KEYS;
}
