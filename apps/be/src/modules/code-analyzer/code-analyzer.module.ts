import { Module } from '@nestjs/common';
import { GitModule } from '../git/git.module';
import { CodeAnalyzerService } from './code-analyzer.service';
import { DocumentsModule } from '../documents/documents.module';

@Module({
  imports: [DocumentsModule, GitModule],
  providers: [CodeAnalyzerService],
  exports: [CodeAnalyzerService],
})
export class CodeAnalyzerModule {}
