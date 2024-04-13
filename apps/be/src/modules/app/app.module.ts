import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { RepositoriesModule } from '../repositories/repositories.module';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [
    ChatModule,
    ConfigModule.forRoot({ isGlobal: true }),
    EventEmitterModule.forRoot(),
    RepositoriesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
