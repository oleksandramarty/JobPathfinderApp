import {ApplicationConfig, importProvidersFrom, provideZoneChangeDetection} from '@angular/core';
import { provideRouter } from '@angular/router';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgxEchartsModule } from 'ngx-echarts';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { reducers } from '@amarty/store';
import {
  API_BASE_URL_AuthGateway,
  API_BASE_URL_Localizations,
  API_BASE_URL_Dictionaries
} from '@amarty/api';
import {routes} from './app.routes';
import {environment} from '../../utils/environments/environment';
import {BaseUrlInterceptor} from '../../utils/api.interceptor';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi()),
    provideStore(reducers),
    provideStoreDevtools({ maxAge: 25, logOnly: environment.production }),

    importProvidersFrom(
      BrowserModule,
      BrowserAnimationsModule,
      MatSnackBarModule,
      NgxEchartsModule.forRoot({ echarts: () => import('echarts') })
    ),

    { provide: API_BASE_URL_AuthGateway, useValue: environment.authGatewayApiUrl },
    { provide: API_BASE_URL_Localizations, useValue: environment.localizationApiUrl },
    { provide: API_BASE_URL_Dictionaries, useValue: environment.dictionaryApiUrl },

    {
      provide: HTTP_INTERCEPTORS,
      useClass: BaseUrlInterceptor,
      multi: true,
    }
  ]
};
