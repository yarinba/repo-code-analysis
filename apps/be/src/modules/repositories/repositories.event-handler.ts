import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { RepositoriesService } from './repositories.service';
import { ScanCompletedEvent } from '../code-analyzer/events/scan-completed.event';

@Injectable()
export class RepositoriesEventHandler {
  constructor(private readonly repositoriesService: RepositoriesService) {}

  @OnEvent(ScanCompletedEvent.eventName)
  async handleScanCompleted({ repositoryId }: ScanCompletedEvent) {
    await this.repositoriesService.update(repositoryId, { status: 'DONE' });
  }
}
