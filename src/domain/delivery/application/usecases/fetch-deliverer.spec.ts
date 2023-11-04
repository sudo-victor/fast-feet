import { randomUUID } from 'crypto';
import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository';
import { makeAdmin } from 'test/factories/make-admin';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { FetchDeliverer } from './fetch-deliverer';
import { InMemoryDelivererRepository } from 'test/repositories/in-memory-deliverer-repository';
import { makeDeliverer } from 'test/factories/make-deliverer';

let inMemoryDelivererRepository: InMemoryDelivererRepository;
let inMemoryAdminRepository: InMemoryAdminRepository;
let sut: FetchDeliverer;

describe('Fetch deliverer', () => {
  beforeEach(() => {
    inMemoryDelivererRepository = new InMemoryDelivererRepository();
    inMemoryAdminRepository = new InMemoryAdminRepository();
    sut = new FetchDeliverer(
      inMemoryDelivererRepository,
      inMemoryAdminRepository,
    );
  });

  it('should be able to fetch all deliverer', async () => {
    const admin = makeAdmin();
    await inMemoryAdminRepository.create(admin);

    inMemoryDelivererRepository.items.push(
      makeDeliverer(),
      makeDeliverer(),
      makeDeliverer(),
    );

    const payload = {
      actorId: admin.id.toString(),
    };

    const result = await sut.execute(payload);

    expect(result.isRight()).toEqual(true);
    expect((result.value as any).deliverer).toHaveLength(3);
  });

  it('should not be able to fetch all deliverer with invalid actorId', async () => {
    const payload = {
      actorId: randomUUID(),
    };

    const result = await sut.execute(payload);

    expect(result.isLeft()).toEqual(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it('should be able to fetch all deliverer with 20 per pages', async () => {
    const admin = makeAdmin();
    await inMemoryAdminRepository.create(admin);

    for (let i = 0; i < 25; i++) {
      inMemoryDelivererRepository.items.push(makeDeliverer());
    }

    const payload = {
      actorId: admin.id.toString(),
    };

    const result = await sut.execute(payload);

    expect(result.isRight()).toEqual(true);
    expect((result.value as any).deliverer).toHaveLength(20);
  });
});
