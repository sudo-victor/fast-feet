import { Optional } from '@/@types/optional';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { BaseEntity } from 'src/core/entities/base-entity';

export interface StatusProps {
  situation: 'pending' | 'collected' | 'delivered';
  createdAt: Date;
}

export class Status extends BaseEntity<StatusProps> {
  get situation() {
    return this.props.situation;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  static create(
    props: Optional<StatusProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const status = new Status(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return status;
  }
}
