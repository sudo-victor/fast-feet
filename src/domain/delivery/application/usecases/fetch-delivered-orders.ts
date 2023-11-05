import { Either, left, right } from '@/core/errors/either';
import { Order } from '../../enterprise/entities/order';
import { DelivererRepository } from '../repositories/deliverer-repository';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { OrderRepository } from '../repositories/order-repository';

interface FetchDeliveredOrdersRequest {
  delivererId: string;
  page?: number;
}

type FetchDeliveredOrdersResponse = Either<
  ResourceNotFoundError,
  { orders: Order[] }
>;

export class FetchDeliveredOrders {
  constructor(
    private delivererRepository: DelivererRepository,
    private orderRepository: OrderRepository,
  ) {}

  async execute({
    delivererId,
    page = 1,
  }: FetchDeliveredOrdersRequest): Promise<FetchDeliveredOrdersResponse> {
    const deliverer = await this.delivererRepository.findById(delivererId);

    if (!deliverer) {
      return left(new ResourceNotFoundError());
    }

    const orders = await this.orderRepository.findAllDeliveredByDelivererId(
      delivererId,
      {
        page,
      },
    );

    return right({ orders });
  }
}
