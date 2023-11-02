import { InMemoryDelivererRepository } from 'test/repositories/in-memory-deliverer-repository';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import { makeDeliverer } from 'test/factories/make-deliverer';
import { Document } from '../../enterprise/entities/object-values/document';
import { AuthenticateDeliverer } from './authenticate-deliverer';
import { FakeEncrypter } from 'test/cryptography/fake-encrypter';
import { InvalidCrendentialsError } from '@/core/errors/invalid-credentials-error';

let inMemoryDelivererRepository: InMemoryDelivererRepository;
let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;
let sut: AuthenticateDeliverer;

describe('Authenticate deliverer', () => {
  beforeEach(() => {
    inMemoryDelivererRepository = new InMemoryDelivererRepository();
    fakeHasher = new FakeHasher();
    fakeEncrypter = new FakeEncrypter();
    sut = new AuthenticateDeliverer(
      inMemoryDelivererRepository,
      fakeHasher,
      fakeEncrypter,
    );
  });

  it('should be able to authenticate a deliverer', async () => {
    inMemoryDelivererRepository.create(
      makeDeliverer({
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
    expect(inMemoryDelivererRepository.items).toHaveLength(1);
  });

  it('should to return an error if try to authenticate with invalid document', async () => {
    inMemoryDelivererRepository.create(
      makeDeliverer({
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

  it.todo(
    'should to return an error if try to authenticate with invalid password',
    async () => {
      inMemoryDelivererRepository.create(
        makeDeliverer({
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
    },
  );
});
