import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { API_BASE_URL_AuditTrail } from './audit-trail-api.service';
import { InjectionToken } from '@angular/core';

describe('AuditTrail API Token', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Included for good measure if a service might be added later
      providers: [
        // If there was a service class that used this token, it would be provided here.
        // For example:
        // SomeApiService,
        // { provide: API_BASE_URL_AuditTrail, useValue: 'http://test-audit-api' }
      ]
    });
  });

  it('API_BASE_URL_AuditTrail InjectionToken should be defined', () => {
    expect(API_BASE_URL_AuditTrail).toBeDefined();
    // Check if it's an instance of InjectionToken (which it should be)
    expect(API_BASE_URL_AuditTrail instanceof InjectionToken).toBe(true);
  });

  it('API_BASE_URL_AuditTrail token should have the correct description', () => {
    // The description is part of the InjectionToken constructor
    // e.g. new InjectionToken<string>('API_BASE_URL_AuditTrail')
    // The 'API_BASE_URL_AuditTrail' string is the token description.
    expect(API_BASE_URL_AuditTrail.toString()).toContain('InjectionToken API_BASE_URL_AuditTrail');
  });
});
