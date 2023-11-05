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

  static calculateDistanceInKM(target: Coordinate, source: Coordinate) {
    const from = target.toValue();
    const to = source.toValue();

    if (from.latitude === to.latitude && from.longitude === to.longitude) {
      return 0;
    }

    const fromRadian = (Math.PI * from.latitude) / 180;
    const toRadian = (Math.PI * to.latitude) / 180;

    const theta = from.longitude - to.longitude;
    const radTheta = (Math.PI * theta) / 180;

    let dist =
      Math.sin(fromRadian) * Math.sin(toRadian) +
      Math.cos(fromRadian) * Math.cos(toRadian) * Math.cos(radTheta);

    if (dist > 1) {
      dist = 1;
    }

    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    dist = dist * 1.609344;

    return dist;
  }

  static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}
