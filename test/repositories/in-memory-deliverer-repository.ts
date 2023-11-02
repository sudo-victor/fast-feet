import { DelivererRepository } from '@/domain/delivery/application/repositories/deliverer-repository';
import { Deliverer } from '@/domain/delivery/enterprise/entities/deliverer';

export class InMemoryDelivererRepository implements DelivererRepository {
  items: Deliverer[] = [];

  async create(deliverer: Deliverer): Promise<void> {
    this.items.push(deliverer);
  }

  async findByDocument(document: string): Promise<Deliverer> {
    const deliverer = this.items.find((item) => item.document.equals(document));

    if (!deliverer) {
      return null;
    }

    return deliverer;
  }
}
