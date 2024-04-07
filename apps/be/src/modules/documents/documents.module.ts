import { HttpException, HttpStatus, Module, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { OpenAIEmbeddings } from '@langchain/openai';

import { DBProvider } from '../../providers/db.provider';
import { DocumentsService } from './documents.service';

@Module({
  imports: [],
  providers: [
    DBProvider,
    {
      provide: OpenAIEmbeddings.name,
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
    },
    DocumentsService,
  ],
  exports: [DocumentsService],
})
export class DocumentsModule {}
