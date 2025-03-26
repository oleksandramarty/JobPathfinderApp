import { Routes } from '@angular/router';
import { AuthAreaComponent } from './auth-area/auth-area.component';

export const authRoutes: Routes = [
  {
    path: '',
    component: AuthAreaComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'sign-in' },
      { path: 'sign-in', loadComponent: () => import('./auth-sign-in/auth-sign-in.component').then(m => m.AuthSignInComponent) },
      { path: 'sign-up', loadComponent: () => import('./auth-sign-up/auth-sign-up.component').then(m => m.AuthSignUpComponent) },
      { path: 'forgot', loadComponent: () => import('./auth-forgot/auth-forgot.component').then(m => m.AuthForgotComponent) },
    ]
  }
];
