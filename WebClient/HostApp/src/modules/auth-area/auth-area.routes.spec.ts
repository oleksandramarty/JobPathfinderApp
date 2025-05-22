import { authRoutes } from './auth-area.routes';
import { Routes } from '@angular/router';
import { AuthAreaComponent } from './auth-area/auth-area.component';

describe('Auth Area Routes', () => {
  it('should define authRoutes', () => {
    expect(authRoutes).toBeDefined();
    expect(authRoutes.length).toBeGreaterThan(0);
  });

  it('should have a root route configured for AuthAreaComponent with children', () => {
    const rootRoute = authRoutes.find(r => r.path === '');
    expect(rootRoute).toBeDefined();
    expect(rootRoute?.component).toBe(AuthAreaComponent);
    expect(rootRoute?.children).toBeDefined();
    expect(rootRoute?.children?.length).toBeGreaterThan(0);
  });

  it('should have a default child route redirecting to sign-in', () => {
    const rootRoute = authRoutes.find(r => r.path === '');
    const defaultChildRoute = rootRoute?.children?.find(r => r.path === '');
    expect(defaultChildRoute).toBeDefined();
    expect(defaultChildRoute?.pathMatch).toBe('full');
    expect(defaultChildRoute?.redirectTo).toBe('sign-in');
  });

  it('should define a child route for "sign-in"', () => {
    const rootRoute = authRoutes.find(r => r.path === '');
    const signInRoute = rootRoute?.children?.find(r => r.path === 'sign-in');
    expect(signInRoute).toBeDefined();
    expect(signInRoute?.loadComponent).toBeDefined();
  });

  it('should define a child route for "sign-up"', () => {
    const rootRoute = authRoutes.find(r => r.path === '');
    const signUpRoute = rootRoute?.children?.find(r => r.path === 'sign-up');
    expect(signUpRoute).toBeDefined();
    expect(signUpRoute?.loadComponent).toBeDefined();
  });

  it('should define a child route for "forgot"', () => {
    const rootRoute = authRoutes.find(r => r.path === '');
    const forgotRoute = rootRoute?.children?.find(r => r.path === 'forgot');
    expect(forgotRoute).toBeDefined();
    expect(forgotRoute?.loadComponent).toBeDefined();
  });
});
