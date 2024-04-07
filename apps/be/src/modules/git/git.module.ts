import { Module } from '@nestjs/common';
import { GitService } from './git.service';
import { GitProvider } from '../../providers/git.provider';

@Module({
  providers: [GitProvider, GitService],
  exports: [GitService],
})
export class GitModule {}
