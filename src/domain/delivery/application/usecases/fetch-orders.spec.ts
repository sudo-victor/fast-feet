import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository';
import { makeAdmin } from 'test/factories/make-admin';
import { randomUUID } from 'crypto';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { FetchOrders } from './fetch-orders';
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository';
import { makeOrder } from 'test/factories/make-order';

let inMemoryOrderRepository: InMemoryOrderRepository;
let inMemoryAdminRepository: InMemoryAdminRepository;
let sut: FetchOrders;

describe('Fetch orders', () => {
  beforeEach(() => {
    inMemoryOrderRepository = new InMemoryOrderRepository();
    inMemoryAdminRepository = new InMemoryAdminRepository();
    sut = new FetchOrders(inMemoryOrderRepository, inMemoryAdminRepository);
  });

  it('should be able to fetch all orders', async () => {
    const admin = makeAdmin();
    await inMemoryAdminRepository.create(admin);

    inMemoryOrderRepository.items.push(makeOrder(), makeOrder(), makeOrder());

    const payload = {
      actorId: admin.id.toString(),
    };

    const result = await sut.execute(payload);

    expect(result.isRight()).toEqual(true);
    expect((result.value as any).orders).toHaveLength(3);
  });

  it('should not be able to fetch all orders with invalid actorId', async () => {
    const payload = {
      actorId: randomUUID(),
    };

    const result = await sut.execute(payload);

    expect(result.isLeft()).toEqual(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it('should be able to fetch all orders with 20 per pages', async () => {
    const admin = makeAdmin();
    await inMemoryAdminRepository.create(admin);

    for (let i = 0; i < 25; i++) {
      inMemoryOrderRepository.items.push(makeOrder());
    }

    const payload = {
      actorId: admin.id.toString(),
    };

    const result = await sut.execute(payload);

    expect(result.isRight()).toEqual(true);
    expect((result.value as any).orders).toHaveLength(20);
  });
});
