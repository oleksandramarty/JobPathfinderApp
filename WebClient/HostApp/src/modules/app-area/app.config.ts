import { ApplicationConfig, importProvidersFrom, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxEchartsModule } from 'ngx-echarts';

import { HttpLink } from 'apollo-angular/http';
import { provideNamedApollo } from 'apollo-angular';
import { InMemoryCache } from '@apollo/client/core';

import { reducers } from '@amarty/store';
import {
  API_BASE_URL_AuthGateway,
  API_BASE_URL_Localizations,
  API_BASE_URL_Dictionaries,
  API_BASE_URL_Profile
} from '@amarty/api';

import { BaseUrlInterceptor } from '../../utils/api.interceptor';
import { routes } from './app.routes';
import { environment } from '../../utils/environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    provideStore(reducers),
    provideStoreDevtools({ maxAge: 25, logOnly: environment.production }),

    importProvidersFrom(BrowserModule),
    importProvidersFrom(BrowserAnimationsModule),
    importProvidersFrom(MatSnackBarModule),
    importProvidersFrom(MatNativeDateModule),
    importProvidersFrom(NgxEchartsModule.forRoot({ echarts: () => import('echarts') })),

    provideNamedApollo(() => {
      const httpLink = inject(HttpLink);

      return {
        default: {
          cache: new InMemoryCache(),
          link: httpLink.create({ uri: environment.authGatewayApiUrl + '/graphql' }),
        },
        authGateway: {
          cache: new InMemoryCache(),
          link: httpLink.create({ uri: environment.authGatewayApiUrl + '/graphql' }),
        },
      };
    }),

    {
      provide: HTTP_INTERCEPTORS,
      useClass: BaseUrlInterceptor,
      multi: true,
    },

    { provide: API_BASE_URL_AuthGateway, useValue: environment.authGatewayApiUrl },
    { provide: API_BASE_URL_Localizations, useValue: environment.localizationApiUrl },
    { provide: API_BASE_URL_Dictionaries, useValue: environment.dictionaryApiUrl },
    { provide: API_BASE_URL_Profile, useValue: environment.profileApiUrl },
  ],
};
