import { Admin } from '../../enterprise/entities/admin';

export abstract class AdminRepository {
  abstract create(admin: Admin): Promise<void>;
  abstract findByDocument(document: string): Promise<Admin | null>;
  abstract findById(id: string): Promise<Admin | null>;
}
