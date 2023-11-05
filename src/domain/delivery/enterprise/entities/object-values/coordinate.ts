import { ValueObject } from '@/core/entities/base-value-object';
import { CoordinateUtil } from '../../utils/coordinate-util';

export interface CoordinateProps {
  longitude: number;
  latitude: number;
}

export class Coordinate extends ValueObject<CoordinateProps> {
  toValue() {
    return this.props;
  }

  static create(props: CoordinateProps) {
    const coordinate = new Coordinate(props);
    return coordinate;
  }

  calculateDistanceInMeters(otherCoodinate: Coordinate) {
    return CoordinateUtil.calculateDistanceInMeters(this, otherCoodinate);
  }
}
