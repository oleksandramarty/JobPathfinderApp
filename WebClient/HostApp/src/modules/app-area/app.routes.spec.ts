import { routes } from './app.routes';
import { Routes } from '@angular/router';

describe('App Routes', () => {
  it('should define routes', () => {
    expect(routes).toBeDefined();
    expect(routes.length).toBeGreaterThan(0);
  });

  it('should have a default route redirecting to auth/sign-in', () => {
    const defaultRoute = routes.find(r => r.path === '');
    expect(defaultRoute).toBeDefined();
    expect(defaultRoute?.pathMatch).toBe('full');
    expect(defaultRoute?.redirectTo).toBe('auth/sign-in');
  });

  it('should define a route for "karma"', () => {
    const karmaRoute = routes.find(r => r.path === 'karma');
    expect(karmaRoute).toBeDefined();
    expect(karmaRoute?.canActivate).toBeDefined(); // Check if AuthGuard is mentioned
    expect(karmaRoute?.loadComponent).toBeDefined();
  });

  it('should define a route for "profile/:login"', () => {
    const profileRoute = routes.find(r => r.path === 'profile/:login');
    expect(profileRoute).toBeDefined();
    expect(profileRoute?.canActivate).toBeDefined();
    expect(profileRoute?.loadComponent).toBeDefined();
  });

  it('should define a wildcard route redirecting to not-found', () => {
    const wildcardRoute = routes.find(r => r.path === '**');
    expect(wildcardRoute).toBeDefined();
    expect(wildcardRoute?.redirectTo).toBe('not-found');
  });

  // Add more tests for other specific routes as needed
});
