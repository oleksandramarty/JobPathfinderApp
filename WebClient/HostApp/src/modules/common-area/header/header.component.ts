import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { Observable, of } from 'rxjs';
import { BaseUnsubscribeComponent } from '@amarty/common';
import { generateRandomId } from '@amarty/utils';
import { DictionaryService, LocalizationService } from '@amarty/services';
import { LocaleResponse, MenuItem } from '@amarty/models';
import { AuthService } from '../../../utils/services/auth.service';
import { TranslationPipe } from '@amarty/pipes';
import { LOCALIZATION_KEYS } from '@amarty/localizations';

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
    MatMenuModule,
    TranslationPipe
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
    { key: LOCALIZATION_KEYS.MENU.HOME, url: '/home' },
    { key: LOCALIZATION_KEYS.MENU.JOBS, url: '/jobs' },
    { key: LOCALIZATION_KEYS.MENU.COMPANIES, url: '/companies' },
    { key: LOCALIZATION_KEYS.MENU.KARMA, url: '/karma' }
  ];

  public locales: LocaleResponse[] | undefined;

  public userAvatar = 'assets/images/avatar.png';

  constructor(
    private readonly authService: AuthService,
    private readonly localizationService: LocalizationService,
    private readonly dictionaryService: DictionaryService
  ) {
    super();
  }

  get isAuthorized$(): Observable<boolean> {
    return this.authService.isAuthorized$ ?? of(false);
  }

  override ngOnInit() {
    this.locales = this.dictionaryService.localeData;

    if (this.currentLocale) {
      this.localizationService.handleLocalizationMenuItems(this.menuItems, this.ngUnsubscribe);
    }

    super.ngOnInit();
  }

  get currentLocale(): string {
    return this.localizationService.currentLocale;
  }

  public logout() {
    this.authService.logout();
  }

  public localeChanged(code: string | undefined): void {
    this.localizationService.localeChanged(code);
  }

  protected readonly LOCALIZATION_KEYS = LOCALIZATION_KEYS;
}
