import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, takeUntil, tap } from 'rxjs';
import {
  LocalizationItemResponse,
  LocalizationResponse,
  LocalizationsResponse,
  UserResponse,
  DataItem,
  MenuItem } from '@amarty/models';
import { LocalizationsData } from '@amarty/localizations';
import {getLocalStorageItem, setLocalStorageItem} from '@amarty/utils';

@Injectable({
    providedIn: 'root'
})
export class LocalizationService {
    private _staticLocalizations: LocalizationsResponse | undefined;

    private _fallbackLocale: string = 'en';
    private _currentLocale: string | undefined;

    public localeChangedSub: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    get shortMonths(): string[] {
      return this._staticLocalizations?.data?.find(l => l.locale === this.currentLocale)?.shortMonths ?? [];
    }
    get shortDays(): string[] {
      return this._staticLocalizations?.data?.find(l => l.locale === this.currentLocale)?.shortDays ?? [];
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

    get staticLocalizations(): LocalizationsResponse | undefined {
        if (!this._staticLocalizations) {
          this._staticLocalizations = getLocalStorageItem<LocalizationsResponse>('localization_static');;
        }
        return this._staticLocalizations;
    }

    set staticLocalizations(value: LocalizationsResponse | undefined) {
      value?.data?.forEach(item => {
        item.shortDays = [
            'DATES.MONDAY_SHORT',
            'DATES.TUESDAY_SHORT',
            'DATES.WEDNESDAY_SHORT',
            'DATES.THURSDAY_SHORT',
            'DATES.FRIDAY_SHORT',
            'DATES.SATURDAY_SHORT',
            'DATES.SUNDAY_SHORT'
        ].map(day => {
          return this._getTranslationByLocale(item.locale, day, value) ?? '';
        }).filter(e => !!e);

        item.shortMonths = [
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
        ].map(month => {
          return this._getTranslationByLocale(item.locale, month, value) ?? '';
        }).filter(e => !!e)
      });

      this._staticLocalizations = value;
      setLocalStorageItem('localization_static', value);
    }

    get getAllLocalizationsDataItems(): DataItem[] {
        const dataItems: DataItem[] = [];
        this.getAllLocalizations?.data?.forEach(locale => {
            locale.items?.forEach(localeItem => {
              dataItems.push(new DataItem({
                id: localeItem.key,
                name: localeItem.value
              }));
            });
        });
        return dataItems;
    }

    get getAllLocalizations(): LocalizationsResponse | undefined {
        if (!this._staticLocalizations) {
            return undefined;
        }

        const mergedData: { [key: string]: LocalizationItemResponse[] | undefined } = {};

        if (this._staticLocalizations?.data) {
            this._staticLocalizations.data.forEach(locale => {
                if (!mergedData[locale.locale ?? this._fallbackLocale]) {
                    mergedData[locale.locale ?? this._fallbackLocale] = [];
                }
                locale.items?.forEach(item => {
                    const existingItem = mergedData[locale.locale ?? this._fallbackLocale]?.find(i => i.key === item.key);
                    if (existingItem) {
                        existingItem.value = item.value;
                    } else {
                        mergedData[locale.locale ?? this._fallbackLocale]?.push(item);
                    }
                });
            });
        }

        const mergedLocalizations = Object.keys(mergedData).map(locale => new LocalizationResponse({
            locale,
            items: mergedData[locale]
        }));

        return new LocalizationsResponse({
            version: '',
            data: mergedLocalizations
        });
    }

    constructor() {}

    public initialize(): void {
      this.staticLocalizations = LocalizationsData;

      this.localeChangedSub.next(true);
    }

    public getTranslation(key: string | undefined): string | undefined {
        return this.getTranslationByLocale(this._currentLocale, key);
    }

    public getTranslationByLocale(locale: string | undefined, key: string | undefined): string | undefined {
        if (!key) {
            return undefined;
        }

        return this._getTranslationByLocale(locale, key, this._staticLocalizations);
    }

  private _getTranslationByLocale(
    locale: string | undefined,
    key: string | undefined,
    data: LocalizationsResponse | undefined): string | undefined {
    if (!key) {
      return undefined;
    }

    const staticTranslation = data?.data?.find(l => l.locale === locale)?.items?.find(i => i.key === key)?.value;

    return staticTranslation ?? key;
  }

    public getAllTranslations(locale: string): { [key: string]: string | undefined } | undefined {
        const translations: { [key: string]: string | undefined } = {};

        this._staticLocalizations?.data?.find(l => l.locale === locale)?.items?.forEach(item => {
            translations[item.key ?? this._fallbackLocale] = item.value;
        });

        return translations;
    }

    public getAllTranslationsByKey(key: string | undefined): string[] | undefined {
        const translations: Set<string> = new Set();

        this._staticLocalizations?.data?.forEach(locale => {
            const translation = locale.items?.find(i => i.key === key)?.value;
            if (translation) {
                translations.add(translation);
            }
        });

        return Array.from(translations);
    }

    public localeChanged(code: string | undefined): void {
      this._currentLocale = code;
      setLocalStorageItem('locale', code ?? this._fallbackLocale);
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
