import { CreateOrder } from './create-order';
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository';
import { faker } from '@faker-js/faker';
import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository';
import { makeAdmin } from 'test/factories/make-admin';

let inMemoryOrderRepository: InMemoryOrderRepository;
let inMemoryAdminRepository: InMemoryAdminRepository;
let sut: CreateOrder;

describe('Create order', () => {
  beforeEach(() => {
    inMemoryOrderRepository = new InMemoryOrderRepository();
    inMemoryAdminRepository = new InMemoryAdminRepository();
    sut = new CreateOrder(inMemoryOrderRepository, inMemoryAdminRepository);
  });

  it('should be able to create a order', async () => {
    const admin = makeAdmin();
    await inMemoryAdminRepository.create(admin);

    const payload = {
      name: faker.person.fullName(),
      actorId: admin.id.toString(),
    };

    const result = await sut.execute(payload);

    expect(result.isRight()).toEqual(true);
    expect(inMemoryOrderRepository.items).toHaveLength(1);
    expect((inMemoryOrderRepository.items[0] as any).props.status).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ situation: 'pending' }),
      ]),
    );
  });
});
