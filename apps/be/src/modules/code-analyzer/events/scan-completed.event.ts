import { type TRepository } from '@repo-code-analyzer/types';

export class ScanCompletedEvent {
  static eventName = 'scan-completed';

  repositoryId: TRepository['id'];

  constructor({ repositoryId }: ScanCompletedEvent) {
    this.repositoryId = repositoryId;
  }
}
