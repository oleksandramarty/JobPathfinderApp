import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { MatSnackBar } from '@angular/material/snack-bar';
import { takeUntil, tap } from 'rxjs';
import { BaseUnsubscribeComponent } from '@amarty/shared/components';
import { UserResponse } from '@amarty/api';
import { CommonDialogService, DictionaryService } from '@amarty/services';
import { selectUser } from '@amarty/store';
import { ProfileInfoComponent } from './profile-info/profile-info.component';
import { ProfileSkillsComponent } from './profile-skills/profile-skills.component';
import { ProfileLanguagesComponent } from './profile-languages/profile-languages.component';
import { ProfileItemComponent } from './profile-item/profile-item.component';

@Component({
  selector: 'app-profile-area',
  imports: [
    CommonModule,

    ProfileInfoComponent,
    ProfileSkillsComponent,
    ProfileLanguagesComponent,
    ProfileItemComponent
  ],
  standalone: true,
  templateUrl: './profile-area.component.html',
  styleUrl: './profile-area.component.scss'
})
export class ProfileAreaComponent extends BaseUnsubscribeComponent {
  public currentUser: UserResponse | undefined;
  public countryCode: string | undefined;

  constructor(
    private readonly dialogService: CommonDialogService,
    private readonly dictionaryService: DictionaryService,
    private readonly store: Store,
    private readonly snackBar: MatSnackBar
  ) {
    super();

    this.countryCode = this.dictionaryService.countryData?.find(item => item.id === this.currentUser?.userSetting?.countryId)?.code?.toLowerCase();
  }

  override ngOnInit(): void {
    this.store.select(selectUser)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        tap((user) => {
          this.currentUser = user;
          this.countryCode = this.dictionaryService.countryData?.find(item => item.id === this.currentUser?.userSetting?.countryId)?.code?.toLowerCase();
        })
      ).subscribe();
    super.ngOnInit();
  }
}
