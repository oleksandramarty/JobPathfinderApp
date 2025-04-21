import { Component, OnDestroy } from '@angular/core';
import { generateRandomId } from '@amarty/utils';
import { CommonDialogService, DictionaryService, LocalizationService } from '@amarty/services';
import { Store } from '@ngrx/store';
import { MatSnackBar } from '@angular/material/snack-bar';
import { selectUser } from '@amarty/store';
import { takeUntil, tap } from 'rxjs';
import { UserResponse, MenuItem } from '@amarty/models';
import { NgxEchartsModule } from 'ngx-echarts';
import { ApplicationDialogComponent } from '../dialogs/application-dialog/application-dialog.component';
import { BaseUnsubscribeComponent } from '@amarty/common';
import { CommonModule } from '@angular/common';
import { TranslationPipe } from '@amarty/pipes';
import { LOCALIZATION_KEYS } from '@amarty/localizations';

const colorsDark = {
  background: '#1e1e2f',
  text: '#d1d1e0',
  axisLine: '#555',
  primary: '#4fd1c5',
  secondary: '#63b3ed',
  third: '#f6ad55',
  emptyCell: '#2b2b3d',
  borderCell: '#444'
};

const colorsLight = {
  background: '#ffffff',
  text: '#333333',
  axisLine: '#cccccc',
  primary: '#3182ce',
  secondary: '#38a169',
  third: '#d69e2e',
  emptyCell: '#f0f0f0',
  borderCell: '#dddddd'
};

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule,
    TranslationPipe,
    NgxEchartsModule
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
  host: { 'data-id': generateRandomId(12) }
})
export class LandingComponent extends BaseUnsubscribeComponent implements OnDestroy {
  public profileImage = 'images/background.jpg';
  public profileBgImage = `background-image: url('${this.profileImage}');`;
  public countryCode: string | undefined;
  public currentUser: UserResponse | undefined;

  public menuItems: MenuItem[] = [
    { key: LOCALIZATION_KEYS.MENU.ACTIVE_APPLICATIONS, value: '24', className: 'card-active-applications', icon: 'fa-solid fa-paper-plane' },
    { key: LOCALIZATION_KEYS.MENU.TODOS, value: '7', className: 'card-todos', icon: 'fa-solid fa-list' },
    { key: LOCALIZATION_KEYS.MENU.RESPONSE_RATE, value: '50%', className: 'card-response-rate', icon: 'fa-solid fa-percent' },
    { key: LOCALIZATION_KEYS.MENU.UPCOMING_INTERVIEWS, value: '3', className: 'card-upcoming-interviews', icon: 'fa-solid fa-calendar-days' },
  ];

  public heatmapOptions: any;
  public lineChartOptions: any;
  public barChartOptions: any;
  public pieChartOptions: any;

  private theme = colorsDark;
  private bodyObserver: MutationObserver;

  public jobData = [
    { date: '2025-03-01', count: 3 },
    { date: '2025-03-02', count: 5 },
    { date: '2025-03-05', count: 7 },
    { date: '2025-03-10', count: 2 },
    { date: '2025-03-12', count: 6 },
    { date: '2025-03-15', count: 8 },
    { date: '2025-03-18', count: 4 },
    { date: '2025-03-20', count: 9 }
  ];

  constructor(
    private readonly store: Store,
    private readonly snackBar: MatSnackBar,
    private readonly dialogService: CommonDialogService,
    private readonly localizationService: LocalizationService,
    private readonly dictionaryService: DictionaryService
  ) {
    super();

    this.bodyObserver = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          this._onBodyClassChanged();
        }
      });
    });

    this.bodyObserver.observe(document.body, { attributes: true });
  }

  override ngOnInit() {
    this._onBodyClassChanged();

    this.store.select(selectUser)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        tap(user => {
          this.currentUser = user;
          this.countryCode = this.dictionaryService.countryData?.find(item => item.id === user?.userSetting?.countryId)?.code?.toLowerCase();
        })
      ).subscribe();

    this.localizationService.localeChangedSub
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.updateCharts();
      });

    this.updateCharts();
    super.ngOnInit();
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this.bodyObserver.disconnect();
  }

  private _onBodyClassChanged(): void {
    const bodyClasses = document.body.classList;
    const isDark = bodyClasses.contains('dark-theme');
    const isLight = bodyClasses.contains('light-theme');

    if (isDark) {
      this.theme = colorsDark;
    } else if (isLight) {
      this.theme = colorsLight;
    }

    this.updateCharts();
  }

  private updateCharts(): void {
    this.menuItems.forEach(menuItem => {
      menuItem.title = this.localizationService.getTranslation(menuItem.key);
    });

    this.heatmapOptions = {
      backgroundColor: this.theme.background,
      title: {
        top: 30,
        left: 'center',
        text: this.localizationService.getTranslation(LOCALIZATION_KEYS.STATS.NEW_JOB_LISTINGS_PER_DAY),
        textStyle: { color: this.theme.text }
      },
      tooltip: {},
      visualMap: {
        min: 0,
        max: 10,
        type: 'piecewise',
        orient: 'horizontal',
        left: 'center',
        top: 65,
        inRange: {
          color: [this.theme.secondary, this.theme.primary]
        },
        textStyle: {
          color: this.theme.text
        }
      },
      calendar: {
        top: 120,
        left: 30,
        right: 30,
        cellSize: ['auto', 15],
        range: '2025',
        itemStyle: {
          color: this.theme.emptyCell,
          borderWidth: 0.5,
          borderColor: this.theme.borderCell
        },
        yearLabel: { show: false },
        monthLabel: {
          nameMap: this.localizationService.shortMonths,
          color: this.theme.text
        },
        dayLabel: {
          firstDay: 0,
          nameMap: this.localizationService.shortDays,
          color: this.theme.text
        }
      },
      series: {
        type: 'heatmap',
        coordinateSystem: 'calendar',
        data: this.getJobDataForChart()
      }
    };

    this.lineChartOptions = {
      backgroundColor: this.theme.background,
      title: {
        text: this.localizationService.getTranslation(LOCALIZATION_KEYS.STATS.JOB_APPLICATIONS_TREND),
        left: 'center',
        textStyle: { color: this.theme.text }
      },
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: this.jobData.map(j => j.date),
        axisLine: { lineStyle: { color: this.theme.axisLine } },
        axisLabel: { color: this.theme.text }
      },
      yAxis: {
        type: 'value',
        axisLine: { lineStyle: { color: this.theme.axisLine } },
        axisLabel: { color: this.theme.text }
      },
      series: [{
        name: this.localizationService.getTranslation(LOCALIZATION_KEYS.COMMON.JOB.NEW_APPLICATIONS),
        type: 'line',
        data: this.jobData.map(j => j.count),
        lineStyle: { color: this.theme.primary },
        itemStyle: { color: this.theme.primary },
        areaStyle: { color: 'rgba(79, 209, 197, 0.2)' }
      }]
    };

    this.barChartOptions = {
      backgroundColor: this.theme.background,
      title: {
        text: this.localizationService.getTranslation(LOCALIZATION_KEYS.STATS.TOP_COMPANIES),
        left: 'center',
        textStyle: { color: this.theme.text }
      },
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: ['Google', 'Microsoft', 'Amazon', 'Meta', 'Netflix'],
        axisLine: { lineStyle: { color: this.theme.axisLine } },
        axisLabel: { color: this.theme.text }
      },
      yAxis: {
        type: 'value',
        axisLine: { lineStyle: { color: this.theme.axisLine } },
        axisLabel: { color: this.theme.text }
      },
      series: [{
        type: 'bar',
        data: [20, 15, 12, 10, 8],
        itemStyle: { color: this.theme.secondary }
      }]
    };

    this.pieChartOptions = {
      backgroundColor: this.theme.background,
      title: {
        text: this.localizationService.getTranslation(LOCALIZATION_KEYS.STATS.APPLICATION_STATUS_DISTRIBUTION),
        left: 'center',
        textStyle: { color: this.theme.text }
      },
      tooltip: { trigger: 'item' },
      series: [{
        type: 'pie',
        radius: '50%',
        data: [
          { value: 24, name: this.localizationService.getTranslation(LOCALIZATION_KEYS.JOB_STATUS.APPLIED), itemStyle: { color: this.theme.primary } },
          { value: 12, name: this.localizationService.getTranslation(LOCALIZATION_KEYS.JOB_STATUS.IN_REVIEW), itemStyle: { color: this.theme.secondary } },
          { value: 8, name: this.localizationService.getTranslation(LOCALIZATION_KEYS.JOB_STATUS.INTERVIEW), itemStyle: { color: this.theme.third } },
          { value: 4, name: this.localizationService.getTranslation(LOCALIZATION_KEYS.JOB_STATUS.OFFER), itemStyle: { color: '#ed64a6' } },
          { value: 5, name: this.localizationService.getTranslation(LOCALIZATION_KEYS.JOB_STATUS.REJECTED), itemStyle: { color: '#f56565' } }
        ],
        label: { color: this.theme.text }
      }]
    };
  }

  getJobDataForChart(): [string, number][] {
    return this.jobData.map(job => [job.date, job.count]);
  }

  openApplicationDialog(): void {
    this.dialogService.showDialog<ApplicationDialogComponent, any>(
      ApplicationDialogComponent,
      {
        width: '1200px',
        maxWidth: '90vw',
      });
  }

  protected readonly LOCALIZATION_KEYS = LOCALIZATION_KEYS;
}
