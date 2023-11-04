import { Either, left, right } from '@/core/errors/either';
import { Deliverer } from '../../enterprise/entities/deliverer';
import { DelivererRepository } from '../repositories/deliverer-repository';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { AdminRepository } from '../repositories/admin-repository';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

interface DeleteDelivererRequest {
  delivererId: string;
  actorId: string;
}

type DeleteDelivererResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    deliverer: Deliverer;
  }
>;

export class DeleteDeliverer {
  constructor(
    private delivererRepository: DelivererRepository,
    private adminRepository: AdminRepository,
  ) {}

  async execute({
    delivererId,
    actorId,
  }: DeleteDelivererRequest): Promise<DeleteDelivererResponse> {
    const admin = await this.adminRepository.findById(actorId);

    if (!admin) {
      return left(new NotAllowedError());
    }

    const deliverer = await this.delivererRepository.findById(delivererId);

    if (!deliverer) {
      return left(new ResourceNotFoundError());
    }

    await this.delivererRepository.delete(delivererId);

    return right({
      deliverer,
    });
  }
}
