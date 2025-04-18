import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
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
import { routes } from './app.routes';
import { environment } from '../../utils/environments/environment';
import { BaseUrlInterceptor } from '../../utils/api.interceptor';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { MatNativeDateModule } from '@angular/material/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    provideStore(reducers),
    provideStoreDevtools({ maxAge: 25, logOnly: environment.production }),

    importProvidersFrom(MatNativeDateModule),

    importProvidersFrom(
      BrowserModule,
      BrowserAnimationsModule,
      MatSnackBarModule,
      NgxEchartsModule.forRoot({ echarts: () => import('echarts') })
    ),

    {
      provide: HTTP_INTERCEPTORS,
      useClass: BaseUrlInterceptor,
      multi: true,
    },

    { provide: API_BASE_URL_AuthGateway, useValue: environment.authGatewayApiUrl },
    { provide: API_BASE_URL_Localizations, useValue: environment.localizationApiUrl },
    { provide: API_BASE_URL_Dictionaries, useValue: environment.dictionaryApiUrl }
  ]
};
