import { Optional } from '@/@types/optional';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Status } from './status';
import { AggregateRoot } from '@/core/entities/base-aggregate-root';

export interface OrderProps {
  name: string;
  status: Status[];
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Order extends AggregateRoot<OrderProps> {
  static create(
    props: Optional<OrderProps, 'createdAt' | 'updatedAt'>,
    id?: UniqueEntityId,
  ) {
    const order = new Order(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return order;
  }
}
