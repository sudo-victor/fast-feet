import { Either, left, right } from '@/core/errors/either';
import { Deliverer } from '../../enterprise/entities/deliverer';
import { DelivererRepository } from '../repositories/deliverer-repository';
import { AdminRepository } from '../repositories/admin-repository';
import { NotAllowedError } from '@/core/errors/not-allowed-error';

interface FetchDelivererRequest {
  actorId: string;
  page?: number;
}

type FetchDelivererResponse = Either<
  NotAllowedError,
  { deliverer: Deliverer[] }
>;

export class FetchDeliverer {
  constructor(
    private delivererRepository: DelivererRepository,
    private adminRepository: AdminRepository,
  ) {}

  async execute({
    actorId,
    page = 1,
  }: FetchDelivererRequest): Promise<FetchDelivererResponse> {
    const admin = await this.adminRepository.findById(actorId);

    if (!admin) {
      return left(new NotAllowedError());
    }

    const deliverer = await this.delivererRepository.findAll({ page });

    return right({ deliverer });
  }
}
