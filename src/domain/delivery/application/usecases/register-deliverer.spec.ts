import { InMemoryDelivererRepository } from 'test/repositories/in-memory-deliverer-repository';
import { RegisterDeliverer } from './register-deliverer';
import { faker } from '@faker-js/faker';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import { makeDeliverer } from 'test/factories/make-deliverer';
import { Document } from '../../enterprise/entities/object-values/document';
import { ResourceAlreadyExistsError } from '@/core/errors/resource-already-exists-error';
import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository';
import { makeAdmin } from 'test/factories/make-admin';
import { randomUUID } from 'crypto';
import { NotAllowedError } from '@/core/errors/not-allowed-error';

let inMemoryDelivererRepository: InMemoryDelivererRepository;
let inMemoryAdminRepository: InMemoryAdminRepository;
let fakeHasher: FakeHasher;
let sut: RegisterDeliverer;

describe('Register deliverer', () => {
  beforeEach(() => {
    inMemoryDelivererRepository = new InMemoryDelivererRepository();
    inMemoryAdminRepository = new InMemoryAdminRepository();
    fakeHasher = new FakeHasher();
    sut = new RegisterDeliverer(
      inMemoryDelivererRepository,
      inMemoryAdminRepository,
      fakeHasher,
    );
  });

  it('should be able to register a deliverer', async () => {
    const admin = makeAdmin();
    await inMemoryAdminRepository.create(admin);

    const payload = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: '123123',
      document: '182.028.137-00',
      actorId: admin.id.toString(),
    };

    const result = await sut.execute(payload);

    expect(result.isRight()).toEqual(true);
    expect(inMemoryDelivererRepository.items).toHaveLength(1);
  });

  it('should to return an error if try to register a deliverer with an invalid actorId', async () => {
    const payload = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: '123123',
      document: '182.028.137-00',
      actorId: randomUUID(),
    };

    const result = await sut.execute(payload);

    expect(result.isLeft()).toEqual(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it('should to return an error if try to register a deliverer with an existent document', async () => {
    const admin = makeAdmin();
    await inMemoryAdminRepository.create(admin);

    inMemoryDelivererRepository.items.push(
      makeDeliverer({ document: Document.createCPF('182.028.137-00') }),
    );

    const payload = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: '123123',
      document: '182.028.137-00',
      actorId: admin.id.toString(),
    };

    const result = await sut.execute(payload);

    expect(result.isLeft()).toEqual(true);
    expect(inMemoryDelivererRepository.items).toHaveLength(1);
    expect(result.value).toBeInstanceOf(ResourceAlreadyExistsError);
  });
});
