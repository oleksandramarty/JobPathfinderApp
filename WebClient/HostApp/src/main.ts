import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './modules/app-area/app/app.component';
import { appConfig } from './modules/app-area/app.config';

bootstrapApplication(AppComponent, appConfig)
  .catch(err => console.error('🔥 Bootstrap Error:', err));
