import {
  HttpException,
  HttpStatus,
  Scope,
  type Provider,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

import { ChatOpenAI } from '@langchain/openai';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { type BaseLanguageModelInput } from '@langchain/core/language_models/base';
import {
  type Runnable,
  type RunnableConfig,
} from '@langchain/core/dist/runnables';

export const CHAT_MODEL = 'CHAT_MODEL';

export const ChatProvider: Provider = {
  provide: CHAT_MODEL,
  inject: [REQUEST],
  scope: Scope.REQUEST,
  useFactory: (request: Request) => {
    const openAIApiKey = request.headers['openai-api-key'];

    if (!openAIApiKey) {
      throw new HttpException(
        'OpenAI token not provided',
        HttpStatus.UNAUTHORIZED
      );
    }

    return new ChatOpenAI({ openAIApiKey, modelName: 'gpt-4' }).pipe(
      new StringOutputParser()
    );
  },
};

export type ChatModel = Runnable<
  BaseLanguageModelInput,
  string,
  RunnableConfig
>;
