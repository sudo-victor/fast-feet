import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import {
  Recipient,
  RecipientProps,
} from '@/domain/delivery/enterprise/entities/recipient';
import { faker } from '@faker-js/faker';
import { Coordinate } from '@/domain/delivery/enterprise/entities/object-values/coordinate';

export const makeRecipient = (
  override: Partial<RecipientProps> = {},
  id?: UniqueEntityId,
) => {
  const recipient = Recipient.create(
    {
      name: faker.person.fullName(),
      coordinate: Coordinate.create({
        longitude: faker.location.longitude(),
        latitude: faker.location.latitude(),
      }),
      ...override,
    },
    id,
  );

  return recipient;
};
