import { Component } from '@angular/core';
import {generateRandomId, handleApiError} from '@amarty/utils'
import {RouterLink} from "@angular/router";
import {BaseAuthorizeComponent} from '@amarty/shared/components';
import {AuthService} from '@amarty/services';
import {Store} from '@ngrx/store';
import {MatSnackBar} from '@angular/material/snack-bar';
import {selectUser} from '@amarty/store';
import {takeUntil, tap} from 'rxjs';
import {UserResponse} from '@amarty/api';
import {NgxEchartsModule} from 'ngx-echarts';

@Component({
  selector: 'app-landing',
    imports: [
        RouterLink,

      NgxEchartsModule
    ],
  standalone: true,
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
  host: { 'data-id': generateRandomId(12) }
})
export class LandingComponent extends BaseAuthorizeComponent{
  public profileImage: string = `images/background.jpg`;
  public profileBgImage: string = `background-image: url('${this.profileImage}');`;

  public currentUser: UserResponse | undefined;

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
    protected override readonly authService: AuthService,
    protected override readonly store: Store,
    protected override readonly snackBar: MatSnackBar,
  ) {
    super(authService, store, snackBar);
  }

  override ngOnInit() {
    this.store.select(selectUser)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        tap((user) => {
          this.currentUser = user;
        }),
        handleApiError(this.snackBar)
      ).subscribe();

    this.heatmapOptions = {
      title: {
        top: 30,
        left: 'center',
        text: 'New Job Listings per Day'
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
        yearLabel: { show: false }
      },
      series: {
        type: 'heatmap',
        coordinateSystem: 'calendar',
        data: this.getJobDataForChart()
      }
    };

    this.lineChartOptions = {
      title: { text: 'Job Applications Trend', left: 'center' },
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: this.jobData.map(j => j.date) },
      yAxis: { type: 'value' },
      series: [{ name: 'Applications', type: 'line', data: this.jobData.map(j => j.count) }]
    };

    this.barChartOptions = {
      title: { text: 'Top Companies (Applications)', left: 'center' },
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: ['Google', 'Microsoft', 'Amazon', 'Meta', 'Netflix'] },
      yAxis: { type: 'value' },
      series: [{ type: 'bar', data: [20, 15, 12, 10, 8] }]
    };

    this.pieChartOptions = {
      title: { text: 'Application Status Distribution', left: 'center' },
      tooltip: { trigger: 'item' },
      series: [{
        type: 'pie', radius: '50%',
        data: [
          { value: 24, name: 'Applied' },
          { value: 12, name: 'In Review' },
          { value: 8, name: 'Interview' },
          { value: 4, name: 'Offer' },
          { value: 5, name: 'Rejected' }
        ]
      }]
    };

    this.funnelChartOptions = {
      title: { text: 'Hiring Funnel', left: 'center' },
      tooltip: { trigger: 'item', formatter: '{b} : {c}%' },
      series: [{
        type: 'funnel', left: '10%', right: '10%', top: 60, bottom: 20,
        width: '80%', sort: 'descending',
        label: { position: 'inside' },
        data: [
          { value: 100, name: 'Applications Sent' },
          { value: 75, name: 'Reviewed' },
          { value: 50, name: 'Interviewed' },
          { value: 25, name: 'Final Interview' },
          { value: 10, name: 'Offer' }
        ]
      }]
    };

    super.ngOnInit();
  }

  getJobDataForChart(): [string, number][] {
    return this.jobData.map(job => [job.date, job.count]);
  }
}
