import { Either, left, right } from '@/core/errors/either';
import { Order } from '../../enterprise/entities/order';
import { OrderRepository } from '../repositories/order-repository';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { AdminRepository } from '../repositories/admin-repository';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

interface GetOrderByIdRequest {
  orderId: string;
  actorId: string;
}

type GetOrderByIdResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    order: Order;
  }
>;

export class GetOrderById {
  constructor(
    private orderRepository: OrderRepository,
    private adminRepository: AdminRepository,
  ) {}

  async execute({
    orderId,
    actorId,
  }: GetOrderByIdRequest): Promise<GetOrderByIdResponse> {
    const admin = await this.adminRepository.findById(actorId);

    if (!admin) {
      return left(new NotAllowedError());
    }

    const order = await this.orderRepository.findById(orderId);

    return right({
      order,
    });
  }
}
