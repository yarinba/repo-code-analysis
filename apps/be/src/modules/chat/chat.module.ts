import { Module } from '@nestjs/common';
import { DocumentsModule } from '../documents/documents.module';
import { ChatProvider } from '../../providers/chat-model.provider';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';

@Module({
  imports: [DocumentsModule],
  providers: [ChatProvider, ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
