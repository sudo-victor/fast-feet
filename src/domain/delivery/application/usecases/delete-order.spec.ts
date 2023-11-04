import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository';
import { makeOrder } from 'test/factories/make-order';
import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository';
import { makeAdmin } from 'test/factories/make-admin';
import { randomUUID } from 'crypto';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { DeleteOrder } from './delete-order';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

let inMemoryOrderRepository: InMemoryOrderRepository;
let inMemoryAdminRepository: InMemoryAdminRepository;
let sut: DeleteOrder;

describe('Delete order', () => {
  beforeEach(() => {
    inMemoryOrderRepository = new InMemoryOrderRepository();
    inMemoryAdminRepository = new InMemoryAdminRepository();
    sut = new DeleteOrder(inMemoryOrderRepository, inMemoryAdminRepository);
  });

  it('should be able to delete a order', async () => {
    const admin = makeAdmin();
    await inMemoryAdminRepository.create(admin);

    const order1 = makeOrder();
    const order2 = makeOrder();

    inMemoryOrderRepository.create(order1);
    inMemoryOrderRepository.create(order2);

    const payload = {
      orderId: order1.id.toString(),
      actorId: admin.id.toString(),
    };

    const result = await sut.execute(payload);

    expect(result.isRight()).toEqual(true);
    expect(inMemoryOrderRepository.items).toHaveLength(1);
    expect(inMemoryOrderRepository.items).toEqual(
      expect.arrayContaining([expect.objectContaining({ ...order2 })]),
    );
  });

  it('should to return an error if try to delete a order with an invalid actorId', async () => {
    const order1 = makeOrder();
    const order2 = makeOrder();

    inMemoryOrderRepository.create(order1);
    inMemoryOrderRepository.create(order2);

    const payload = {
      orderId: order1.id.toString(),
      actorId: randomUUID(),
    };

    const result = await sut.execute(payload);

    expect(result.isLeft()).toEqual(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it('should to return an error if try to register a order with an existent document', async () => {
    const admin = makeAdmin();
    await inMemoryAdminRepository.create(admin);

    const payload = {
      orderId: randomUUID(),
      actorId: admin.id.toString(),
    };

    const result = await sut.execute(payload);

    expect(result.isLeft()).toEqual(true);
    expect(inMemoryOrderRepository.items).toHaveLength(0);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
