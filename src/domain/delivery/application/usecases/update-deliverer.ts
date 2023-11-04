import { Either, left, right } from '@/core/errors/either';
import { Deliverer, DelivererProps } from '../../enterprise/entities/deliverer';
import { Document } from '../../enterprise/entities/object-values/document';
import { DelivererRepository } from '../repositories/deliverer-repository';
import { HashGenerator } from '../cryptography/hash-generator';
import { ResourceAlreadyExistsError } from '@/core/errors/resource-already-exists-error';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { AdminRepository } from '../repositories/admin-repository';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

interface UpdateDelivererRequest {
  id: string;
  source: Partial<DelivererProps> & { actorId: string };
}

type UpdateDelivererResponse = Either<
  ResourceAlreadyExistsError | NotAllowedError,
  {
    deliverer: Deliverer;
  }
>;

export class UpdateDeliverer {
  constructor(
    private delivererRepository: DelivererRepository,
    private adminRepository: AdminRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    id,
    source: { name, email, password, document, actorId },
  }: UpdateDelivererRequest): Promise<UpdateDelivererResponse> {
    const admin = await this.adminRepository.findById(actorId);

    if (!admin) {
      return left(new NotAllowedError());
    }

    const deliverer = await this.delivererRepository.findById(id);

    if (!deliverer) {
      return left(new ResourceNotFoundError());
    }

    const delivererMerged = deliverer.merge<Deliverer>({
      name,
      email,
      document:
        typeof document === 'string' ? Document.createCPF(document) : undefined,
      password: password ? await this.hashGenerator.hash(password) : undefined,
    });

    await this.delivererRepository.save(delivererMerged);

    return right({
      deliverer: delivererMerged,
    });
  }
}
