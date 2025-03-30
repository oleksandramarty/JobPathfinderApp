import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, takeUntil, tap } from 'rxjs';
import {
  UserResponse,
  MenuItem } from '@amarty/models';
import {
  localization_en,
  localization_es,
  localization_fr,
  localization_ua,
  localization_ru,
  localization_it,
  localization_de
} from '@amarty/localizations';
import {getLocalStorageItem, setLocalStorageItem} from '@amarty/utils';

@Injectable({
    providedIn: 'root'
})
export class LocalizationService {
  private _fallbackLocale: string = 'en';
  private _currentLocale: string | undefined;

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

    get currentLocale(): string {
      if (!this._currentLocale) {
        const temp = getLocalStorageItem<string>('locale');
        if (!!temp) {
          this._currentLocale = temp;
        } else {
          this._currentLocale = this._fallbackLocale;
          setLocalStorageItem('locale', this._currentLocale);
        }
      }
      return this._currentLocale!;
    }

    updateLocalizations() {
      this._shortMonths = [
        'DATES.JANUARY_SHORT',
        'DATES.FEBRUARY_SHORT',
        'DATES.MARCH_SHORT',
        'DATES.APRIL_SHORT',
        'DATES.MAY_SHORT',
        'DATES.JUNE_SHORT',
        'DATES.JULY_SHORT',
        'DATES.AUGUST_SHORT',
        'DATES.SEPTEMBER_SHORT',
        'DATES.OCTOBER_SHORT',
        'DATES.NOVEMBER_SHORT',
        'DATES.DECEMBER_SHORT'
      ].map(item => this._currentLocalization?.get(item) ?? '').filter(x => !!x);
      this._shortDays = [
        'DATES.MONDAY_SHORT',
        'DATES.TUESDAY_SHORT',
        'DATES.WEDNESDAY_SHORT',
        'DATES.THURSDAY_SHORT',
        'DATES.FRIDAY_SHORT',
        'DATES.SATURDAY_SHORT',
        'DATES.SUNDAY_SHORT'
      ].map(item => this._currentLocalization?.get(item) ?? '').filter(x => !!x);
    }

    constructor() {}

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
      this._currentLocale = code;
      setLocalStorageItem('locale', code ?? this._fallbackLocale);
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
              })
            }
          })
        )
        .subscribe();
    }
}
