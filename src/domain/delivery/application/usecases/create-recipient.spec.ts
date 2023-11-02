import { CreateRecipient } from './create-recipient';
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository';
import { faker } from '@faker-js/faker';

let inMemoryRecipientRepository: InMemoryRecipientRepository;
let sut: CreateRecipient;

describe('Authenticate deliverer', () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository();
    sut = new CreateRecipient(inMemoryRecipientRepository);
  });

  it('should be able to create a recipient', async () => {
    const payload = {
      name: faker.person.fullName(),
      longitude: faker.location.longitude(),
      latitude: faker.location.latitude(),
    };

    const result = await sut.execute(payload);

    expect(result.isRight()).toEqual(true);
    expect(inMemoryRecipientRepository.items).toHaveLength(1);
  });
});
