import {
  HttpException,
  HttpStatus,
  Scope,
  type Provider,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

import { OpenAIEmbeddings } from '@langchain/openai';

export const EMBEDDINGS_MODEL = 'EMBEDDINGS_MODEL';

export const EmbeddingsProvider: Provider = {
  provide: EMBEDDINGS_MODEL,
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

    return new OpenAIEmbeddings({ openAIApiKey });
  },
};

export type EmbeddingsModel = OpenAIEmbeddings;
