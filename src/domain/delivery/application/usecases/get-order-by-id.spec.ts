import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository';
import { makeAdmin } from 'test/factories/make-admin';
import { randomUUID } from 'crypto';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository';
import { makeOrder } from 'test/factories/make-order';
import { GetOrderById } from './get-order-by-id';

let inMemoryOrderRepository: InMemoryOrderRepository;
let inMemoryAdminRepository: InMemoryAdminRepository;
let sut: GetOrderById;

describe('Fetch orders', () => {
  beforeEach(() => {
    inMemoryOrderRepository = new InMemoryOrderRepository();
    inMemoryAdminRepository = new InMemoryAdminRepository();
    sut = new GetOrderById(inMemoryOrderRepository, inMemoryAdminRepository);
  });

  it('should be able to get a order by id', async () => {
    const admin = makeAdmin();
    await inMemoryAdminRepository.create(admin);

    const order = makeOrder();
    inMemoryOrderRepository.items.push(order);

    const payload = {
      orderId: order.id.toString(),
      actorId: admin.id.toString(),
    };

    const result = await sut.execute(payload);

    expect(result.isRight()).toEqual(true);
  });

  it('should not be able to get a order by id with invalid actorId', async () => {
    const order = makeOrder();
    inMemoryOrderRepository.items.push(order);

    const payload = {
      orderId: order.id.toString(),
      actorId: randomUUID(),
    };

    const result = await sut.execute(payload);

    expect(result.isLeft()).toEqual(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
