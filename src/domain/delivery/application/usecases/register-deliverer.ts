import { Either, left, right } from '@/core/errors/either';
import { Deliverer } from '../../enterprise/entities/deliverer';
import { Document } from '../../enterprise/entities/object-values/document';
import { DelivererRepository } from '../repositories/deliverer-repository';
import { HashGenerator } from '../cryptography/hash-generator';
import { ResourceAlreadyExistsError } from '@/core/errors/resource-already-exists-error';

interface RegisterDelivererRequest {
  name: string;
  email: string;
  password: string;
  document: string;
}

type RegisterDelivererResponse = Either<
  ResourceAlreadyExistsError,
  {
    deliverer: Deliverer;
  }
>;

export class RegisterDeliverer {
  constructor(
    private delivererRepository: DelivererRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    email,
    password,
    document,
  }: RegisterDelivererRequest): Promise<RegisterDelivererResponse> {
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
