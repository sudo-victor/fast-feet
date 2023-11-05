import { InMemoryDelivererRepository } from 'test/repositories/in-memory-deliverer-repository';
import { faker } from '@faker-js/faker';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import { makeDeliverer } from 'test/factories/make-deliverer';
import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository';
import { makeAdmin } from 'test/factories/make-admin';
import { randomUUID } from 'crypto';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { UpdateDelivererPassword } from './update-deliverer-password';
import { HashComparer } from '../cryptography/hash-comparer';

let inMemoryDelivererRepository: InMemoryDelivererRepository;
let inMemoryAdminRepository: InMemoryAdminRepository;
let fakeHasher: FakeHasher;
let sut: UpdateDelivererPassword;

describe('Update deliverer password', () => {
  beforeEach(() => {
    inMemoryDelivererRepository = new InMemoryDelivererRepository();
    inMemoryAdminRepository = new InMemoryAdminRepository();
    fakeHasher = new FakeHasher();
    sut = new UpdateDelivererPassword(
      inMemoryDelivererRepository,
      inMemoryAdminRepository,
      fakeHasher,
    );
  });

  it('should be able to update a deliverer password', async () => {
    const admin = makeAdmin();
    await inMemoryAdminRepository.create(admin);

    const deliverer = makeDeliverer();
    inMemoryDelivererRepository.create(deliverer);

    const payload = {
      delivererId: deliverer.id.toString(),
      actorId: admin.id.toString(),
      password: 'diff-password',
    };

    const result = await sut.execute(payload);

    const passwordIsEqual = await fakeHasher.compare(
      'diff-password',
      inMemoryDelivererRepository.items[0].password,
    );

    expect(result.isRight()).toEqual(true);
    expect(passwordIsEqual).toBe(true);
  });

  it('should to return an error if try to update a deliverer password with an invalid actorId', async () => {
    const deliverer = makeDeliverer();
    inMemoryDelivererRepository.create(deliverer);

    const payload = {
      delivererId: deliverer.id.toString(),
      actorId: randomUUID(),
      password: 'diff-password',
    };

    const result = await sut.execute(payload);

    expect(result.isLeft()).toEqual(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it('should to return an error if try to register a deliverer password with an existent id', async () => {
    const admin = makeAdmin();
    await inMemoryAdminRepository.create(admin);

    const payload = {
      delivererId: randomUUID(),
      actorId: admin.id.toString(),
      password: 'diff-password',
    };

    const result = await sut.execute(payload);

    expect(result.isLeft()).toEqual(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
