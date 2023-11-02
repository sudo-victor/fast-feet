import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import {
  Deliverer,
  DelivererProps,
} from '@/domain/delivery/enterprise/entities/deliverer';
import { Document } from '@/domain/delivery/enterprise/entities/object-values/document';
import { faker } from '@faker-js/faker';

export const makeDeliverer = (
  override: Partial<DelivererProps> = {},
  id?: UniqueEntityId,
) => {
  const deliverer = Deliverer.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      document: override.document ?? Document.createCPF('182.028.137-00'),
      ...override,
    },
    id,
  );

  return deliverer;
};
