import { makeRecipient } from 'test/factories/make-recipient';
import { FetchNearbyOrders } from './fetch-nearby-orders';
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository';
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository';
import { Coordinate } from '../../enterprise/entities/object-values/coordinate';
import { makeOrder } from 'test/factories/make-order';

let inMemoryRecipientRepository: InMemoryRecipientRepository;
let inMemoryOrderRepository: InMemoryOrderRepository;
let sut: FetchNearbyOrders;

describe('Fetch nearby orders', () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository();
    inMemoryOrderRepository = new InMemoryOrderRepository(
      inMemoryRecipientRepository,
    );
    sut = new FetchNearbyOrders(inMemoryOrderRepository);
  });

  it('should be able to fetch all nearby orders', async () => {
    const closeRecipient1 = makeRecipient({
      coordinate: Coordinate.create({
        latitude: -22.965712,
        longitude: -43.410167,
      }),
    });
    const closeRecipient2 = makeRecipient({
      coordinate: Coordinate.create({
        latitude: -22.966725,
        longitude: -43.412165,
      }),
    });
    const farRecipient = makeRecipient({
      coordinate: Coordinate.create({
        latitude: 22.968367,
        longitude: -43.413437,
      }),
    });

    inMemoryRecipientRepository.items.push(
      closeRecipient1,
      closeRecipient2,
      farRecipient,
    );

    inMemoryOrderRepository.items.push(
      makeOrder({ recipientId: closeRecipient1.id }),
      makeOrder({ recipientId: closeRecipient2.id }),
      makeOrder({ recipientId: farRecipient.id }),
    );

    const payload = {
      latitude: -22.964965,
      longitude: -43.41253,
    };

    const result = await sut.execute(payload);

    expect(result.isRight()).toBe(true);
    expect((result.value as any).orders).toHaveLength(2);
  });
});
