import { Either, left, right } from '@/core/errors/either';
import { Recipient } from '../../enterprise/entities/recipient';
import { RecipientRepository } from '../repositories/recipient-repository';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { AdminRepository } from '../repositories/admin-repository';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

interface GetRecipientByIdRequest {
  recipientId: string;
  actorId: string;
}

type GetRecipientByIdResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    recipient: Recipient;
  }
>;

export class GetRecipientById {
  constructor(
    private recipientRepository: RecipientRepository,
    private adminRepository: AdminRepository,
  ) {}

  async execute({
    recipientId,
    actorId,
  }: GetRecipientByIdRequest): Promise<GetRecipientByIdResponse> {
    const admin = await this.adminRepository.findById(actorId);

    if (!admin) {
      return left(new NotAllowedError());
    }

    const recipient = await this.recipientRepository.findById(recipientId);

    return right({
      recipient,
    });
  }
}
