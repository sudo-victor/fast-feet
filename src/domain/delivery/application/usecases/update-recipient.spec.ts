import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository';
import { makeRecipient } from 'test/factories/make-recipient';
import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository';
import { makeAdmin } from 'test/factories/make-admin';
import { randomUUID } from 'crypto';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { UpdateRecipient } from './update-recipient';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

let inMemoryRecipientRepository: InMemoryRecipientRepository;
let inMemoryAdminRepository: InMemoryAdminRepository;
let sut: UpdateRecipient;

describe('Update recipient', () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository();
    inMemoryAdminRepository = new InMemoryAdminRepository();
    sut = new UpdateRecipient(
      inMemoryRecipientRepository,
      inMemoryAdminRepository,
    );
  });

  it('should be able to update a recipient', async () => {
    const admin = makeAdmin();
    await inMemoryAdminRepository.create(admin);

    const recipient = makeRecipient();
    inMemoryRecipientRepository.create(recipient);

    const payload = {
      id: recipient.id.toString(),
      actorId: admin.id.toString(),
      source: {
        name: 'New Recipient Name',
      },
    };

    const result = await sut.execute(payload);

    expect(result.isRight()).toEqual(true);
    expect((inMemoryRecipientRepository.items[0] as any).props).toEqual(
      expect.objectContaining({
        name: 'New Recipient Name',
      }),
    );
  });

  it('should to return an error if try to update a recipient with an invalid actorId', async () => {
    const recipient = makeRecipient();
    inMemoryRecipientRepository.create(recipient);

    const payload = {
      id: recipient.id.toString(),
      actorId: randomUUID(),
      source: {
        name: 'New Recipient Name',
      },
    };

    const result = await sut.execute(payload);

    expect(result.isLeft()).toEqual(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it('should to return an error if try to update a recipient with an existent id', async () => {
    const admin = makeAdmin();
    await inMemoryAdminRepository.create(admin);

    const recipient = makeRecipient();
    inMemoryRecipientRepository.create(recipient);

    const payload = {
      id: randomUUID(),
      actorId: admin.id.toString(),
      source: {
        name: 'New Recipient Name',
      },
    };

    const result = await sut.execute(payload);

    expect(result.isLeft()).toEqual(true);
    expect(inMemoryRecipientRepository.items).toHaveLength(1);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
