import { Routes } from '@angular/router';
import { AuthGuard } from '../../utils/auth-guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'auth/sign-in' },

  { path: 'jobs', pathMatch: 'full', redirectTo: 'in-development' },
  { path: 'companies', pathMatch: 'full', redirectTo: 'in-development' },

  {
    path: 'karma',
    canActivate: [AuthGuard],
    loadComponent: () => import('../karma-area/karma-area.component').then(m => m.KarmaAreaComponent)
  },

  {
    path: 'home',
    canActivate: [AuthGuard],
    loadComponent: () => import('../landing-area/landing.component').then(m => m.LandingComponent)
  },

  {
    path: 'profile',
    canActivate: [AuthGuard],
    loadComponent: () => import('../profile-area/profile-area.component').then(m => m.ProfileAreaComponent)
  },

  {
    path: 'auth',
    loadChildren: () => import('../auth-area/auth-area.routes').then(m => m.authRoutes)
  },

  {
    path: 'in-development',
    loadComponent: () =>
      import('../common-area/in-development/in-development.component').then(m => m.InDevelopmentComponent)
  },

  {
    path: 'not-found',
    loadComponent: () =>
      import('../common-area/not-found/not-found.component').then(m => m.NotFoundComponent)
  },

  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'not-found'
  }
];
