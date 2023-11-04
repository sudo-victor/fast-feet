import { InMemoryDelivererRepository } from 'test/repositories/in-memory-deliverer-repository';
import { makeDeliverer } from 'test/factories/make-deliverer';
import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository';
import { makeAdmin } from 'test/factories/make-admin';
import { randomUUID } from 'crypto';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { DeleteDeliverer } from './delete-deliverer';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

let inMemoryDelivererRepository: InMemoryDelivererRepository;
let inMemoryAdminRepository: InMemoryAdminRepository;
let sut: DeleteDeliverer;

describe('Delete deliverer', () => {
  beforeEach(() => {
    inMemoryDelivererRepository = new InMemoryDelivererRepository();
    inMemoryAdminRepository = new InMemoryAdminRepository();
    sut = new DeleteDeliverer(
      inMemoryDelivererRepository,
      inMemoryAdminRepository,
    );
  });

  it('should be able to delete a deliverer', async () => {
    const admin = makeAdmin();
    await inMemoryAdminRepository.create(admin);

    const deliverer1 = makeDeliverer();
    const deliverer2 = makeDeliverer();

    inMemoryDelivererRepository.create(deliverer1);
    inMemoryDelivererRepository.create(deliverer2);

    const payload = {
      delivererId: deliverer1.id.toString(),
      actorId: admin.id.toString(),
    };

    const result = await sut.execute(payload);

    expect(result.isRight()).toEqual(true);
    expect(inMemoryDelivererRepository.items).toHaveLength(1);
    expect(inMemoryDelivererRepository.items).toEqual(
      expect.arrayContaining([expect.objectContaining({ ...deliverer2 })]),
    );
  });

  it('should to return an error if try to delete a deliverer with an invalid actorId', async () => {
    const deliverer1 = makeDeliverer();
    const deliverer2 = makeDeliverer();

    inMemoryDelivererRepository.create(deliverer1);
    inMemoryDelivererRepository.create(deliverer2);

    const payload = {
      delivererId: deliverer1.id.toString(),
      actorId: randomUUID(),
    };

    const result = await sut.execute(payload);

    expect(result.isLeft()).toEqual(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it('should to return an error if try to register a deliverer with an existent document', async () => {
    const admin = makeAdmin();
    await inMemoryAdminRepository.create(admin);

    const payload = {
      delivererId: randomUUID(),
      actorId: admin.id.toString(),
    };

    const result = await sut.execute(payload);

    expect(result.isLeft()).toEqual(true);
    expect(inMemoryDelivererRepository.items).toHaveLength(0);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
