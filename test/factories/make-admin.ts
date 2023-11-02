import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Admin, AdminProps } from '@/domain/delivery/enterprise/entities/admin';
import { Document } from '@/domain/delivery/enterprise/entities/object-values/document';
import { faker } from '@faker-js/faker';

export const makeAdmin = (
  override: Partial<AdminProps> = {},
  id?: UniqueEntityId,
) => {
  const admin = Admin.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      document: override.document ?? Document.createCPF('321.123.137-00'),
      ...override,
    },
    id,
  );

  return admin;
};
