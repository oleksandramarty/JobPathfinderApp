import { Component } from '@angular/core';
import {generateRandomId} from '@amarty/utils';
import {CommonDialogService, DictionaryService, LocalizationService} from '@amarty/services';
import { Store } from '@ngrx/store';
import { MatSnackBar } from '@angular/material/snack-bar';
import { selectUser } from '@amarty/store';
import { takeUntil, tap } from 'rxjs';
import { UserResponse } from '@amarty/models';
import { NgxEchartsModule } from 'ngx-echarts';
import { ApplicationDialogComponent } from '../dialogs/application-dialog/application-dialog.component';
import { MenuItem } from '@amarty/models';
import { BaseUnsubscribeComponent } from '@amarty/common';
import {CommonModule} from '@angular/common';
import { TranslationPipe } from '@amarty/pipes';

@Component({
  selector: 'app-landing',
    imports: [
      CommonModule,
      TranslationPipe,
      NgxEchartsModule
    ],
  standalone: true,
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
  host: { 'data-id': generateRandomId(12) }
})
export class LandingComponent extends BaseUnsubscribeComponent{
  public profileImage: string = `images/background.jpg`;
  public profileBgImage: string = `background-image: url('${this.profileImage}');`;
  public countryCode: string | undefined;

  public currentUser: UserResponse | undefined;

  public menuItems: MenuItem[] = [
    { key: 'MENU.ACTIVE_APPLICATIONS', value: '24', className: 'card-active-applications', icon: 'fa-solid fa-paper-plane' },
    { key: 'MENU.TODOS', value: '7', className: 'card-todos', icon: 'fa-solid fa-list' },
    { key: 'MENU.RESPONSE_RATE', value: '50%', className: 'card-response-rate', icon: 'fa-solid fa-percent' },
    { key: 'MENU.UPCOMING_INTERVIEWS', value: '3', className: 'card-upcoming-interviews', icon: 'fa-solid fa-calendar-days' },
  ]

  public heatmapOptions: any;
  public lineChartOptions: any;
  public barChartOptions: any;
  public pieChartOptions: any;
  public funnelChartOptions: any;

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
  }

  override ngOnInit() {
    this.store.select(selectUser)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        tap((user) => {
          this.currentUser = user;

          this.countryCode = this.dictionaryService.countryData?.find(item => item.id === this.currentUser?.userSetting?.countryId)?.code?.toLowerCase();
        })
      ).subscribe();

    this.localizationService.localeChangedSub
      .pipe(
        takeUntil(this.ngUnsubscribe),
        tap((state) => {
          if (!!state) {
            this.menuItems.forEach(menuItem => {
              menuItem.title = this.localizationService.getTranslation(menuItem.key);
            });

            this.heatmapOptions = {
              title: {
                top: 30,
                left: 'center',
                text: this.localizationService.getTranslation('STATS.NEW_JOB_LISTINGS_PER_DAY')
              },
              tooltip: {},
              visualMap: {
                min: 0,
                max: 10,
                type: 'piecewise',
                orient: 'horizontal',
                left: 'center',
                top: 65
              },
              calendar: {
                top: 120,
                left: 30,
                right: 30,
                cellSize: ['auto', 15],
                range: '2025',
                itemStyle: {
                  borderWidth: 0.5
                },
                yearLabel: { show: false },
                monthLabel: {
                  nameMap: this.localizationService.shortMonths
                },
                dayLabel: {
                  firstDay: 0,
                  nameMap: this.localizationService.shortDays
                }
              },
              series: {
                type: 'heatmap',
                coordinateSystem: 'calendar',
                data: this.getJobDataForChart()
              }
            };

            this.lineChartOptions = {
              title: { text: this.localizationService.getTranslation('STATS.JOB_APPLICATIONS_TREND'), left: 'center' },
              tooltip: { trigger: 'axis' },
              xAxis: { type: 'category', data: this.jobData.map(j => j.date) },
              yAxis: { type: 'value' },
              series: [{ name: this.localizationService.getTranslation('COMMON.APPLICATIONS'), type: 'line', data: this.jobData.map(j => j.count) }]
            };

            this.barChartOptions = {
              title: { text: this.localizationService.getTranslation('STATS.TOP_COMPANIES'), left: 'center' },
              tooltip: { trigger: 'axis' },
              xAxis: { type: 'category', data: ['Google', 'Microsoft', 'Amazon', 'Meta', 'Netflix'] },
              yAxis: { type: 'value' },
              series: [{ type: 'bar', data: [20, 15, 12, 10, 8] }]
            };

            this.pieChartOptions = {
              title: { text: this.localizationService.getTranslation('STATS.APPLICATION_STATUS_DISTRIBUTION'), left: 'center' },
              tooltip: { trigger: 'item' },
              series: [{
                type: 'pie', radius: '50%',
                data: [
                  { value: 24, name: this.localizationService.getTranslation('STATUS.APPLIED') },
                  { value: 12, name: this.localizationService.getTranslation('STATUS.IN_REVIEW') },
                  { value: 8, name:  this.localizationService.getTranslation('STATUS.INTERVIEW') },
                  { value: 4, name:  this.localizationService.getTranslation('STATUS.OFFER') },
                  { value: 5, name: this.localizationService.getTranslation('STATUS.REJECTED') }
                ]
              }]
            };
          }
        })
      )
      .subscribe();

    super.ngOnInit();
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
}
