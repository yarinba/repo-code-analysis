import { Body, Controller, Post } from '@nestjs/common';
import { uniqueId } from 'lodash';
import { type TMessage } from '@types';
import { ChatService } from './chat.service';
import askSchema from './schemas/ask.schema';
import { ZodPipe } from '../../pipes/zod.pipe';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async ask(
    @Body(new ZodPipe(askSchema))
    { repositoryId, question }: { repositoryId: number; question: string },
  ): Promise<TMessage> {
    const answer = await this.chatService.ask(repositoryId, question);

    // TODO: in the future, we might want to save the message to the database
    return { id: uniqueId(), text: answer, actor: 'ai' };
  }
}
