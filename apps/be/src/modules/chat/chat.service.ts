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

  /**
   * Generates a prompt template for rephrasing follow-up questions related to a codebase conversation.
   * The template instructs the AI assistant to rephrase follow-up questions to be standalone questions
   * related to the codebase. If a question is not related to the codebase, the assistant responds with
   * a message indicating the need for relevant questions.
   *
   * @returns A ChatPromptTemplate object containing the generated prompt template.
   * @private
   */
  private questionGeneratorPromptTemplate() {
    return ChatPromptTemplate.fromMessages([
      AIMessagePromptTemplate.fromTemplate(
        'Given the following conversation about a codebase and a follow up question, rephrase the follow up question to be a standalone question related to the codebase. If the question is not related to the codebase, respond with "I apologize, but my purpose is to answer questions specifically about the provided codebase. Please ask a question that is relevant to the code."',
      ),
      AIMessagePromptTemplate.fromTemplate(
        "You must format your output as a Markdown format. Don't mention anything about Markdown in your response; just return the response itself in Markdown format.",
      ),
      AIMessagePromptTemplate.fromTemplate(
        `Follow Up Input: {question}
        Standalone question:`,
      ),
    ]);
  }

  /**
   * Generates a prompt template for generating responses based on documents related to a GitHub repository.
   * The template instructs the AI assistant to provide accurate and helpful information about the codebase
   * using context provided from the repository's files. If the question cannot be answered based on the provided
   * context, the assistant responds with a message indicating insufficient information.
   *
   * @returns A ChatPromptTemplate object containing the generated prompt template.
   * @private
   */
  private documentsGeneratorPromptTemplate() {
    return ChatPromptTemplate.fromMessages([
      AIMessagePromptTemplate.fromTemplate(
        'As an AI assistant, your purpose is to provide accurate and helpful information about the codebase based on the context provided. Use the following pieces of context, which include files from a GitHub repository, to answer the question at the end. If the question cannot be answered based on the provided context, respond with "I apologize, but I don\'t have enough information in the provided context to answer this question accurately." Do not attempt to fabricate an answer.\n\n{context}\n\n',
      ),
      HumanMessagePromptTemplate.fromTemplate('Question: {question}'),
    ]);
  }

  /**
   * Constructs a conversation chain tailored to the specified GitHub repository.
   * The conversation chain includes actions for processing user queries, generating responses,
   * and managing the conversation flow based on the provided repositoryId.
   *
   * @param repositoryId The ID of the GitHub repository for which the conversation chain is created.
   *
   * @returns A sequence of runnables representing the conversation flow.
   * @private
   */
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

  /**
   * Processes a user question about the specified GitHub repository and generates a response.
   *
   * @param repositoryId The ID of the GitHub repository to which the question pertains.
   * @param question The question asked by the user.
   *
   * @returns A Promise resolving to the response generated by the chatbot.
   */
  public async ask(repositoryId: TRepository['id'], question: string) {
    const conversationChain = this.createConversationChain(repositoryId);

    return conversationChain.stream({ question });
  }
}
