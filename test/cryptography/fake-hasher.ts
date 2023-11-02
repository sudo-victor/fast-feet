import { HashComparer } from '@/domain/delivery/application/cryptography/hash-comparer';
import { HashGenerator } from '@/domain/delivery/application/cryptography/hash-generator';

export class FakeHasher implements HashGenerator, HashComparer {
  async compare(plain: string, hash: string): Promise<boolean> {
    return plain === hash;
  }

  async hash(plain: string): Promise<string> {
    return plain + '_hashed';
  }
}
