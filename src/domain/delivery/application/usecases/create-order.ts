import { Either, left, right } from '@/core/errors/either';
import { Order } from '../../enterprise/entities/order';
import { OrderRepository } from '../repositories/order-repository';
import { Status } from '../../enterprise/entities/status';
import { AdminRepository } from '../repositories/admin-repository';
import { NotAllowedError } from '@/core/errors/not-allowed-error';

interface CreateOrderRequest {
  name: string;
  actorId: string;
}

type CreateOrderResponse = Either<NotAllowedError, { order: Order }>;

export class CreateOrder {
  constructor(
    private orderRepository: OrderRepository,
    private adminRepository: AdminRepository,
  ) {}

  async execute({
    name,
    actorId,
  }: CreateOrderRequest): Promise<CreateOrderResponse> {
    const admin = await this.adminRepository.findById(actorId);

    if (!admin) {
      return left(new NotAllowedError());
    }

    const status = Status.create({ situation: 'pending' });

    const order = Order.create({
      name,
      status: [status],
    });

    await this.orderRepository.create(order);

    return right({ order });
  }
}
