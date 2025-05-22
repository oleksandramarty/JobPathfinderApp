import { AnimationTriggerMetadata } from '@angular/animations';
import { fadeInOut, slideInFromLeft, slideInOut } from './animations';

describe('Animation Triggers', () => {
  describe('fadeInOut', () => {
    it('should be defined', () => {
      expect(fadeInOut).toBeDefined();
    });

    it('should be an instance of AnimationTriggerMetadata with correct name and definitions', () => {
      // Check for properties characteristic of AnimationTriggerMetadata
      expect(fadeInOut).toHaveProperty('name');
      expect(fadeInOut.name).toEqual('fadeInOut');
      expect(fadeInOut).toHaveProperty('definitions');
      expect(Array.isArray(fadeInOut.definitions)).toBe(true);
      expect(fadeInOut.definitions.length).toBeGreaterThan(0); // Should have state/transition definitions
    });
  });

  describe('slideInFromLeft', () => {
    it('should be defined', () => {
      expect(slideInFromLeft).toBeDefined();
    });

    it('should be an instance of AnimationTriggerMetadata with correct name and definitions', () => {
      expect(slideInFromLeft).toHaveProperty('name');
      expect(slideInFromLeft.name).toEqual('slideInFromLeft');
      expect(slideInFromLeft).toHaveProperty('definitions');
      expect(Array.isArray(slideInFromLeft.definitions)).toBe(true);
      expect(slideInFromLeft.definitions.length).toBeGreaterThan(0);
    });
  });

  describe('slideInOut', () => {
    it('should be defined', () => {
      expect(slideInOut).toBeDefined();
    });

    it('should be an instance of AnimationTriggerMetadata with correct name and definitions', () => {
      expect(slideInOut).toHaveProperty('name');
      expect(slideInOut.name).toEqual('slideInOut');
      expect(slideInOut).toHaveProperty('definitions');
      expect(Array.isArray(slideInOut.definitions)).toBe(true);
      expect(slideInOut.definitions.length).toBeGreaterThan(0);
    });
  });
});
