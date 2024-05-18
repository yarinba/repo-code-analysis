import { Inject, Injectable } from '@nestjs/common';

import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase';
import { type Document } from '@langchain/core/documents';
import { type TRepository } from '@types';

import { type DB, DB_CLIENT } from '../../providers/db.provider';
import {
  EMBEDDINGS_MODEL,
  type EmbeddingsModel,
} from '../../providers/embeddings-model.provider';

@Injectable()
export class DocumentsService {
  private readonly table = 'documents';

  constructor(
    @Inject(DB_CLIENT) private readonly db: DB,
    @Inject(EMBEDDINGS_MODEL)
    private readonly embeddingsModel: EmbeddingsModel,
  ) {}

  public async save(
    documents: Document[],
    repository: Pick<TRepository, 'id'>,
  ) {
    const embeddings = await this.embeddingsModel.embedDocuments(
      documents.map((d) => d.pageContent),
    );

    const documentsToSave = documents.map((doc, i) => ({
      content: doc.pageContent,
      // ! `as unknown as string` is a hack to get around the type mismatch
      embedding: embeddings[i] as unknown as string,
      metadata: doc.metadata,
      repository_id: repository.id,
    }));

    await this.db.from(this.table).insert(documentsToSave);
  }

  public async get({
    repositoryId,
    prompt,
  }: {
    repositoryId: TRepository['id'];
    prompt: string;
  }) {
    const vectorStore = new SupabaseVectorStore(this.embeddingsModel, {
      client: this.db,
      tableName: this.table,
      queryName: 'match_documents',
    });

    const retriever = vectorStore.asRetriever({
      searchType: 'mmr',
      searchKwargs: { fetchK: 5 },
      filter: (rpc) =>
        rpc.filter('metadata->>repository_id', 'eq', repositoryId),
    });

    const documents = await retriever.getRelevantDocuments(prompt);

    return documents;
  }
}
