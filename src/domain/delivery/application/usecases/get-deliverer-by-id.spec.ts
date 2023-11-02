import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository';
import { makeAdmin } from 'test/factories/make-admin';
import { randomUUID } from 'crypto';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { InMemoryDelivererRepository } from 'test/repositories/in-memory-deliverer-repository';
import { makeDeliverer } from 'test/factories/make-deliverer';
import { GetDelivererById } from './get-deliverer-by-id';

let inMemoryDelivererRepository: InMemoryDelivererRepository;
let inMemoryAdminRepository: InMemoryAdminRepository;
let sut: GetDelivererById;

describe('Fetch deliverers', () => {
  beforeEach(() => {
    inMemoryDelivererRepository = new InMemoryDelivererRepository();
    inMemoryAdminRepository = new InMemoryAdminRepository();
    sut = new GetDelivererById(
      inMemoryDelivererRepository,
      inMemoryAdminRepository,
    );
  });

  it('should be able to get a deliverer by id', async () => {
    const admin = makeAdmin();
    await inMemoryAdminRepository.create(admin);

    const deliverer = makeDeliverer();
    inMemoryDelivererRepository.items.push(deliverer);

    const payload = {
      delivererId: deliverer.id.toString(),
      actorId: admin.id.toString(),
    };

    const result = await sut.execute(payload);

    expect(result.isRight()).toEqual(true);
  });

  it('should not be able to get a deliverer by id with invalid actorId', async () => {
    const deliverer = makeDeliverer();
    inMemoryDelivererRepository.items.push(deliverer);

    const payload = {
      delivererId: deliverer.id.toString(),
      actorId: randomUUID(),
    };

    const result = await sut.execute(payload);

    expect(result.isLeft()).toEqual(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
