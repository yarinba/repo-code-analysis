import { Inject, Injectable } from '@nestjs/common';

import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase';
import { OpenAIEmbeddings } from '@langchain/openai';
import { type Document } from '@langchain/core/documents';

import { type DB, DB_CLIENT } from '../../providers/db.provider';
import { TRepository } from '../../db/schema';

@Injectable()
export class DocumentsService {
  private readonly table = 'documents';

  constructor(
    @Inject(DB_CLIENT) private readonly db: DB,
    @Inject(OpenAIEmbeddings.name)
    private readonly embeddingsClient: OpenAIEmbeddings
  ) {}

  public async save(
    documents: Document[],
    repository: Pick<TRepository, 'id'>
  ) {
    const embeddings = await this.embeddingsClient.embedDocuments(
      documents.map((d) => d.pageContent)
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
    repository,
    prompt,
  }: {
    repository: TRepository;
    prompt: string;
  }) {
    const vectorStore = new SupabaseVectorStore(this.embeddingsClient, {
      client: this.db,
      tableName: this.table,
      queryName: 'match_documents',
    });

    const retriever = vectorStore.asRetriever({
      searchType: 'mmr',
      searchKwargs: { fetchK: 5 },
      filter: (rpc) =>
        rpc.filter('metadata->>repository_id', 'eq', repository.id),
    });

    return await retriever.getRelevantDocuments(prompt);
  }
}
