import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository';
import { makeRecipient } from 'test/factories/make-recipient';
import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository';
import { makeAdmin } from 'test/factories/make-admin';
import { randomUUID } from 'crypto';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { DeleteRecipient } from './delete-recipient';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

let inMemoryRecipientRepository: InMemoryRecipientRepository;
let inMemoryAdminRepository: InMemoryAdminRepository;
let sut: DeleteRecipient;

describe('Delete recipient', () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository();
    inMemoryAdminRepository = new InMemoryAdminRepository();
    sut = new DeleteRecipient(
      inMemoryRecipientRepository,
      inMemoryAdminRepository,
    );
  });

  it('should be able to delete a recipient', async () => {
    const admin = makeAdmin();
    await inMemoryAdminRepository.create(admin);

    const recipient1 = makeRecipient();
    const recipient2 = makeRecipient();

    inMemoryRecipientRepository.create(recipient1);
    inMemoryRecipientRepository.create(recipient2);

    const payload = {
      recipientId: recipient1.id.toString(),
      actorId: admin.id.toString(),
    };

    const result = await sut.execute(payload);

    expect(result.isRight()).toEqual(true);
    expect(inMemoryRecipientRepository.items).toHaveLength(1);
    expect(inMemoryRecipientRepository.items).toEqual(
      expect.arrayContaining([expect.objectContaining({ ...recipient2 })]),
    );
  });

  it('should to return an error if try to delete a recipient with an invalid actorId', async () => {
    const recipient1 = makeRecipient();
    const recipient2 = makeRecipient();

    inMemoryRecipientRepository.create(recipient1);
    inMemoryRecipientRepository.create(recipient2);

    const payload = {
      recipientId: recipient1.id.toString(),
      actorId: randomUUID(),
    };

    const result = await sut.execute(payload);

    expect(result.isLeft()).toEqual(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it('should to return an error if try to register a recipient with an existent document', async () => {
    const admin = makeAdmin();
    await inMemoryAdminRepository.create(admin);

    const payload = {
      recipientId: randomUUID(),
      actorId: admin.id.toString(),
    };

    const result = await sut.execute(payload);

    expect(result.isLeft()).toEqual(true);
    expect(inMemoryRecipientRepository.items).toHaveLength(0);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
