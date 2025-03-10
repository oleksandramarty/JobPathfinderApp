import { CommonModule, registerLocaleData } from '@angular/common';
import localeEN from '@angular/common/locales/en';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app/app.component';
import { RouterModule, Routes } from '@angular/router';

registerLocaleData(localeEN, 'en');

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('../auth-area/auth-area.module')
      .then(m => m.AuthAreaModule)
  }
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: []
})
export class AppModule {}
