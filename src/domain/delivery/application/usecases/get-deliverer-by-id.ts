import { Either, left, right } from '@/core/errors/either';
import { Deliverer } from '../../enterprise/entities/deliverer';
import { DelivererRepository } from '../repositories/deliverer-repository';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { AdminRepository } from '../repositories/admin-repository';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

interface GetDelivererByIdRequest {
  delivererId: string;
  actorId: string;
}

type GetDelivererByIdResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    deliverer: Deliverer;
  }
>;

export class GetDelivererById {
  constructor(
    private delivererRepository: DelivererRepository,
    private adminRepository: AdminRepository,
  ) {}

  async execute({
    delivererId,
    actorId,
  }: GetDelivererByIdRequest): Promise<GetDelivererByIdResponse> {
    const admin = await this.adminRepository.findById(actorId);

    if (!admin) {
      return left(new NotAllowedError());
    }

    const deliverer = await this.delivererRepository.findById(delivererId);

    return right({
      deliverer,
    });
  }
}
