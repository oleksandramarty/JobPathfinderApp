import { Component, OnInit } from '@angular/core';
import { environment } from '../../../utils/environments/environment';
import { Store } from '@ngrx/store';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoaderService } from '@amarty/services'
import { auth_clearAll } from '@amarty/store';
import {
  clearLocalStorageAndRefresh,
  generateRandomId,
  getLocalStorageItem,
  setLocalStorageItem
} from '@amarty/utils'
import { MatTooltipModule } from '@angular/material/tooltip';
import {AuthService} from '../../../utils/services/auth.service';
import {CommonModule} from '@angular/common';
import { TranslationPipe } from '@amarty/pipes';

@Component({
    selector: 'app-footer',
    imports: [
      CommonModule,
      TranslationPipe,
      MatTooltipModule
    ],
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
    standalone: true,
    host: { 'data-id': generateRandomId(12) }
})
export class FooterComponent implements OnInit {
  public darkTheme: boolean = true;

  constructor(
    private readonly authService: AuthService,
    private readonly store: Store,
    private readonly snackBar: MatSnackBar,
    private readonly router: Router,
    private readonly loaderService: LoaderService) {
    const theme = getLocalStorageItem<string>('theme');

    if (!theme) {
      setLocalStorageItem('theme', 'dark');
    }

    if (theme === 'dark') {
      this.darkTheme = true;
    } else if (theme === 'light') {
      this.darkTheme = false;
    }

    this._toggleTheme();
  }

  public ngOnInit() {
    this.darkTheme = this.darkTheme = document.body.classList.contains('dark-theme');
  }

  get buildVersion(): string {
    return environment.name ?? 'No version';
  }

  public resetSite(): void {
    this.store.dispatch(auth_clearAll());
    clearLocalStorageAndRefresh(true);
    window.location.reload();
  }

  public turnOffLoader(): void {
    this.loaderService.isBusy = false;
  }

  public toggleTheme(): void {
    this.darkTheme = !this.darkTheme;
    this._toggleTheme();
  }

  private _toggleTheme(): void {
    setLocalStorageItem('theme', this.darkTheme ? 'dark' : 'light');
    document.body.classList.remove(this.darkTheme ? 'light-theme' : 'dark-theme');
    document.body.classList.add(this.darkTheme ? 'dark-theme' : 'light-theme');
  }
}
