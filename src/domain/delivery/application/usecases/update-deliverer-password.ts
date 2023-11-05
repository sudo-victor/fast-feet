import { Either, left, right } from '@/core/errors/either';
import { Deliverer } from '../../enterprise/entities/deliverer';
import { Document } from '../../enterprise/entities/object-values/document';
import { DelivererRepository } from '../repositories/deliverer-repository';
import { HashGenerator } from '../cryptography/hash-generator';
import { ResourceAlreadyExistsError } from '@/core/errors/resource-already-exists-error';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { AdminRepository } from '../repositories/admin-repository';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

interface UpdateDelivererPasswordRequest {
  delivererId: string;
  actorId: string;
  password: string;
}

type UpdateDelivererPasswordResponse = Either<
  ResourceAlreadyExistsError | NotAllowedError,
  {
    deliverer: Deliverer;
  }
>;

export class UpdateDelivererPassword {
  constructor(
    private delivererRepository: DelivererRepository,
    private adminRepository: AdminRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    delivererId,
    actorId,
    password,
  }: UpdateDelivererPasswordRequest): Promise<UpdateDelivererPasswordResponse> {
    const admin = await this.adminRepository.findById(actorId);

    if (!admin) {
      return left(new NotAllowedError());
    }

    const deliverer = await this.delivererRepository.findById(delivererId);

    if (!deliverer) {
      return left(new ResourceNotFoundError());
    }

    deliverer.password = await this.hashGenerator.hash(password);

    await this.delivererRepository.save(deliverer);

    return right({
      deliverer,
    });
  }
}
