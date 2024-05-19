import { Body, Controller, Post } from '@nestjs/common';
import { uniqueId } from 'lodash';
import { type TMessage } from '@types';
import { ChatService } from './chat.service';
import askSchema from './schemas/ask.schema';
import { ZodPipe } from '../../pipes/zod.pipe';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  /**
   * Handles incoming requests to ask a question related to a GitHub repository.
   *
   * @param repositoryId The ID of the GitHub repository to which the question pertains.
   * @param question The question asked by the user.
   *
   * @returns A Promise resolving to a TMessage object representing the chatbot's response.
   */
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
