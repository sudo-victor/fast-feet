import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository';
import { UpdateOrderStatus } from './update-order-status';
import { InMemoryDelivererRepository } from 'test/repositories/in-memory-deliverer-repository';
import { makeDeliverer } from 'test/factories/make-deliverer';
import { makeOrder } from 'test/factories/make-order';
import {
  Status,
  StatusSituationOptions,
} from '../../enterprise/entities/status';
import { randomUUID } from 'crypto';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/not-allowed-error';

let orderRepository: InMemoryOrderRepository;
let delivererRepository: InMemoryDelivererRepository;
let sut: UpdateOrderStatus;

describe('Update order status', () => {
  beforeEach(() => {
    orderRepository = new InMemoryOrderRepository();
    delivererRepository = new InMemoryDelivererRepository();
    sut = new UpdateOrderStatus(orderRepository, delivererRepository);
  });

  it('should be able to update order status', async () => {
    const deliverer = makeDeliverer();
    delivererRepository.create(deliverer);

    const order = makeOrder({
      status: [Status.create({ situation: 'pending' })],
    });
    orderRepository.create(order);

    const status = 'collected' as StatusSituationOptions;

    const payload = {
      delivererId: deliverer.id.toString(),
      orderId: order.id.toString(),
      status,
    };

    const result = await sut.execute(payload);

    expect(result.isRight()).toBe(true);
    expect((result.value as any).order.status).toHaveLength(2);
  });

  it('should not be able to update an order status with an inexistent deliverer', async () => {
    const order = makeOrder({
      status: [Status.create({ situation: 'pending' })],
    });
    orderRepository.create(order);

    const status = 'collected' as StatusSituationOptions;

    const payload = {
      delivererId: randomUUID(),
      orderId: order.id.toString(),
      status,
    };

    const result = await sut.execute(payload);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    expect(orderRepository.items[0].status).toHaveLength(1);
  });

  it('should not be able to update an order status with an inexistent order', async () => {
    const deliverer = makeDeliverer();
    delivererRepository.create(deliverer);

    const status = 'collected' as StatusSituationOptions;

    const payload = {
      delivererId: deliverer.id.toString(),
      orderId: randomUUID(),
      status,
    };

    const result = await sut.execute(payload);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to update an order status with a different deliverer', async () => {
    const deliverer1 = makeDeliverer();
    const deliverer2 = makeDeliverer();
    delivererRepository.create(deliverer1);
    delivererRepository.create(deliverer2);

    const order = makeOrder({
      status: [Status.create({ situation: 'pending' })],
      delivererId: deliverer1.id,
    });
    orderRepository.create(order);

    const status = 'collected' as StatusSituationOptions;

    const payload = {
      delivererId: deliverer2.id.toString(),
      orderId: order.id.toString(),
      status,
    };

    const result = await sut.execute(payload);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
