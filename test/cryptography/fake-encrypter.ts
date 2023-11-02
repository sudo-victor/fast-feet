import { Encrypter } from '@/domain/delivery/application/cryptography/encrypter';

export class FakeEncrypter implements Encrypter {
  async generate(payload: any): Promise<string> {
    return JSON.stringify(payload);
  }
}
