import { PaginationParams } from '@/core/repositories/pagination-params';
import { Recipient } from '../../enterprise/entities/recipient';

export abstract class RecipientRepository {
  abstract create(recipient: Recipient): Promise<void>;
  abstract delete(id: string): Promise<void>;
  abstract save(deliverer: Recipient): Promise<void>;
  abstract findAll(params: PaginationParams): Promise<Recipient[]>;
  abstract findById(id: string): Promise<Recipient | null>;
}
