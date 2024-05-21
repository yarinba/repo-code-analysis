import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { RepositoriesModule } from '../repositories/repositories.module';
import { ChatModule } from '../chat/chat.module';
import { ValidateApiKeyModule } from '../validations/validate-api-key.module';
import { PromptsModule } from '../prompts/prompts.module';

@Module({
  imports: [
    ChatModule,
    ConfigModule.forRoot({ isGlobal: true }),
    EventEmitterModule.forRoot(),
    PromptsModule,
    RepositoriesModule,
    ValidateApiKeyModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
