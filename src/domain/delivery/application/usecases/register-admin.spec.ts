import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository';
import { RegisterAdmin } from './register-admin';
import { faker } from '@faker-js/faker';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import { makeAdmin } from 'test/factories/make-admin';
import { Document } from '../../enterprise/entities/object-values/document';

let inMemoryAdminRepository: InMemoryAdminRepository;
let fakeHasher: FakeHasher;
let sut: RegisterAdmin;

describe('Register admin', () => {
  beforeEach(() => {
    inMemoryAdminRepository = new InMemoryAdminRepository();
    fakeHasher = new FakeHasher();
    sut = new RegisterAdmin(inMemoryAdminRepository, fakeHasher);
  });

  it('should be able to register a admin', async () => {
    const payload = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: '123123',
      document: '182.028.137-00',
    };

    const result = await sut.execute(payload);

    expect(result.isRight()).toEqual(true);
    expect(inMemoryAdminRepository.items).toHaveLength(1);
  });

  it('should to return an error if try to register a admin with an existent document', async () => {
    inMemoryAdminRepository.items.push(
      makeAdmin({ document: Document.createCPF('182.028.137-00') }),
    );

    const payload = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: '123123',
      document: '182.028.137-00',
    };

    const result = await sut.execute(payload);

    expect(result.isLeft()).toEqual(true);
    expect(inMemoryAdminRepository.items).toHaveLength(1);
  });
});
