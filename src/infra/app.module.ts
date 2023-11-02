import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './env/env';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (obj) => envSchema.parse(obj),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
