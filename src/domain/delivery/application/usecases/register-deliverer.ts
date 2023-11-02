import { Either, left, right } from '@/core/errors/either';
import { Deliverer } from '../../enterprise/entities/deliverer';
import { Document } from '../../enterprise/entities/object-values/document';
import { DelivererRepository } from '../repositories/deliverer-repository';
import { HashGenerator } from '../cryptography/hash-generator';
import { ResourceAlreadyExistsError } from '@/core/errors/resource-already-exists-error';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { AdminRepository } from '../repositories/admin-repository';

interface RegisterDelivererRequest {
  name: string;
  email: string;
  password: string;
  document: string;
  actorId: string;
}

type RegisterDelivererResponse = Either<
  ResourceAlreadyExistsError | NotAllowedError,
  {
    deliverer: Deliverer;
  }
>;

export class RegisterDeliverer {
  constructor(
    private delivererRepository: DelivererRepository,
    private adminRepository: AdminRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    email,
    password,
    document,
    actorId,
  }: RegisterDelivererRequest): Promise<RegisterDelivererResponse> {
    const admin = await this.adminRepository.findById(actorId);

    if (!admin) {
      return left(new NotAllowedError());
    }

    const delivererAlreadyExists =
      await this.delivererRepository.findByDocument(document);

    if (delivererAlreadyExists) {
      return left(new ResourceAlreadyExistsError());
    }

    const deliverer = Deliverer.create({
      name,
      email,
      password: await this.hashGenerator.hash(password),
      document: Document.createCPF(document),
    });

    await this.delivererRepository.create(deliverer);

    return right({
      deliverer,
    });
  }
}
