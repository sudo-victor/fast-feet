import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import { makeAdmin } from 'test/factories/make-admin';
import { Document } from '../../enterprise/entities/object-values/document';
import { AuthenticateAdmin } from './authenticate-admin';
import { FakeEncrypter } from 'test/cryptography/fake-encrypter';
import { InvalidCrendentialsError } from '@/core/errors/invalid-credentials-error';

let inMemoryAdminRepository: InMemoryAdminRepository;
let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;
let sut: AuthenticateAdmin;

describe('Authenticate admin', () => {
  beforeEach(() => {
    inMemoryAdminRepository = new InMemoryAdminRepository();
    fakeHasher = new FakeHasher();
    fakeEncrypter = new FakeEncrypter();
    sut = new AuthenticateAdmin(
      inMemoryAdminRepository,
      fakeHasher,
      fakeEncrypter,
    );
  });

  it('should be able to authenticate a admin', async () => {
    inMemoryAdminRepository.create(
      makeAdmin({
        password: '123123',
        document: Document.createCPF('182.028.137-00'),
      }),
    );

    const payload = {
      password: '123123',
      document: '182.028.137-00',
    };

    const result = await sut.execute(payload);

    expect(result.isRight()).toEqual(true);
    expect(inMemoryAdminRepository.items).toHaveLength(1);
  });

  it('should to return an error if try to authenticate with invalid document', async () => {
    inMemoryAdminRepository.create(
      makeAdmin({
        password: '123123',
        document: Document.createCPF('806.986.560-16'),
      }),
    );

    const payload = {
      password: '123123',
      document: '182.028.137-00',
    };

    const result = await sut.execute(payload);

    expect(result.isLeft()).toEqual(true);
    expect(result.value).toBeInstanceOf(InvalidCrendentialsError);
  });

  it('should to return an error if try to authenticate with invalid password', async () => {
    inMemoryAdminRepository.create(
      makeAdmin({
        password: '123123',
        document: Document.createCPF('182.028.137-00'),
      }),
    );

    const payload = {
      password: 'diff-password',
      document: '182.028.137-00',
    };

    const result = await sut.execute(payload);

    expect(result.isLeft()).toEqual(true);
    expect(result.value).toBeInstanceOf(InvalidCrendentialsError);
  });
});
