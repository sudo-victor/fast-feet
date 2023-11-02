import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository';
import { makeAdmin } from 'test/factories/make-admin';
import { randomUUID } from 'crypto';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { FetchRecipients } from './fetch-recipients';
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository';
import { makeRecipient } from 'test/factories/make-recipient';

let inMemoryRecipientRepository: InMemoryRecipientRepository;
let inMemoryAdminRepository: InMemoryAdminRepository;
let sut: FetchRecipients;

describe('Fetch recipients', () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository();
    inMemoryAdminRepository = new InMemoryAdminRepository();
    sut = new FetchRecipients(
      inMemoryRecipientRepository,
      inMemoryAdminRepository,
    );
  });

  it('should be able to fetch all recipients', async () => {
    const admin = makeAdmin();
    await inMemoryAdminRepository.create(admin);

    inMemoryRecipientRepository.items.push(
      makeRecipient(),
      makeRecipient(),
      makeRecipient(),
    );

    const payload = {
      actorId: admin.id.toString(),
    };

    const result = await sut.execute(payload);

    expect(result.isRight()).toEqual(true);
    expect((result.value as any).recipients).toHaveLength(3);
  });

  it('should not be able to fetch all recipients with invalid actorId', async () => {
    const payload = {
      actorId: randomUUID(),
    };

    const result = await sut.execute(payload);

    expect(result.isLeft()).toEqual(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it('should be able to fetch all recipients with 20 per pages', async () => {
    const admin = makeAdmin();
    await inMemoryAdminRepository.create(admin);

    for (let i = 0; i < 25; i++) {
      inMemoryRecipientRepository.items.push(makeRecipient());
    }

    const payload = {
      actorId: admin.id.toString(),
    };

    const result = await sut.execute(payload);

    expect(result.isRight()).toEqual(true);
    expect((result.value as any).recipients).toHaveLength(20);
  });
});
