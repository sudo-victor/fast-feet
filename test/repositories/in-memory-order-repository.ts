import { PaginationParams } from '@/core/repositories/pagination-params';
import { OrderRepository } from '@/domain/delivery/application/repositories/order-repository';
import { Order } from '@/domain/delivery/enterprise/entities/order';

export class InMemoryOrderRepository implements OrderRepository {
  items: Order[] = [];

  async create(order: Order): Promise<void> {
    this.items.push(order);
  }

  async findAll({ page }: PaginationParams): Promise<Order[]> {
    return this.items.slice(page - 1, page * 20);
  }
}
