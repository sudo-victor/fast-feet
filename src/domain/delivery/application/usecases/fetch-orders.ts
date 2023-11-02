import { Either, left, right } from '@/core/errors/either';
import { Order } from '../../enterprise/entities/order';
import { OrderRepository } from '../repositories/order-repository';
import { AdminRepository } from '../repositories/admin-repository';
import { NotAllowedError } from '@/core/errors/not-allowed-error';

interface FetchOrdersRequest {
  actorId: string;
  page?: number;
}

type FetchOrdersResponse = Either<NotAllowedError, { orders: Order[] }>;

export class FetchOrders {
  constructor(
    private orderRepository: OrderRepository,
    private adminRepository: AdminRepository,
  ) {}

  async execute({
    actorId,
    page = 1,
  }: FetchOrdersRequest): Promise<FetchOrdersResponse> {
    const admin = await this.adminRepository.findById(actorId);

    if (!admin) {
      return left(new NotAllowedError());
    }

    const orders = await this.orderRepository.findAll({ page });

    return right({ orders });
  }
}
