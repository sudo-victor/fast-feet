import { Optional } from '@/@types/optional';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Status } from './status';
import { AggregateRoot } from '@/core/entities/base-aggregate-root';

export interface OrderProps {
  name: string;
  status: Status[];
  delivererId?: UniqueEntityId | null;
  recipientId?: UniqueEntityId | null;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Order extends AggregateRoot<OrderProps> {
  get name() {
    return this.props.name;
  }

  set name(name: string) {
    this.props.name = name;
  }

  get status() {
    return this.props.status;
  }

  get currentStatus() {
    return this.props.status.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    )[0];
  }

  get delivererId() {
    return this.props.delivererId;
  }

  set delivererId(delivererId: UniqueEntityId) {
    this.props.delivererId = delivererId;
  }

  get recipientId() {
    return this.props.recipientId;
  }

  set recipientId(recipientId: UniqueEntityId) {
    this.props.recipientId = recipientId;
  }

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
