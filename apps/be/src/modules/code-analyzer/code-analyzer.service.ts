import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import {
  RecursiveCharacterTextSplitter,
  type RecursiveCharacterTextSplitterParams,
  type SupportedTextSplitterLanguage,
} from 'langchain/text_splitter';

import { DocumentsService } from '../documents/documents.service';
import { GitService } from '../git/git.service';
import { FILE_EXTENSIONS_LANGUAGE_MAP } from './constants';
import { type TRepository } from '../../db/schema';
import { ScanCompletedEvent } from './events/scan-completed.event';

@Injectable()
export class CodeAnalyzerService {
  constructor(
    private readonly documentsService: DocumentsService,
    private readonly gitService: GitService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  public async scan(repository: TRepository) {
    const { repositoryClonePath } = await this.gitService.clone(repository);

    const directoryLoader = new DirectoryLoader(repositoryClonePath, {
      '.ts': (path: string) => new TextLoader(path),
      '.js': (path: string) => new TextLoader(path),
      '.tsx': (path: string) => new TextLoader(path),
      '.jsx': (path: string) => new TextLoader(path),
      '.py': (path: string) => new TextLoader(path),
      '.cpp': (path: string) => new TextLoader(path),
      '.go': (path: string) => new TextLoader(path),
      '.java': (path: string) => new TextLoader(path),
      '.php': (path: string) => new TextLoader(path),
      '.rb': (path: string) => new TextLoader(path),
      '.rs': (path: string) => new TextLoader(path),
      '.swift': (path: string) => new TextLoader(path),
      '.md': (path: string) => new TextLoader(path),
      '.html': (path: string) => new TextLoader(path),
    });

    const docs = await directoryLoader.load();

    const docsByLanguage = docs.reduce(
      (acc, doc) => {
        const extension = doc.metadata.source.split('.').pop();
        const language = FILE_EXTENSIONS_LANGUAGE_MAP[extension];

        if (language) {
          acc[language].push(doc);
        } else {
          Logger.warn(`no language found for extension: ${extension}`, {
            repositoryId: repository.id,
          });
        }

        return acc;
      },
      {
        js: [],
        python: [],
        cpp: [],
        go: [],
        java: [],
        php: [],
        ruby: [],
        rust: [],
        swift: [],
        markdown: [],
        html: [],
        latex: [],
        sol: [],
        proto: [],
        rst: [],
        scala: [],
      } as Record<SupportedTextSplitterLanguage, any[]>
    );

    const splitterOptions: Partial<RecursiveCharacterTextSplitterParams> = {
      chunkSize: 2000,
      chunkOverlap: 200,
    };

    const promises = Object.entries(docsByLanguage).map(
      async ([language, docs]) => {
        const splitter = RecursiveCharacterTextSplitter.fromLanguage(
          language as SupportedTextSplitterLanguage,
          splitterOptions
        );

        // Await the result of splitDocuments
        const splitDocs = await splitter.splitDocuments(docs);
        return splitDocs;
      }
    );

    // Wait for all promises to resolve and then flatten the result
    const results = await Promise.all(promises);
    const splittedDocs = results.flat();

    const enrichedDocs = splittedDocs.map((doc) => ({
      ...doc,
      metadata: { ...doc.metadata, repository_id: repository.id },
    }));

    Logger.log(
      `saving ${enrichedDocs.length} documents for repository ${repository.id}`
    );

    await this.documentsService.save(enrichedDocs, repository);

    await this.gitService.deleteClone(repository.id);

    this.eventEmitter.emit(
      ScanCompletedEvent.eventName,
      new ScanCompletedEvent({ repositoryId: repository.id })
    );

    Logger.log(`scan completed for repository ${repository.id}`);
  }
}
