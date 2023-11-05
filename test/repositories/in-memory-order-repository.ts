import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { CoordinatesParams } from '@/core/repositories/coordinates-params';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { OrderRepository } from '@/domain/delivery/application/repositories/order-repository';
import { Order } from '@/domain/delivery/enterprise/entities/order';
import { InMemoryRecipientRepository } from './in-memory-recipient-repository';
import { Coordinate } from '@/domain/delivery/enterprise/entities/object-values/coordinate';

export class InMemoryOrderRepository implements OrderRepository {
  items: Order[] = [];

  constructor(private recipientRepository: InMemoryRecipientRepository) {}

  async create(order: Order): Promise<void> {
    this.items.push(order);
  }

  async save(order: Order): Promise<void> {
    const target = this.items.find((item) => item.id.equals(order.id));
    Object.assign(target, order);
  }

  async delete(id: string): Promise<void> {
    const orderIndex = this.items.findIndex((item) =>
      item.id.equals(new UniqueEntityId(id)),
    );

    if (orderIndex < 0) {
      return;
    }

    this.items.splice(orderIndex, 1);
  }

  async findAll({ page }: PaginationParams): Promise<Order[]> {
    return this.items.slice(page - 1, page * 20);
  }

  async findById(id: string): Promise<Order> {
    const order = this.items.find((item) =>
      item.id.equals(new UniqueEntityId(id)),
    );

    if (!order) {
      return null;
    }

    return order;
  }

  async findNearby(params: CoordinatesParams): Promise<Order[]> {
    const FIFTEEN_KM_IN_METERS = 1 * 1000 * 15;
    const orders = this.items
      .map((item) => {
        const recipient = this.recipientRepository.items.find((r) =>
          r.id.equals(item.id),
        );

        return {
          id: item.id,
          recipient,
        };
      })
      .filter(
        (item) =>
          item.recipient.coordinate.calculateDistanceInMeters(
            Coordinate.create(params),
          ) < FIFTEEN_KM_IN_METERS,
      );

    const formattedOrder = orders.map((item) => {
      return this.items.find((i) => i.id.equals(item.id));
    });

    return formattedOrder;
  }
}
