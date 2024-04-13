import { Module } from '@nestjs/common';

import { DBProvider } from '../../providers/db.provider';
import { DocumentsService } from './documents.service';
import { EmbeddingsProvider } from '../../providers/embeddings-model.provider';

@Module({
  imports: [],
  providers: [DBProvider, EmbeddingsProvider, DocumentsService],
  exports: [DocumentsService],
})
export class DocumentsModule {}
