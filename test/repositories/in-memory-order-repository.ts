import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { OrderRepository } from '@/domain/delivery/application/repositories/order-repository';
import { Order } from '@/domain/delivery/enterprise/entities/order';

export class InMemoryOrderRepository implements OrderRepository {
  items: Order[] = [];

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
}
