import { PaginationParams } from '@/core/repositories/pagination-params';
import { Order } from '../../enterprise/entities/order';

export abstract class OrderRepository {
  abstract create(order: Order): Promise<void>;
  abstract findAll(params: PaginationParams): Promise<Order[]>;
}
