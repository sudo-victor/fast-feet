import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { PaginationParams } from '@/core/repositories/pagination-params';
import { RecipientRepository } from '@/domain/delivery/application/repositories/recipient-repository';
import { Recipient } from '@/domain/delivery/enterprise/entities/recipient';

export class InMemoryRecipientRepository implements RecipientRepository {
  items: Recipient[] = [];

  async create(recipient: Recipient): Promise<void> {
    this.items.push(recipient);
  }

  async findAll({ page }: PaginationParams): Promise<Recipient[]> {
    return this.items.slice(page - 1, page * 20);
  }

  async findById(id: string): Promise<Recipient> {
    const recipient = this.items.find((item) =>
      item.id.equals(new UniqueEntityId(id)),
    );

    if (!recipient) {
      return null;
    }

    return recipient;
  }

  async delete(id: string): Promise<void> {
    const recipientIndex = this.items.findIndex((item) =>
      item.id.equals(new UniqueEntityId(id)),
    );

    if (recipientIndex < 0) {
      return;
    }

    this.items.splice(recipientIndex, 1);
  }
}
