import { Either, left, right } from '@/core/errors/either';
import { Admin } from '../../enterprise/entities/admin';
import { Document } from '../../enterprise/entities/object-values/document';
import { AdminRepository } from '../repositories/admin-repository';
import { ResourceAlreadyExistsError } from './errors/resource-already-exists-error';
import { HashGenerator } from '../cryptography/hash-generator';

interface RegisterAdminRequest {
  name: string;
  email: string;
  password: string;
  document: string;
}

type RegisterAdminResponse = Either<
  ResourceAlreadyExistsError,
  {
    admin: Admin;
  }
>;

export class RegisterAdmin {
  constructor(
    private adminRepository: AdminRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    email,
    password,
    document,
  }: RegisterAdminRequest): Promise<RegisterAdminResponse> {
    const adminAlreadyExists = await this.adminRepository.findByDocument(
      document,
    );

    if (adminAlreadyExists) {
      return left(new ResourceAlreadyExistsError());
    }

    const admin = Admin.create({
      name,
      email,
      password: await this.hashGenerator.hash(password),
      document: Document.createCPF(document),
    });

    await this.adminRepository.create(admin);

    return right({
      admin,
    });
  }
}
