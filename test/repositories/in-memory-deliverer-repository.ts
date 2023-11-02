import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { DelivererRepository } from '@/domain/delivery/application/repositories/deliverer-repository';
import { Deliverer } from '@/domain/delivery/enterprise/entities/deliverer';
import { Document } from '@/domain/delivery/enterprise/entities/object-values/document';

export class InMemoryDelivererRepository implements DelivererRepository {
  items: Deliverer[] = [];

  async create(deliverer: Deliverer): Promise<void> {
    this.items.push(deliverer);
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
}
