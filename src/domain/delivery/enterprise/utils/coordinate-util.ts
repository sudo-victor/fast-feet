import { Coordinate } from '../entities/object-values/coordinate';

export class CoordinateUtil {
  static calculateDistanceInMeters(
    target: Coordinate,
    source: Coordinate,
  ): number {
    const targetValue = target.toValue();
    const sourceValue = source.toValue();

    const R = 6371e3; // Raio da Terra em metros
    const φ1 = CoordinateUtil.toRadians(targetValue.latitude);
    const φ2 = CoordinateUtil.toRadians(sourceValue.latitude);
    const Δφ = CoordinateUtil.toRadians(
      targetValue.latitude - sourceValue.latitude,
    );
    const Δλ = CoordinateUtil.toRadians(
      targetValue.longitude - sourceValue.longitude,
    );

    const a =
      Math.sin(Δφ / 2) ** 2 +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;
    return distance;
  }

  static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}
