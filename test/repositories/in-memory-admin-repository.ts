import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { AdminRepository } from '@/domain/delivery/application/repositories/admin-repository';
import { Admin } from '@/domain/delivery/enterprise/entities/admin';
import { Document } from '@/domain/delivery/enterprise/entities/object-values/document';

export class InMemoryAdminRepository implements AdminRepository {
  items: Admin[] = [];

  async create(admin: Admin): Promise<void> {
    this.items.push(admin);
  }

  async findByDocument(document: string): Promise<Admin> {
    const admin = this.items.find((item) =>
      item.document.equals(Document.createCPF(document)),
    );

    if (!admin) {
      return null;
    }

    return admin;
  }

  async findById(id: string): Promise<Admin> {
    const admin = this.items.find((item) =>
      item.id.equals(new UniqueEntityId(id)),
    );

    if (!admin) {
      return null;
    }

    return admin;
  }
}
