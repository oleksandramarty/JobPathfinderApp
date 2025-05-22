import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonDialogService, LocalizationService, DictionaryService } from '@amarty/services';
import { of, Subject } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { LandingComponent } from './landing.component';
import { selectUser } from '@amarty/store';
import { UserResponse, MenuItem, SiteSettingsResponse, DataItem } from '@amarty/models';
import { mockUserResponse } from '../../test/mock/user.mock'; 
import { ApplicationDialogComponent } from '../dialogs/application-dialog/application-dialog.component';
import { LOCALIZATION_KEYS } from '@amarty/localizations';
import { Store } from '@ngrx/store';


// Mock NgxEchartsModule to prevent actual chart rendering
import { NgxEchartsModule } from 'ngx-echarts';
jest.mock('ngx-echarts', () => ({
  NgxEchartsModule: {} 
}));


describe('LandingComponent', () => {
  let component: LandingComponent;
  let fixture: ComponentFixture<LandingComponent>;
  let store: MockStore;
  let mockLocalizationService: Partial<LocalizationService>;
  let mockDialogService: Partial<CommonDialogService>;
  let mockSnackBar: Partial<MatSnackBar>;
  let mockDictionaryService: Partial<DictionaryService>;
  let localeChangedSubject: Subject<void>;
  let mockBodyObserver: { observe: jest.Mock, disconnect: jest.Mock, takeRecords: jest.Mock };


  const mockUser: UserResponse = { ...mockUserResponse, userSetting: { countryId: 1, ...mockUserResponse?.userSetting } };
  const mockCountryData: DataItem[] = [{ id: '1', name: 'Testland', code: 'TL' }];


  beforeEach(async () => {
    localeChangedSubject = new Subject<void>();
    mockLocalizationService = {
      localeChangedSub: localeChangedSubject.asObservable(),
      getTranslation: jest.fn(key => key), 
      shortDays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'], 
      shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], 
    };

    mockDialogService = {
      showDialog: jest.fn(),
    };

    mockSnackBar = {
      open: jest.fn(),
    };
    
    mockDictionaryService = {
        countryData: mockCountryData
    };

    // Mock MutationObserver
    mockBodyObserver = {
        observe: jest.fn(),
        disconnect: jest.fn(),
        takeRecords: jest.fn()
    };
    (global as any).MutationObserver = jest.fn(() => mockBodyObserver);


    await TestBed.configureTestingModule({
      imports: [
        LandingComponent, 
        NoopAnimationsModule,
      ],
      providers: [
        provideMockStore({
          initialState: { user: mockUser }, // Ensure user state is part of initial for selectors
          selectors: [{ selector: selectUser, value: mockUser }],
        }),
        { provide: LocalizationService, useValue: mockLocalizationService },
        { provide: CommonDialogService, useValue: mockDialogService },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: DictionaryService, useValue: mockDictionaryService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA], 
    }).compileComponents();

    fixture = TestBed.createComponent(LandingComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store) as MockStore;

    jest.spyOn(document.body.classList, 'contains').mockImplementation(() => false); // Default mock

    fixture.detectChanges(); 
  });
  
  afterEach(() => {
    jest.clearAllMocks();
    // Restore original MutationObserver if it was globally mocked, or clear spies.
    // For this setup, clearing jest.fn() mocks is usually enough.
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call _onBodyClassChanged', () => {
      const spy = jest.spyOn(component as any, '_onBodyClassChanged');
      component.ngOnInit(); 
      expect(spy).toHaveBeenCalled();
    });

    it('should subscribe to selectUser and set currentUser and countryCode', () => {
      // selectUser is configured in provideMockStore to return mockUser
      expect(component.currentUser).toEqual(mockUser);
      // Ensure userSetting and countryId are on mockUser for this to pass
      expect(component.countryCode).toBe(mockCountryData.find(c => c.id === String(mockUser.userSetting?.countryId))?.code?.toLowerCase());
    });

    it('should subscribe to localeChangedSub and call updateCharts', () => {
      const updateChartsSpy = jest.spyOn(component as any, 'updateCharts');
      localeChangedSubject.next();
      expect(updateChartsSpy).toHaveBeenCalled();
    });

    it('should call updateCharts initially (called by _onBodyClassChanged in ngOnInit)', () => {
      const updateChartsSpy = jest.spyOn(component as any, 'updateCharts');
      (component as any)._onBodyClassChanged(); // Manually trigger to check updateCharts call
      expect(updateChartsSpy).toHaveBeenCalled();
    });
  });
  
  describe('_onBodyClassChanged', () => {
    it('should set theme to colorsDark if body has "dark-theme" class and update charts', () => {
      (document.body.classList.contains as jest.Mock).mockImplementation(cls => cls === 'dark-theme');
      const updateChartsSpy = jest.spyOn(component as any, 'updateCharts');
      (component as any)._onBodyClassChanged();
      // Accessing private theme for test. Better to test behavior influenced by theme.
      expect((component as any).theme.background).toEqual('#1e1e2f'); 
      expect(updateChartsSpy).toHaveBeenCalled();
    });

    it('should set theme to colorsLight if body has "light-theme" class and update charts', () => {
      (document.body.classList.contains as jest.Mock).mockImplementation(cls => cls === 'light-theme');
      const updateChartsSpy = jest.spyOn(component as any, 'updateCharts');
      (component as any)._onBodyClassChanged();
      expect((component as any).theme.background).toEqual('#ffffff');
      expect(updateChartsSpy).toHaveBeenCalled();
    });
  });

  describe('updateCharts', () => {
    beforeEach(() => {
        (document.body.classList.contains as jest.Mock).mockImplementation(cls => cls === 'dark-theme');
        (component as any)._onBodyClassChanged(); 
        (mockLocalizationService.getTranslation as jest.Mock).mockClear(); 
    });

    it('should update titles of menuItems using localizationService', () => {
      component['updateCharts'](); 
      component.menuItems.forEach(item => {
        expect(mockLocalizationService.getTranslation).toHaveBeenCalledWith(item.key);
        expect(item.title).toEqual(item.key); 
      });
    });

    it('should generate heatmapOptions with correct theme and localization', () => {
      component['updateCharts']();
      expect(component.heatmapOptions.backgroundColor).toEqual((component as any).theme.background);
      expect(component.heatmapOptions.title.text).toEqual(LOCALIZATION_KEYS.STATS.NEW_JOB_LISTINGS_PER_DAY);
      expect(component.heatmapOptions.calendar.monthLabel.nameMap).toEqual(mockLocalizationService.shortMonths);
    });
    // Add similar tests for lineChartOptions, barChartOptions, pieChartOptions if more detail is needed
  });
  
  it('getJobDataForChart should transform jobData correctly', () => {
    const chartData = component.getJobDataForChart();
    expect(chartData.length).toBe(component.jobData.length);
    expect(chartData[0]).toEqual([component.jobData[0].date, component.jobData[0].count]);
  });

  it('should call dialogService.showDialog when openApplicationDialog is called', () => {
    component.openApplicationDialog();
    expect(mockDialogService.showDialog).toHaveBeenCalledWith(
      ApplicationDialogComponent,
      { width: '1200px', maxWidth: '90vw' }
    );
  });
  
  it('ngOnDestroy should disconnect bodyObserver and call super.ngOnDestroy', () => {
    const superNgOnDestroySpy = jest.spyOn(Object.getPrototypeOf(component), 'ngOnDestroy');
    component.ngOnDestroy();
    expect(mockBodyObserver.disconnect).toHaveBeenCalled();
    expect(superNgOnDestroySpy).toHaveBeenCalled();
  });
  
  describe('Template', () => {
    it('should render menu item cards', () => {
        fixture.detectChanges();
        const cardElements = fixture.nativeElement.querySelectorAll('.info-card');
        expect(cardElements.length).toBe(component.menuItems.length);
    });
    
    it('should render ngx-echarts for all charts', () => {
        fixture.detectChanges();
        const chartElements = fixture.nativeElement.querySelectorAll('ngx-echarts');
        expect(chartElements.length).toBe(4); 
    });
  });
});
