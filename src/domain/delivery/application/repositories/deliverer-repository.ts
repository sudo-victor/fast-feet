import { Deliverer } from '../../enterprise/entities/deliverer';

export abstract class DelivererRepository {
  abstract create(deliverer: Deliverer): Promise<void>;
  abstract findByDocument(document: string): Promise<Deliverer | null>;
}
