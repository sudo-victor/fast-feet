import { CreateRecipient } from './create-recipient';
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository';
import { faker } from '@faker-js/faker';
import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository';
import { makeAdmin } from 'test/factories/make-admin';
import { randomUUID } from 'crypto';
import { NotAllowedError } from '@/core/errors/not-allowed-error';

let inMemoryRecipientRepository: InMemoryRecipientRepository;
let inMemoryAdminRepository: InMemoryAdminRepository;
let sut: CreateRecipient;

describe('Authenticate deliverer', () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository();
    inMemoryAdminRepository = new InMemoryAdminRepository();
    sut = new CreateRecipient(
      inMemoryRecipientRepository,
      inMemoryAdminRepository,
    );
  });

  it('should be able to create a recipient', async () => {
    const admin = makeAdmin();
    await inMemoryAdminRepository.create(admin);

    const payload = {
      name: faker.person.fullName(),
      longitude: faker.location.longitude(),
      latitude: faker.location.latitude(),
      actorId: admin.id.toString(),
    };

    const result = await sut.execute(payload);

    expect(result.isRight()).toEqual(true);
    expect(inMemoryRecipientRepository.items).toHaveLength(1);
  });

  it('should not be able to create a recipient with invalid actorId', async () => {
    const payload = {
      name: faker.person.fullName(),
      longitude: faker.location.longitude(),
      latitude: faker.location.latitude(),
      actorId: randomUUID(),
    };

    const result = await sut.execute(payload);

    expect(result.isLeft()).toEqual(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
