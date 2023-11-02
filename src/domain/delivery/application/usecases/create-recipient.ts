import { Either, left, right } from '@/core/errors/either';
import { Recipient } from '../../enterprise/entities/recipient';
import { Coordinate } from '../../enterprise/entities/object-values/coordinate';
import { RecipientRepository } from '../repositories/recipient-repository';
import { AdminRepository } from '../repositories/admin-repository';
import { NotAllowedError } from '@/core/errors/not-allowed-error';

interface CreateRecipientRequest {
  name: string;
  longitude: number;
  latitude: number;
  actorId: string;
}

type CreateRecipientResponse = Either<
  NotAllowedError,
  { recipient: Recipient }
>;

export class CreateRecipient {
  constructor(
    private recipientRepository: RecipientRepository,
    private adminRepository: AdminRepository,
  ) {}

  async execute({
    name,
    longitude,
    latitude,
    actorId,
  }: CreateRecipientRequest): Promise<CreateRecipientResponse> {
    const admin = await this.adminRepository.findById(actorId);

    if (!admin) {
      return left(new NotAllowedError());
    }

    const recipient = Recipient.create({
      name,
      coordinate: Coordinate.create({ longitude, latitude }),
    });

    await this.recipientRepository.create(recipient);

    return right({ recipient });
  }
}
