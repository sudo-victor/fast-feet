import { Either, left, right } from '@/core/errors/either';
import { Recipient, RecipientProps } from '../../enterprise/entities/recipient';
import { RecipientRepository } from '../repositories/recipient-repository';
import { ResourceAlreadyExistsError } from '@/core/errors/resource-already-exists-error';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { AdminRepository } from '../repositories/admin-repository';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

interface UpdateRecipientRequest {
  id: string;
  actorId: string;
  source: Omit<Partial<RecipientProps>, 'createdAt' | 'updatedAt'>;
}

type UpdateRecipientResponse = Either<
  ResourceAlreadyExistsError | NotAllowedError,
  {
    recipient: Recipient;
  }
>;

export class UpdateRecipient {
  constructor(
    private recipientRepository: RecipientRepository,
    private adminRepository: AdminRepository,
  ) {}

  async execute({
    id,
    actorId,
    source: { name },
  }: UpdateRecipientRequest): Promise<UpdateRecipientResponse> {
    const admin = await this.adminRepository.findById(actorId);

    if (!admin) {
      return left(new NotAllowedError());
    }

    const recipient = await this.recipientRepository.findById(id);

    if (!recipient) {
      return left(new ResourceNotFoundError());
    }

    const recipientMerged = recipient.merge<Recipient>({ name });

    await this.recipientRepository.save(recipientMerged);

    return right({
      recipient: recipientMerged,
    });
  }
}
