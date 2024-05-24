import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
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
    @Res() res: Response,
  ) {
    const streamedAnswer = await this.chatService.ask(repositoryId, question);

    res.set('Content-Type', 'application/octet-stream');
    res.set('X-Content-Type-Options', 'nosniff');

    for await (const chunk of streamedAnswer) {
      // here express will stream the response
      res.write(chunk);
    }
    // here express sends the closing/done/end signal for the stream consumer
    res.end();
    // // TODO: in the future, we might want to save the message to the database
    // return { id: uniqueId(), text: answer, actor: 'ai' };
  }
}
