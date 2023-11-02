import { PaginationParams } from '@/core/repositories/pagination-params';
import { Recipient } from '../../enterprise/entities/recipient';

export abstract class RecipientRepository {
  abstract create(recipient: Recipient): Promise<void>;
  abstract findAll(params: PaginationParams): Promise<Recipient[]>;
}
