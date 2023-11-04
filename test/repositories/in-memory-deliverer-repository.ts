import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { DelivererRepository } from '@/domain/delivery/application/repositories/deliverer-repository';
import { Deliverer } from '@/domain/delivery/enterprise/entities/deliverer';
import { Document } from '@/domain/delivery/enterprise/entities/object-values/document';

export class InMemoryDelivererRepository implements DelivererRepository {
  items: Deliverer[] = [];

  async create(deliverer: Deliverer): Promise<void> {
    this.items.push(deliverer);
  }

  async save(deliverer: Deliverer): Promise<void> {
    const target = this.items.find((item) => item.id.equals(deliverer.id));
    Object.assign(target, deliverer);
  }

  async delete(id: string): Promise<void> {
    const delivererIndex = this.items.findIndex((item) =>
      item.id.equals(new UniqueEntityId(id)),
    );

    if (delivererIndex < 0) {
      return;
    }

    this.items.splice(delivererIndex, 1);
  }

  async findByDocument(document: string): Promise<Deliverer> {
    const deliverer = this.items.find((item) =>
      item.document.equals(Document.createCPF(document)),
    );

    if (!deliverer) {
      return null;
    }

    return deliverer;
  }

  async findById(id: string): Promise<Deliverer> {
    const deliverer = this.items.find((item) =>
      item.id.equals(new UniqueEntityId(id)),
    );

    if (!deliverer) {
      return null;
    }

    return deliverer;
  }

  async findAll({ page }: PaginationParams): Promise<Deliverer[]> {
    return this.items.slice(page - 1, page * 20);
  }
}
