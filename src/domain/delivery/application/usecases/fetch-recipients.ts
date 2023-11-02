import { Either, left, right } from '@/core/errors/either';
import { Recipient } from '../../enterprise/entities/recipient';
import { RecipientRepository } from '../repositories/recipient-repository';
import { AdminRepository } from '../repositories/admin-repository';
import { NotAllowedError } from '@/core/errors/not-allowed-error';

interface FetchRecipientsRequest {
  actorId: string;
  page?: number;
}

type FetchRecipientsResponse = Either<
  NotAllowedError,
  { recipients: Recipient[] }
>;

export class FetchRecipients {
  constructor(
    private recipientRepository: RecipientRepository,
    private adminRepository: AdminRepository,
  ) {}

  async execute({
    actorId,
    page = 1,
  }: FetchRecipientsRequest): Promise<FetchRecipientsResponse> {
    const admin = await this.adminRepository.findById(actorId);

    if (!admin) {
      return left(new NotAllowedError());
    }

    const recipients = await this.recipientRepository.findAll({ page });

    return right({ recipients });
  }
}
