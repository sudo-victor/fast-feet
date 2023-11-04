import { InMemoryDelivererRepository } from 'test/repositories/in-memory-deliverer-repository';
import { faker } from '@faker-js/faker';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import { makeDeliverer } from 'test/factories/make-deliverer';
import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository';
import { makeAdmin } from 'test/factories/make-admin';
import { randomUUID } from 'crypto';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { UpdateDeliverer } from './update-deliverer';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

let inMemoryDelivererRepository: InMemoryDelivererRepository;
let inMemoryAdminRepository: InMemoryAdminRepository;
let fakeHasher: FakeHasher;
let sut: UpdateDeliverer;

describe('Update deliverer', () => {
  beforeEach(() => {
    inMemoryDelivererRepository = new InMemoryDelivererRepository();
    inMemoryAdminRepository = new InMemoryAdminRepository();
    fakeHasher = new FakeHasher();
    sut = new UpdateDeliverer(
      inMemoryDelivererRepository,
      inMemoryAdminRepository,
      fakeHasher,
    );
  });

  it('should be able to update a deliverer', async () => {
    const admin = makeAdmin();
    await inMemoryAdminRepository.create(admin);

    const deliverer = makeDeliverer();
    inMemoryDelivererRepository.create(deliverer);

    const payload = {
      id: deliverer.id.toString(),
      source: {
        name: 'New Full Name',
        email: faker.internet.email(),
        actorId: admin.id.toString(),
      },
    };

    const result = await sut.execute(payload);

    expect(result.isRight()).toEqual(true);
    expect(inMemoryDelivererRepository.items[0]).toEqual(
      expect.objectContaining({
        name: 'New Full Name',
      }),
    );
  });

  it('should to return an error if try to update a deliverer with an invalid actorId', async () => {
    const deliverer = makeDeliverer();
    inMemoryDelivererRepository.create(deliverer);

    const payload = {
      id: deliverer.id.toString(),
      source: {
        name: 'New Full Name',
        email: faker.internet.email(),
        actorId: randomUUID(),
      },
    };

    const result = await sut.execute(payload);

    expect(result.isLeft()).toEqual(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it('should to return an error if try to register a deliverer with an existent document', async () => {
    const admin = makeAdmin();
    await inMemoryAdminRepository.create(admin);

    const deliverer = makeDeliverer();
    inMemoryDelivererRepository.create(deliverer);

    const payload = {
      id: randomUUID(),
      source: {
        name: 'New Full Name',
        email: faker.internet.email(),
        actorId: admin.id.toString(),
      },
    };

    const result = await sut.execute(payload);

    expect(result.isLeft()).toEqual(true);
    expect(inMemoryDelivererRepository.items).toHaveLength(1);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
