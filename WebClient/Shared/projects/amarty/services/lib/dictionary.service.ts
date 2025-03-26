import { Injectable } from '@angular/core';
import {
  CountryData,
  CurrencyData,
  ExperienceLevelData,
  JobSourceData,
  JobTypeData,
  LanguageLevelData,
  LanguageData,
  LocaleData,
  RoleData,
  SkillLevelData,
  SkillData,
  WorkArrangementData,
  CountryResponse,
  CurrencyResponse,
  ExperienceLevelResponse,
  JobSourceResponse,
  JobTypeResponse,
  LanguageLevelResponse,
  LanguageResponse,
  LocaleResponse,
  RoleResponse,
  SkillLevelResponse,
  SkillResponse,
  WorkArrangementResponse,
  UserSkillResponse,
  UserLanguageResponse
 } from '@amarty/api';
import { DataItem } from '@amarty/models';
import { LocalizationService } from './localization.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {traceCreation} from '@amarty/utils';

@Injectable({
  providedIn: 'root'
})
export class DictionaryService {
  private _countryData: CountryResponse[] | undefined;
  private _countryDataItems: DataItem[] | undefined;
  public get countryData(): CountryResponse[] | undefined {
    return this._countryData;
  }
  public get countryDataItems(): DataItem[] | undefined {
    return this._countryDataItems;
  }

  private _currencyData: CurrencyResponse[] | undefined;
  private _currencyDataItems: DataItem[] | undefined;
  public get currencyData(): CurrencyResponse[] | undefined {
    return this._currencyData;
  }
  public get currencyDataItems(): DataItem[] | undefined {
    return this._currencyDataItems;
  }

  private _experienceLevelData: ExperienceLevelResponse[] | undefined;
  private _experienceLevelDataItems: DataItem[] | undefined;
  public get experienceLevelData(): ExperienceLevelResponse[] | undefined {
    return this._experienceLevelData;
  }
  public get experienceLevelDataItems(): DataItem[] | undefined {
    return this._experienceLevelDataItems;
  }

  private _jobSourceData: JobSourceResponse[] | undefined;
  private _jobSourceDataItems: DataItem[] | undefined;
  public get jobSourceData(): JobSourceResponse[] | undefined {
    return this._jobSourceData;
  }
  public get jobSourceDataItems(): DataItem[] | undefined {
    return this._jobSourceDataItems;
  }

  private _jobTypeData: JobTypeResponse[] | undefined;
  private _jobTypeDataItems: DataItem[] | undefined;
  public get jobTypeData(): JobTypeResponse[] | undefined {
    return this._jobTypeData;
  }
  public get jobTypeDataItems(): DataItem[] | undefined {
    return this._jobTypeDataItems;
  }

  private _languageLevelData: LanguageLevelResponse[] | undefined;
  private _languageLevelDataItems: DataItem[] | undefined;
  public get languageLevelData(): LanguageLevelResponse[] | undefined {
    return this._languageLevelData;
  }
  public get languageLevelDataItems(): DataItem[] | undefined {
    return this._languageLevelDataItems;
  }

  private _languageData: LanguageResponse[] | undefined;
  private _languageDataItems: DataItem[] | undefined;
  public get languageData(): LanguageResponse[] | undefined {
    return this._languageData;
  }
  public get languageDataItems(): DataItem[] | undefined {
    return this._languageDataItems;
  }

  private _localeData: LocaleResponse[] | undefined;
  private _localeDataItems: DataItem[] | undefined;
  public get localeData(): LocaleResponse[] | undefined {
    return this._localeData;
  }
  public get localeDataItems(): DataItem[] | undefined {
    return this._localeDataItems;
  }

  private _roleData: RoleResponse[] | undefined;
  private _roleDataItems: DataItem[] | undefined;
  public get roleData(): RoleResponse[] | undefined {
    return this._roleData;
  }
  public get roleDataItems(): DataItem[] | undefined {
    return this._roleDataItems;
  }

  private _skillLevelData: SkillLevelResponse[] | undefined;
  private _skillLevelDataItems: DataItem[] | undefined;
  public get skillLevelData(): SkillLevelResponse[] | undefined {
    return this._skillLevelData;
  }
  public get skillLevelDataItems(): DataItem[] | undefined {
    return this._skillLevelDataItems;
  }

  private _skillData: SkillResponse[] | undefined;
  private _skillDataItems: DataItem[] | undefined;
  public get skillData(): SkillResponse[] | undefined {
    return this._skillData;
  }
  public get skillDataItems(): DataItem[] | undefined {
    return this._skillDataItems;
  }

  private _workArrangementData: WorkArrangementResponse[] | undefined;
  private _workArrangementDataItems: DataItem[] | undefined;
  public get workArrangementData(): WorkArrangementResponse[] | undefined {
    return this._workArrangementData;
  }
  public get workArrangementDataItems(): DataItem[] | undefined {
    return this._workArrangementDataItems;
  }

  constructor(
    private readonly localizationService: LocalizationService,
    private readonly sanitizer: DomSanitizer
  ) {
    traceCreation(this);
  }

  public initialize(): void {
    this._countryData = CountryData;
    if (this._countryData && !this._countryDataItems) {
      this._countryDataItems = this._countryData.map(item =>
        new DataItem({
          id: String(item.id),
          name: item.titleEn,
          description: item.title,
          flagIcon: item.code
        }));
    }

    this._currencyData = CurrencyData;
    if (this._currencyData && !this._currencyDataItems) {
      this._currencyDataItems = this._currencyData.map(item =>
        new DataItem({
          id: String(item.id),
          name: item.title,
          description: `${item.code} - ${item.titleEn}`,
          filteredFields: [String(item.id), item.code, item.titleEn, item.title]
            .filter(value => value !== undefined)
        }));
    }

    this._experienceLevelData = ExperienceLevelData;
    if (this._experienceLevelData && !this._experienceLevelDataItems) {
      this._experienceLevelDataItems = this._experienceLevelData.map(item =>
        new DataItem({
          id: String(item.id),
          name: item.title,
          description: item.titleEn
        }));
    }

    this._jobSourceData = JobSourceData;
    if (this._jobSourceData && !this._jobSourceDataItems) {
      this._jobSourceDataItems = this._jobSourceData.map(item =>
        new DataItem({
          id: String(item.id),
          name: item.title,
          description: item.titleEn
        }));
    }

    this._jobTypeData = JobTypeData;
    if (this._jobTypeData && !this._jobTypeDataItems) {
      this._jobTypeDataItems = this._jobTypeData.map(item =>
        new DataItem({
          id: String(item.id),
          name: item.title,
          description: item.titleEn
        }));
    }

    this._languageLevelData = LanguageLevelData;
    if (this._languageLevelData && !this._languageLevelDataItems) {
      this._languageLevelDataItems = this._languageLevelData.map(item =>
        new DataItem({
          id: String(item.id),
          name: item.title,
          description: item.titleEn
        }));
    }

    this._languageData = LanguageData;
    if (this._languageData && !this._languageDataItems) {
      this._languageDataItems = this._languageData.map(item =>
        new DataItem({
          id: String(item.id),
          name: item.titleEn,
          description: item.title,
          filteredFields: [item.titleEn ?? '', item.title ?? '']
        }));
    }

    this._localeData = LocaleData;
    if (this._localeData && !this._localeDataItems) {
      this._localeDataItems = this._localeData.map(item =>
        new DataItem({
          id: String(item.id),
          name: item.titleEn,
          description: `${item.isoCode} - ${item.title}`,
          filteredFields: [String(item.id), item.isoCode, item.titleEn, item.title]
            .filter(value => value !== undefined)
        }));
    }

    this._roleData = RoleData;
    if (this._roleData && !this._roleDataItems) {
      this._roleDataItems = this._roleData.map(item =>
        new DataItem({
          id: String(item.id),
          name: item.title
        }));
    }

    this._skillLevelData = SkillLevelData;
    if (this._skillLevelData && !this._skillLevelDataItems) {
      this._skillLevelDataItems = this._skillLevelData.map(item =>
        new DataItem({
          id: String(item.id),
          name: item.title,
          description: item.titleEn
        }));
    }

    this._skillData = SkillData;
    if (this._skillData && !this._skillDataItems) {
      this._skillDataItems = this._skillData.map(item =>
        new DataItem({
          id: String(item.id),
          name: item.title
        }));
    }

    this._workArrangementData = WorkArrangementData;
    if (this._workArrangementData && !this._workArrangementDataItems) {
      this._workArrangementDataItems = this._workArrangementData.map(item =>
        new DataItem({
          id: String(item.id),
          name: item.title,
          description: item.titleEn
        }));
    }
  }

  public getSkillTitle(skill: UserSkillResponse | undefined): string {
    if (!skill) {
      return '';
    }

    return `${this._getDateItem(skill.skillId, this._skillDataItems)?.name ?? ''} | ${this.localizationService.getTranslation(this._getDateItem(skill.skillLevelId, this._skillLevelDataItems)?.name ?? '')}`;
  }

  public getLanguageTitle(language: UserLanguageResponse | undefined): SafeHtml | undefined {
    if (!language) {
      return undefined;
    }

    return this.sanitizer
      .bypassSecurityTrustHtml(`
        <div class="language__container">
          <div class="language__title">${this._getDateItem(language.languageId, this._languageDataItems)?.name ?? ''}</div>
          <div class="language__native">${this._getDateItem(language.languageId, this._languageDataItems)?.description ?? ''}</div>
        </div>
        <div>|</div>
        <div>${this.localizationService.getTranslation(this._getDateItem(language.languageLevelId, this._languageLevelDataItems)?.name ?? '')}</div>
    `);
  }

  private _getDateItem(id: string | number | undefined, dataItems: DataItem[] | undefined): DataItem | undefined {
    const index = this._skillDataItems?.findIndex(item => item.id === String(id)) ?? -1;

    return !!dataItems && dataItems[index] ? dataItems[index] : undefined;
  }
}
