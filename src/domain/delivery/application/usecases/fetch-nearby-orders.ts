import { Either, right } from '@/core/errors/either';
import { Order } from '../../enterprise/entities/order';
import { OrderRepository } from '../repositories/order-repository';
import { NotAllowedError } from '@/core/errors/not-allowed-error';

interface FetchNearbyOrdersRequest {
  latitude: number;
  longitude: number;
}

type FetchNearbyOrdersResponse = Either<NotAllowedError, { orders: Order[] }>;

export class FetchNearbyOrders {
  constructor(private orderRepository: OrderRepository) {}

  async execute({
    latitude,
    longitude,
  }: FetchNearbyOrdersRequest): Promise<FetchNearbyOrdersResponse> {
    const orders = await this.orderRepository.findNearby({
      latitude,
      longitude,
    });

    return right({
      orders,
    });
  }
}
