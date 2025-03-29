import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { Observable, of } from 'rxjs';
import { BaseUnsubscribeComponent } from '@amarty/shared/components'
import {generateRandomId} from '@amarty/utils'
import { LocalizationService } from '@amarty/services';
import { LocaleResponse, LocaleData } from '@amarty/api';
import { MenuItem } from '@amarty//models';
import { AuthService } from '../../../utils/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  host: { 'data-id': generateRandomId(12) }
})
export class HeaderComponent extends BaseUnsubscribeComponent {
  public langFlags: Map<string, string> = new Map([
    ['en', 'gb'], ['fr', 'fr'], ['de', 'de'],
    ['ua', 'ua'], ['ru', 'ru'], ['es', 'es'],
    ['it', 'it'],
  ]);

  public menuItems: MenuItem[] = [
    { key: 'MENU.HOME', url: '/home' },
    { key: 'MENU.JOBS', url: '/jobs' },
    { key: 'MENU.COMPANIES', url: '/companies' },
    { key: 'MENU.KARMA', url: '/karma' }
  ]

  public locales: LocaleResponse[] = LocaleData;

  public userAvatar = 'assets/images/avatar.png';

  constructor(
    private readonly snackBar: MatSnackBar,
    private readonly authService: AuthService,
    private readonly localizationService: LocalizationService,
    private readonly router: Router
  ) {
    super();
  }

  get isAuthorized$(): Observable<boolean> {
    return this.authService.isAuthorized$ ?? of(false);
  }

  override ngOnInit() {
    // this.localizationService.localeChangedSub
    //   .pipe(
    //     takeUntil(this.ngUnsubscribe),
    //     tap((state) => {
    //       if (!!state && this.currentLocale) {
    //         this.menuItems.forEach((item) => {
    //           item.title = this.localizationService.getTranslation(item.key);
    //         })
    //       }
    //     })
    //   )
    //   .subscribe();

    if (this.currentLocale) {
      this.localizationService.handleLocalizationMenuItems(this.menuItems, this.ngUnsubscribe);
    }

    super.ngOnInit();
  }

  get currentLocale(): string {
    return this.localizationService.currentLocale;
  }

  public goto(url: string | undefined): void {
    this.router.navigate([`/${url ?? ''}`]);
  }

  public logout() {
    console.log('logout');
  }

  public localeChanged(code: string | undefined): void {
    this.localizationService.localeChanged(code);
  }
}
