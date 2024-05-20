import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { RepositoriesModule } from '../repositories/repositories.module';
import { ChatModule } from '../chat/chat.module';
import { ValidateApiKeyModule } from '../validations/validate-api-key.module';

@Module({
  imports: [
    ChatModule,
    ConfigModule.forRoot({ isGlobal: true }),
    EventEmitterModule.forRoot(),
    RepositoriesModule,
    ValidateApiKeyModule, // Add the new module to imports
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
