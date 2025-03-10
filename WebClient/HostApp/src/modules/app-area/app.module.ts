import { CommonModule, registerLocaleData } from '@angular/common';
import localeEN from '@angular/common/locales/en';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app/app.component';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';
import { HeaderComponent } from '../common-area/header/header.component';
import { NightSkyComponent } from '../common-area/background/night-sky/night-sky.component';
import { FooterComponent } from '../common-area/footer/footer.component';
import { StoreModule } from '@ngrx/store';
import { reducers, SharedStoreModule } from '@amarty/store';
import { API_BASE_URL_AuthGateway, UserApiClient } from '@amarty/api';
import {LandingComponent} from '../landing-area/landing.component';
import {InDevelopmentComponent} from '../common-area/in-development/in-development.component';
import {NotFoundComponent} from '../common-area/not-found/not-found.component';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {BaseUrlInterceptor} from '../../utils/api.interceptor';
import {environment} from '../../utils/environments/environment';
import {AuthGuard} from '../../utils/auth-guard';
import {NgxEchartsModule} from 'ngx-echarts';
import {ProfileAreaComponent} from '../profile-area/profile-area.component';

registerLocaleData(localeEN, 'en');

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'auth/sign-in' },

  { path: 'jobs', pathMatch: 'full', redirectTo: 'in-development' },
  { path: 'companies', pathMatch: 'full', redirectTo: 'in-development' },
  { path: 'karma', pathMatch: 'full', redirectTo: 'in-development' },
  {
    path: 'home',
    component: LandingComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'profile',
    component: ProfileAreaComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'auth',
    loadChildren: () =>
        loadRemoteModule('AuthApp', './Module').then((m) => m.AuthAreaModule),
  },
  { path: 'in-development', component: InDevelopmentComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'not-found' },
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,

    StoreModule.forRoot(reducers),
    SharedStoreModule,

    HttpClientModule,

    NgxEchartsModule.forRoot({ echarts: () => import('echarts') }),

    // Common
    NightSkyComponent,
    HeaderComponent,
    FooterComponent
  ],
  providers: [
    provideAnimationsAsync(),
    { provide: API_BASE_URL_AuthGateway, useValue: environment.authGatewayApiUrl },
    UserApiClient,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BaseUrlInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
  exports: []
})
export class AppModule {}
