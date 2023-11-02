import { RecipientRepository } from '@/domain/delivery/application/repositories/recipient-repository';
import { Recipient } from '@/domain/delivery/enterprise/entities/recipient';

export class InMemoryRecipientRepository implements RecipientRepository {
  items: Recipient[] = [];

  async create(recipient: Recipient): Promise<void> {
    this.items.push(recipient);
  }
}
