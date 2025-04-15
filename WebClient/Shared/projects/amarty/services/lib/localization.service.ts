import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, takeUntil, tap } from 'rxjs';
import {
  UserResponse,
  MenuItem
} from '@amarty/models';
import {
  localization_en,
  localization_es,
  localization_fr,
  localization_ua,
  localization_ru,
  localization_it,
  localization_de,
  LOCALIZATION_KEYS
} from '@amarty/localizations';
import {getLocalStorageItem, handleGraphQlError, setLocalStorageItem} from '@amarty/utils';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { LocaleData } from '@amarty/dictionaries';

@Injectable({
  providedIn: 'root'
})
export class LocalizationService {
  private _fallbackLocale: string = 'en';
  private _currentLocale: string | undefined;
  private _fallbackCulture: string = 'en-US';
  private _currentCulture: string | undefined;

  private _shortMonths: string[] | undefined;
  private _shortDays: string[] | undefined;

  public _localizationMap: Map<string, Map<string, string>> = new Map([
    ['en', localization_en],
    ['fr', localization_fr],
    ['de', localization_de],
    ['ua', localization_ua],
    ['ru', localization_ru],
    ['es', localization_es],
    ['it', localization_it],
  ]);

  get _currentLocalization(): Map<string, string> | undefined {
    return this._localizationMap.get(this.currentLocale);
  }

  public localeChangedSub: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  get shortMonths(): string[] {
    return this._shortMonths ?? [];
  }

  get shortDays(): string[] {
    return this._shortDays ?? [];
  }

  get currentCulture(): string {
    if (!this._currentCulture) {
      this._currentCulture = LocaleData.find(item => item.isoCode == this.currentLocale)?.culture ?? this._fallbackCulture;
    }
    return this._currentCulture!;
  }

  get currentLocale(): string {
    if (!this._currentLocale) {
      const temp = getLocalStorageItem<string>('locale');
      if (!!temp) {
        this._currentLocale = temp;
      } else {
        this._currentLocale = this._fallbackLocale;
        setLocalStorageItem('locale', this._currentLocale);
      }
      this._currentCulture = LocaleData.find(item => item.isoCode == this._currentLocale)?.culture ?? this._fallbackCulture;
    }
    return this._currentLocale!;
  }

  set currentLocale(value: string | undefined) {
    this._currentLocale = value ?? this._fallbackLocale;
    setLocalStorageItem('locale', value ?? this._fallbackLocale);
    this._currentCulture = LocaleData.find(item => item.isoCode == this._currentLocale)?.culture ?? this._fallbackCulture;
  }

  public initialize(): void {
    this.localeChangedSub.next(true);
    this.updateLocalizations();

  }

  public updateLocalizations() {
    this._shortMonths = [
      LOCALIZATION_KEYS.DATES.JANUARY_SHORT,
      LOCALIZATION_KEYS.DATES.FEBRUARY_SHORT,
      LOCALIZATION_KEYS.DATES.MARCH_SHORT,
      LOCALIZATION_KEYS.DATES.APRIL_SHORT,
      LOCALIZATION_KEYS.DATES.MAY_SHORT,
      LOCALIZATION_KEYS.DATES.JUNE_SHORT,
      LOCALIZATION_KEYS.DATES.JULY_SHORT,
      LOCALIZATION_KEYS.DATES.AUGUST_SHORT,
      LOCALIZATION_KEYS.DATES.SEPTEMBER_SHORT,
      LOCALIZATION_KEYS.DATES.OCTOBER_SHORT,
      LOCALIZATION_KEYS.DATES.NOVEMBER_SHORT,
      LOCALIZATION_KEYS.DATES.DECEMBER_SHORT
    ].map(item => this._currentLocalization?.get(item) ?? '').filter(x => !!x);
    this._shortDays = [
      LOCALIZATION_KEYS.DATES.MONDAY_SHORT,
      LOCALIZATION_KEYS.DATES.TUESDAY_SHORT,
      LOCALIZATION_KEYS.DATES.WEDNESDAY_SHORT,
      LOCALIZATION_KEYS.DATES.THURSDAY_SHORT,
      LOCALIZATION_KEYS.DATES.FRIDAY_SHORT,
      LOCALIZATION_KEYS.DATES.SATURDAY_SHORT,
      LOCALIZATION_KEYS.DATES.SUNDAY_SHORT
    ].map(item => this._currentLocalization?.get(item) ?? '').filter(x => !!x);
  }

  constructor(
      private readonly snackBar: MatSnackBar
  ) {}

  public getTranslation(key: string | undefined): string | undefined {
    return this.getTranslationByLocale(this._currentLocale, key);
  }

  public getTranslationByLocale(locale: string | undefined, key: string | undefined): string | undefined {
    if (!locale || !key) {
      return undefined;
    }

    const staticTranslation = this._localizationMap.get(locale)?.get(key);

    return staticTranslation ?? key;
  }

  public localeChanged(code: string | undefined): void {
    this.currentLocale = code;
    this.updateLocalizations();
    this.localeChangedSub.next(true);
  }

  public userLocaleChanged(user: UserResponse | undefined): void {
    if (user?.userSetting?.defaultLocale) {
      this.localeChanged(user.userSetting.defaultLocale);
    }
  }

  public handleLocalizationMenuItems(
    menuItems: MenuItem[],
    ngUnsubscribe: Subject<void>
  ): void {
    this.localeChangedSub
      .pipe(
        takeUntil(ngUnsubscribe),
        tap((state) => {
          if (!!state) {
            menuItems.forEach((item) => {
              item.title = this.getTranslation(item.key);
            });
          }
        })
      )
      .subscribe();
  }

  public handleApiError(error: any): void {
    this.showError(handleGraphQlError(error, LOCALIZATION_KEYS.ERROR.INTERNAL_SERVER_ERROR));
  }

  public showInfo(translationKey: string, action: string = 'Close'): void {
    this._showMessage(translationKey, { duration: 5000, panelClass: 'info' }, action);
  }
  public showSuccess(translationKey: string, action?: string): void {
    this._showMessage(translationKey, { duration: 5000, panelClass: 'success' }, action);
  }
  public showWarning(translationKey: string, action?: string): void {
    this._showMessage(translationKey, { duration: 5000, panelClass: 'warning' }, action);
  }
  public showError(translationKey: string, action?: string): void {
    this._showMessage(translationKey, { duration: 5000, panelClass: 'error' }, action);
  }

  private _showMessage(translationKey: string, config?: MatSnackBarConfig, action?: string): void {
    const translatedMessage = this.getTranslation(translationKey);

    if (!translatedMessage) {
      return;
    }

    this.snackBar.open(translatedMessage, action ?? 'OK', config ?? { duration: 5000 });
  }
}
