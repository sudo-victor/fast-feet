import { Coordinate } from '../entities/object-values/coordinate';
import { CoordinateUtil } from './coordinate-util';

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

  describe('toRadians', () => {
    it('should convert degrees to radians correctly', () => {
      const degrees = 180;
      const radians = CoordinateUtil.toRadians(degrees);
      expect(radians).toBe(Math.PI);
    });
  });
});
