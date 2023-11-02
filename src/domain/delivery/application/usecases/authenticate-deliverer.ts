import { Either, left, right } from '@/core/errors/either';
import { DelivererRepository } from '../repositories/deliverer-repository';
import { HashComparer } from '../cryptography/hash-comparer';
import { InvalidCrendentialsError } from '@/core/errors/invalid-credentials-error';
import { ResourceAlreadyExistsError } from '@/core/errors/resource-already-exists-error';
import { Encrypter } from '../cryptography/encrypter';

interface AuthenticateDelivererRequest {
  password: string;
  document: string;
}

type AuthenticateDelivererResponse = Either<
  ResourceAlreadyExistsError,
  {
    accessToken: string;
  }
>;

export class AuthenticateDeliverer {
  constructor(
    private delivererRepository: DelivererRepository,
    private hash: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    document,
    password,
  }: AuthenticateDelivererRequest): Promise<AuthenticateDelivererResponse> {
    const deliverer = await this.delivererRepository.findByDocument(document);

    if (!deliverer) {
      return left(new InvalidCrendentialsError());
    }

    const doesPasswordIsValid = this.hash.compare(password, deliverer.password);
    if (!doesPasswordIsValid) {
      return left(new InvalidCrendentialsError());
    }

    const accessToken = await this.encrypter.generate({ sub: deliverer.id });

    return right({
      accessToken,
    });
  }
}
