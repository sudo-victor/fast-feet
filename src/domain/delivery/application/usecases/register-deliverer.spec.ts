import { InMemoryDelivererRepository } from 'test/repositories/in-memory-deliverer-repository';
import { RegisterDeliverer } from './register-deliverer';
import { faker } from '@faker-js/faker';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import { Deliverer } from '../../enterprise/entities/deliverer';
import { makeDeliverer } from 'test/factories/make-deliverer';
import { Document } from '../../enterprise/entities/object-values/document';

let inMemoryDelivererRepository: InMemoryDelivererRepository;
let fakeHasher: FakeHasher;
let sut: RegisterDeliverer;

describe('Register deliverer', () => {
  beforeEach(() => {
    inMemoryDelivererRepository = new InMemoryDelivererRepository();
    fakeHasher = new FakeHasher();
    sut = new RegisterDeliverer(inMemoryDelivererRepository, fakeHasher);
  });

  it('should be able to register a deliverer', async () => {
    const payload = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: '123123',
      document: '182.028.137-00',
    };

    const result = await sut.execute(payload);

    expect(result.isRight()).toEqual(true);
    expect(inMemoryDelivererRepository.items).toHaveLength(1);
  });

  it('should to return an error if try to register a deliverer with an existent document', async () => {
    inMemoryDelivererRepository.items.push(
      makeDeliverer({ document: Document.createCPF('182.028.137-00') }),
    );

    const payload = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: '123123',
      document: '182.028.137-00',
    };

    const result = await sut.execute(payload);

    expect(result.isLeft()).toEqual(true);
    expect(inMemoryDelivererRepository.items).toHaveLength(1);
  });
});
