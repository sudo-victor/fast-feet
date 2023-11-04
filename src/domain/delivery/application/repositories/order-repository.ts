import { PaginationParams } from '@/core/repositories/pagination-params';
import { Order } from '../../enterprise/entities/order';

export abstract class OrderRepository {
  abstract create(order: Order): Promise<void>;
  abstract save(deliverer: Order): Promise<void>;
  abstract delete(id: string): Promise<void>;
  abstract findAll(params: PaginationParams): Promise<Order[]>;
  abstract findById(id: string): Promise<Order | null>;
}
