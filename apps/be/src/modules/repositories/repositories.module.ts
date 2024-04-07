import { Module } from '@nestjs/common';
import { DBProvider } from '../../providers/db.provider';
import { RepositoriesController } from './repositories.controller';
import { RepositoriesService } from './repositories.service';
import { CodeAnalyzerModule } from '../code-analyzer/code-analyzer.module';

@Module({
  imports: [CodeAnalyzerModule],
  controllers: [RepositoriesController],
  providers: [DBProvider, RepositoriesService],
  exports: [],
})
export class RepositoriesModule {}
