import { Body, Controller, Post } from '@nestjs/common';
import { ChatService } from './chat.service';
import askSchema from './schemas/ask.schema';
import { ZodPipe } from '../../pipes/zod.pipe';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async ask(
    @Body(new ZodPipe(askSchema))
    { repositoryId, question }: { repositoryId: number; question: string }
  ) {
    const answer = await this.chatService.ask(repositoryId, question);

    return { answer };
  }
}
