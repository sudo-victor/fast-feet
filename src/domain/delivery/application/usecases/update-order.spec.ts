import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository';
import { faker } from '@faker-js/faker';
import { makeOrder } from 'test/factories/make-order';
import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository';
import { makeAdmin } from 'test/factories/make-admin';
import { randomUUID } from 'crypto';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { UpdateOrder } from './update-order';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

let inMemoryOrderRepository: InMemoryOrderRepository;
let inMemoryAdminRepository: InMemoryAdminRepository;
let sut: UpdateOrder;

describe('Update order', () => {
  beforeEach(() => {
    inMemoryOrderRepository = new InMemoryOrderRepository();
    inMemoryAdminRepository = new InMemoryAdminRepository();
    sut = new UpdateOrder(inMemoryOrderRepository, inMemoryAdminRepository);
  });

  it('should be able to update a order', async () => {
    const admin = makeAdmin();
    await inMemoryAdminRepository.create(admin);

    const order = makeOrder();
    inMemoryOrderRepository.create(order);

    const payload = {
      id: order.id.toString(),
      actorId: admin.id.toString(),
      source: {
        name: 'New Order Name',
      },
    };

    const result = await sut.execute(payload);

    expect(result.isRight()).toEqual(true);
    expect((inMemoryOrderRepository.items[0] as any).props).toEqual(
      expect.objectContaining({
        name: 'New Order Name',
      }),
    );
  });

  it('should to return an error if try to update a order with an invalid actorId', async () => {
    const order = makeOrder();
    inMemoryOrderRepository.create(order);

    const payload = {
      id: order.id.toString(),
      actorId: randomUUID(),
      source: {
        name: 'New Order Name',
      },
    };

    const result = await sut.execute(payload);

    expect(result.isLeft()).toEqual(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it('should to return an error if try to update a order with an existent id', async () => {
    const admin = makeAdmin();
    await inMemoryAdminRepository.create(admin);

    const order = makeOrder();
    inMemoryOrderRepository.create(order);

    const payload = {
      id: randomUUID(),
      actorId: admin.id.toString(),
      source: {
        name: 'New Order Name',
      },
    };

    const result = await sut.execute(payload);

    expect(result.isLeft()).toEqual(true);
    expect(inMemoryOrderRepository.items).toHaveLength(1);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
