import { Module } from '@nestjs/common';
import { DBProvider } from '../../providers/db.provider';
import { RepositoriesController } from './repositories.controller';
import { RepositoriesService } from './repositories.service';
import { CodeAnalyzerModule } from '../code-analyzer/code-analyzer.module';
import { RepositoriesEventHandler } from './repositories.event-handler';
import { PromptsModule } from '../prompts/prompts.module';

@Module({
  imports: [CodeAnalyzerModule, PromptsModule],
  controllers: [RepositoriesController],
  providers: [DBProvider, RepositoriesService, RepositoriesEventHandler],
})
export class RepositoriesModule {}
