import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Order, OrderProps } from '@/domain/delivery/enterprise/entities/order';
import { faker } from '@faker-js/faker';

export const makeOrder = (
  override: Partial<OrderProps> = {},
  id?: UniqueEntityId,
) => {
  const order = Order.create(
    {
      name: faker.person.fullName(),
      status: [],
      ...override,
    },
    id,
  );

  return order;
};
