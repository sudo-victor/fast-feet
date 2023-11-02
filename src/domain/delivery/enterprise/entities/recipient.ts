import { AggregateRoot } from '@/core/entities/base-aggregate-root';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Coordinate } from './object-values/coordinate';
import { Optional } from '@/@types/optional';

export interface RecipientProps {
  name: string;
  coordinate: Coordinate;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Recipient extends AggregateRoot<RecipientProps> {
  get name() {
    return this.props.name;
  }

  set name(name: string) {
    this.name = name;
    this.touch();
  }

  get coordinate() {
    return this.props.coordinate;
  }

  set coordinate(coordinate: Coordinate) {
    this.coordinate = coordinate;
    this.touch();
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(
    props: Optional<RecipientProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const recipient = new Recipient(
      {
        ...props,
        createdAt: new Date(),
      },
      id,
    );

    return recipient;
  }
}
