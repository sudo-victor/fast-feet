import { Either, left, right } from '@/core/errors/either';
import { AdminRepository } from '../repositories/admin-repository';
import { HashComparer } from '../cryptography/hash-comparer';
import { InvalidCrendentialsError } from '@/core/errors/invalid-credentials-error';
import { ResourceAlreadyExistsError } from '@/core/errors/resource-already-exists-error';
import { Encrypter } from '../cryptography/encrypter';

interface AuthenticateAdminRequest {
  password: string;
  document: string;
}

type AuthenticateAdminResponse = Either<
  ResourceAlreadyExistsError,
  {
    accessToken: string;
  }
>;

export class AuthenticateAdmin {
  constructor(
    private adminRepository: AdminRepository,
    private hash: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    document,
    password,
  }: AuthenticateAdminRequest): Promise<AuthenticateAdminResponse> {
    const admin = await this.adminRepository.findByDocument(document);

    if (!admin) {
      return left(new InvalidCrendentialsError());
    }

    const doesPasswordIsValid = await this.hash.compare(
      password,
      admin.password,
    );
    if (!doesPasswordIsValid) {
      return left(new InvalidCrendentialsError());
    }

    const accessToken = await this.encrypter.generate({ sub: admin.id });

    return right({
      accessToken,
    });
  }
}
