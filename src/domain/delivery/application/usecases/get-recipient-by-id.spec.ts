import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository';
import { makeAdmin } from 'test/factories/make-admin';
import { randomUUID } from 'crypto';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository';
import { makeRecipient } from 'test/factories/make-recipient';
import { GetRecipientById } from './get-recipient-by-id';

let inMemoryRecipientRepository: InMemoryRecipientRepository;
let inMemoryAdminRepository: InMemoryAdminRepository;
let sut: GetRecipientById;

describe('Fetch recipients', () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository();
    inMemoryAdminRepository = new InMemoryAdminRepository();
    sut = new GetRecipientById(
      inMemoryRecipientRepository,
      inMemoryAdminRepository,
    );
  });

  it('should be able to get a recipient by id', async () => {
    const admin = makeAdmin();
    await inMemoryAdminRepository.create(admin);

    const recipient = makeRecipient();
    inMemoryRecipientRepository.items.push(recipient);

    const payload = {
      recipientId: recipient.id.toString(),
      actorId: admin.id.toString(),
    };

    const result = await sut.execute(payload);

    expect(result.isRight()).toEqual(true);
  });

  it('should not be able to get a recipient by id with invalid actorId', async () => {
    const recipient = makeRecipient();
    inMemoryRecipientRepository.items.push(recipient);

    const payload = {
      recipientId: recipient.id.toString(),
      actorId: randomUUID(),
    };

    const result = await sut.execute(payload);

    expect(result.isLeft()).toEqual(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
