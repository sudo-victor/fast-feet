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
    const THIRTY_KM = 30;
    const orders = this.items
      .map((item) => {
        const recipient = this.recipientRepository.items.find((r) =>
          r.id.equals(item.recipientId),
        );

        return {
          id: item.id,
          recipient,
        };
      })
      .filter((item) => {
        const dist = item.recipient.coordinate.calculateDistanceInKM(
          Coordinate.create(params),
        );

        return dist <= THIRTY_KM;
      });

    const formattedOrder = orders.map((item) => {
      return this.items.find((i) => i.id.equals(item.id));
    });

    return formattedOrder;
  }

  async findAllDeliveredByDelivererId(
    id: string,
    { page }: PaginationParams,
  ): Promise<Order[]> {
    const orders = this.items
      .filter(
        (item) =>
          item.currentStatus?.situation === 'delivered' &&
          item.delivererId.equals(new UniqueEntityId(id)),
      )
      .slice(page - 1, page * 20);

    return orders;
  }
}
