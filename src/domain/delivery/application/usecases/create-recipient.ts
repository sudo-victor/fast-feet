import { Either, right } from '@/core/errors/either';
import { HashGenerator } from '../cryptography/hash-generator';
import { Recipient } from '../../enterprise/entities/recipient';
import { Coordinate } from '../../enterprise/entities/object-values/coordinate';
import { RecipientRepository } from '../repositories/recipient-repository';

interface CreateRecipientRequest {
  name: string;
  longitude: number;
  latitude: number;
}

type CreateRecipientResponse = Either<null, { recipient: Recipient }>;

export class CreateRecipient {
  constructor(private recipientRepository: RecipientRepository) {}

  async execute({
    name,
    longitude,
    latitude,
  }: CreateRecipientRequest): Promise<CreateRecipientResponse> {
    const recipient = Recipient.create({
      name,
      coordinate: Coordinate.create({ longitude, latitude }),
    });

    await this.recipientRepository.create(recipient);

    return right({ recipient });
  }
}
