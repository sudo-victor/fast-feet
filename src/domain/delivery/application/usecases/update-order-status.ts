import { Either, left, right } from '@/core/errors/either';
import { Order } from '../../enterprise/entities/order';
import { OrderRepository } from '../repositories/order-repository';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import {
  Status,
  StatusSituationOptions,
} from '../../enterprise/entities/status';
import { DelivererRepository } from '../repositories/deliverer-repository';

interface UpdateOrderStatusRequest {
  orderId: string;
  delivererId: string;
  status: StatusSituationOptions;
}

type UpdateOrderStatusResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    order: Order;
  }
>;

export class UpdateOrderStatus {
  constructor(
    private orderRepository: OrderRepository,
    private delivererRepository: DelivererRepository,
  ) {}

  async execute({
    orderId,
    delivererId,
    status,
  }: UpdateOrderStatusRequest): Promise<UpdateOrderStatusResponse> {
    const deliverer = await this.delivererRepository.findById(delivererId);

    if (!deliverer) {
      return left(new ResourceNotFoundError());
    }

    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      return left(new ResourceNotFoundError());
    }

    if (order.delivererId && !order.delivererId.equals(deliverer.id)) {
      return left(new NotAllowedError());
    }

    const newStatus = Status.create({ situation: status });

    const orderMerged = order.merge<Order>({
      status: [...order.status, newStatus],
    });

    await this.orderRepository.save(orderMerged);

    return right({
      order: orderMerged,
    });
  }
}
