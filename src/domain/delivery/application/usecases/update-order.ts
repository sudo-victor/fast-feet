import { Either, left, right } from '@/core/errors/either';
import { Order, OrderProps } from '../../enterprise/entities/order';
import { OrderRepository } from '../repositories/order-repository';
import { ResourceAlreadyExistsError } from '@/core/errors/resource-already-exists-error';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { AdminRepository } from '../repositories/admin-repository';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

interface UpdateOrderRequest {
  id: string;
  actorId: string;
  source: Omit<Partial<OrderProps>, 'createdAt' | 'updatedAt'>;
}

type UpdateOrderResponse = Either<
  ResourceAlreadyExistsError | NotAllowedError,
  {
    order: Order;
  }
>;

export class UpdateOrder {
  constructor(
    private orderRepository: OrderRepository,
    private adminRepository: AdminRepository,
  ) {}

  async execute({
    id,
    actorId,
    source: { name },
  }: UpdateOrderRequest): Promise<UpdateOrderResponse> {
    const admin = await this.adminRepository.findById(actorId);

    if (!admin) {
      return left(new NotAllowedError());
    }

    const order = await this.orderRepository.findById(id);

    if (!order) {
      return left(new ResourceNotFoundError());
    }

    const orderMerged = order.merge<Order>({ name });

    await this.orderRepository.save(orderMerged);

    return right({
      order: orderMerged,
    });
  }
}
