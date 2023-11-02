import { Optional } from '@/@types/optional';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { BaseEntity } from 'src/core/entities/base-entity';
import { Status } from './status';

export interface PackageProps {
  name: string;
  status: Status[];
  recipientId: UniqueEntityId;
  createdAt: Date;
  updatedAt: Date;
}

export class Package extends BaseEntity<PackageProps> {
  static create(
    props: Optional<PackageProps, 'createdAt' | 'updatedAt'>,
    id?: UniqueEntityId,
  ) {
    const package = new Package(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return package;
  }
}
