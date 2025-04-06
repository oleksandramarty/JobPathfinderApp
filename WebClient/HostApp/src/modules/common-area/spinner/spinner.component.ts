import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { interval, Subject, takeUntil, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { LoaderService } from '@amarty/services';
import { BaseUnsubscribeComponent } from '@amarty/common';
import { fadeInOut } from '@amarty/animations';

@Component({
  selector: 'app-spinner',
  imports: [
    MatProgressSpinnerModule,
    CommonModule
  ],
  standalone: true,
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  animations: [fadeInOut]
})
export class SpinnerComponent extends BaseUnsubscribeComponent implements OnInit, OnDestroy {
  @Input() diameter: number | null = 80;

  public speakerLoadingArray: string[] = [
    'Connecting the microphone... Hopefully, no echo from the past.',
    'Setting up the stage... Don’t forget the applause!',
    'Checking the sound... One, two, one, two, can you hear me?',
    'Warming up the vocal cords... Almost like karaoke!',
    'Generating charisma... This might take a second!',
    'Warming up the microphones... They need attention too.',
    'Finding the right words... It\'s like magic, but with code!',
    'Clearing the speaker’s throat... *Ahem!*',
    'Syncing voice with thoughts... Please wait!',
    'Calibrating confidence level... Should be at 100%!',
    'Loading intelligence... Artificial, but still!',
    'Letting the speaker warm up... Like a fine wine.',
    'Choosing the right tone... Baritone, tenor, or robot?',
    'Putting the voice in queue... Two podcasts and a stand-up before you.'
  ];

  public speakerLoadingIndex: number = 0;
  public isBusy: boolean | undefined;

  private timerUnsubscribe$ = new Subject<void>();

  constructor(
    private readonly loaderService: LoaderService
  ) {
    super();
  }

  override ngOnInit(): void {
    this.loaderService.loaderIsBusyChanged$
      .pipe(
        tap((value) => {
          this.isBusy = value;
          if (value) {
            this._startTimer();
          } else {
            this._stopTimer();
          }
        })
      )
      .subscribe();

    super.ngOnInit();
  }

  private _startTimer(): void {
    this._stopTimer();

    interval(3000)
      .pipe(
        takeUntil(this.timerUnsubscribe$),
        tap(() => {
          setTimeout(() => {
            this.speakerLoadingIndex = (this.speakerLoadingIndex + 1) % this.speakerLoadingArray.length;
          }, 100);
        })
      )
      .subscribe();
  }

  private _stopTimer(): void {
    this.timerUnsubscribe$.next();
  }

  override ngOnDestroy(): void {
    this._stopTimer();
    this.timerUnsubscribe$.complete();
    super.ngOnDestroy();
  }
}
