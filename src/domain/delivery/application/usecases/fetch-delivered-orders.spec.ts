import { randomUUID } from 'crypto';
import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository';
import { makeAdmin } from 'test/factories/make-admin';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { FetchDeliverer } from './fetch-deliverer';
import { InMemoryDelivererRepository } from 'test/repositories/in-memory-deliverer-repository';
import { makeDeliverer } from 'test/factories/make-deliverer';
import { FetchDeliveredOrders } from './fetch-delivered-orders';
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository';
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository';
import { makeOrder } from 'test/factories/make-order';
import { Status } from '../../enterprise/entities/status';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

let inMemoryDelivererRepository: InMemoryDelivererRepository;
let inMemoryOrderRepository: InMemoryOrderRepository;
let sut: FetchDeliveredOrders;

describe('Fetch delivered order', () => {
  beforeEach(() => {
    inMemoryDelivererRepository = new InMemoryDelivererRepository();
    inMemoryOrderRepository = new InMemoryOrderRepository(
      new InMemoryRecipientRepository(),
    );
    sut = new FetchDeliveredOrders(
      inMemoryDelivererRepository,
      inMemoryOrderRepository,
    );
  });

  it('should be able to fetch all delivered orders', async () => {
    const deliverer = makeDeliverer();
    inMemoryDelivererRepository.create(deliverer);

    const delivererId = deliverer.id;

    inMemoryOrderRepository.items.push(
      makeOrder({
        delivererId,
        status: [Status.create({ situation: 'delivered' })],
      }),
      makeOrder({
        delivererId,
        status: [Status.create({ situation: 'delivered' })],
      }),
      makeOrder({ delivererId }),
      makeOrder(),
    );

    const payload = {
      delivererId: delivererId.toString(),
    };

    const result = await sut.execute(payload);

    expect(result.isRight()).toEqual(true);
    expect((result.value as any).orders).toHaveLength(2);
  });

  it('should not be able to fetch all delivered orders with an inexistent deliverer', async () => {
    const payload = {
      delivererId: randomUUID(),
    };

    const result = await sut.execute(payload);

    expect(result.isLeft()).toEqual(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
