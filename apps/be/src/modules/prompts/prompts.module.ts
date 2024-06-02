import { Module } from '@nestjs/common';
import { DBProvider } from '../../providers/db.provider';
import { PromptsService } from './prompts.service';
import { PromptsController } from './prompts.controller';

@Module({
  imports: [],
  controllers: [PromptsController],
  providers: [DBProvider, PromptsService],
  exports: [PromptsService],
})
export class PromptsModule {}
