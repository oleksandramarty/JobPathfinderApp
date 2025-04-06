import { Injectable } from '@angular/core';
import { CacheVersionResponse, SiteSettingsResponse } from '@amarty/models';
import { getLocalStorageItem, setLocalStorageItem } from '@amarty/utils';

@Injectable({
  providedIn: 'root'
})
export class SiteSettingsService {
  private _siteSettings: SiteSettingsResponse | undefined;

  get siteSettings(): SiteSettingsResponse | undefined {
    if (!this._siteSettings) {
      this._siteSettings = getLocalStorageItem<SiteSettingsResponse>('settings');
    }
    return this._siteSettings;
  }

  get version(): CacheVersionResponse | undefined {
    return this.siteSettings?.version;
  }

  set siteSettings(value: SiteSettingsResponse | undefined) {
    this._siteSettings = value;
    setLocalStorageItem('settings', this._siteSettings);
  }

  constructor() {}
}
