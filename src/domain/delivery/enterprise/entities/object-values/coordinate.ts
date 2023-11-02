import { ValueObject } from '@/core/entities/base-value-object';

export interface CoordinateProps {
  longitude: number;
  latitude: number;
}

export class Coordinate extends ValueObject<CoordinateProps> {
  static create(props: CoordinateProps) {
    const coordinate = new Coordinate(props);
    return coordinate;
  }
}
