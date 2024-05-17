import { Inject, Injectable } from '@nestjs/common';

import {
  ChatPromptTemplate,
  AIMessagePromptTemplate,
  HumanMessagePromptTemplate,
} from '@langchain/core/prompts';
import { RunnableSequence } from '@langchain/core/runnables';
import { formatDocumentsAsString } from 'langchain/util/document';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { type TRepository } from '@repo-code-analyzer/types';

import {
  CHAT_MODEL,
  type ChatModel,
} from '../../providers/chat-model.provider';
import { DocumentsService } from '../documents/documents.service';

@Injectable()
export class ChatService {
  constructor(
    @Inject(CHAT_MODEL) private readonly chatModel: ChatModel,
    private readonly documentsService: DocumentsService,
  ) {}

  private questionGeneratorPromptTemplate() {
    return ChatPromptTemplate.fromMessages([
      AIMessagePromptTemplate.fromTemplate(
        'Given the following conversation about a codebase and a follow up question, rephrase the follow up question to be a standalone question.',
      ),
      AIMessagePromptTemplate.fromTemplate(
        `Follow Up Input: {question} 
        Standalone question:`,
      ),
    ]);
  }

  private documentsGeneratorPromptTemplate() {
    return ChatPromptTemplate.fromMessages([
      AIMessagePromptTemplate.fromTemplate(
        "Use the following pieces of context which include files from a github repository to answer the question at the end. If you don't know the answer, just say that you don't know, don't try to make up an answer.\n\n{context}\n\n",
      ),
      HumanMessagePromptTemplate.fromTemplate('Question: {question}'),
    ]);
  }

  private createConversationChain(repositoryId: TRepository['id']) {
    const combineDocumentsChain = RunnableSequence.from([
      {
        question: (output: string) => output,

        context: async (output: string) => {
          const docs = await this.documentsService.get({
            repositoryId,
            prompt: output,
          });

          return formatDocumentsAsString(docs);
        },
      },
      this.documentsGeneratorPromptTemplate(),
      this.chatModel,
      new StringOutputParser(),
    ]);

    const conversationalQaChain = RunnableSequence.from([
      {
        question: (i: { question: string }) => i.question,
      },
      this.questionGeneratorPromptTemplate(),
      this.chatModel,
      new StringOutputParser(),
      combineDocumentsChain,
    ]);

    return conversationalQaChain;
  }

  public async ask(repositoryId: TRepository['id'], question: string) {
    const conversationChain = this.createConversationChain(repositoryId);

    const answer = await conversationChain.invoke({ question });

    return answer;
  }
}
