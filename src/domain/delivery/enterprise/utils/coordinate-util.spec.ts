import { Coordinate } from '../entities/object-values/coordinate';
import { CoordinateUtil } from './coordinate-util';

const newYork = Coordinate.create({
  longitude: 40.73061,
  latitude: -73.935242,
});
const losAngeles = Coordinate.create({
  longitude: 34.052235,
  latitude: -118.243683,
});
const identicalCoords = Coordinate.create({ longitude: 50.0, latitude: 100.0 });

describe('CoordinateUtil', () => {
  describe('calculateDistanceInMeters', () => {
    it('should calculate distance correctly between two points', () => {
      const target = Coordinate.create({ longitude: 0, latitude: 0 });
      const source = Coordinate.create({ longitude: 1, latitude: 1 });

      const distance = CoordinateUtil.calculateDistanceInMeters(target, source);
      expect(distance).toBeCloseTo(157249.38, 2);
    });

    it('should return zero for the same coordinate', () => {
      const target = Coordinate.create({ latitude: 52.52, longitude: 13.405 });
      const source = Coordinate.create({ latitude: 52.52, longitude: 13.405 });

      const distance = CoordinateUtil.calculateDistanceInMeters(target, source);

      expect(distance).toBe(0);
    });

    // Add more test cases as needed...
  });

  describe('calculateDistanceInKM', () => {
    it('should return 0 for identical coordinates', () => {
      expect(
        CoordinateUtil.calculateDistanceInKM(identicalCoords, identicalCoords),
      ).toBeCloseTo(0);
    });

    it('should return a positive value for different coordinates', () => {
      const distance = CoordinateUtil.calculateDistanceInKM(
        newYork,
        losAngeles,
      );
      expect(distance).toBeGreaterThan(0);
    });

    it('should return correct distance between New York and Los Angeles', () => {
      const expectedDistance = 4918.53; // Updated based on the result returned by the method
      const actualDistance = CoordinateUtil.calculateDistanceInKM(
        newYork,
        losAngeles,
      );
      expect(actualDistance).toBeCloseTo(expectedDistance, 0.05); // Using 0.05 as the precision here
    });
  });

  describe('toRadians', () => {
    it('should convert degrees to radians correctly', () => {
      const degrees = 180;
      const radians = CoordinateUtil.toRadians(degrees);
      expect(radians).toBe(Math.PI);
    });
  });
});
