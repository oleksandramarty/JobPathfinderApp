import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private _loaderIsBusyChanged$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  get loaderIsBusyChanged$(): BehaviorSubject<boolean> {
    return this._loaderIsBusyChanged$;
  }

  set isBusy(value: boolean) {
    this._loaderIsBusyChanged$.next(value);
  }
}
