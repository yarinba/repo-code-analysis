import { Inject, Injectable } from '@nestjs/common';

import {
  ChatPromptTemplate,
  AIMessagePromptTemplate,
  HumanMessagePromptTemplate,
} from '@langchain/core/prompts';
import { RunnableSequence } from '@langchain/core/runnables';
import { formatDocumentsAsString } from 'langchain/util/document';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { type TRepository } from '@types';

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
        'Given the following conversation about a codebase and a follow up question, rephrase the follow up question to be a standalone question related to the codebase. If the question is not related to the codebase, respond with "I apologize, but my purpose is to answer questions specifically about the provided codebase. Please ask a question that is relevant to the code."',
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
        'As an AI assistant, your purpose is to provide accurate and helpful information about the codebase based on the context provided. Use the following pieces of context, which include files from a GitHub repository, to answer the question at the end. If the question cannot be answered based on the provided context, respond with "I apologize, but I don\'t have enough information in the provided context to answer this question accurately." Do not attempt to fabricate an answer.\n\n{context}\n\n',
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
