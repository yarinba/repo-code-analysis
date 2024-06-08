import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { RepositoriesService } from './repositories.service';
import { ScanCompletedEvent } from '../code-analyzer/events/scan-completed.event';

@Injectable()
export class RepositoriesEventHandler {
  constructor(private readonly repositoriesService: RepositoriesService) {}

  /**
   * Event handler for handling the 'ScanCompletedEvent' event.
   * Updates the status of the repository specified by its ID to 'DONE' upon completion of scanning.
   *
   * @param event The 'ScanCompletedEvent' event object containing the repository ID.
   *
   * @returns Promise<void> indicating the completion of the update operation.
   */
  @OnEvent(ScanCompletedEvent.eventName)
  async handleScanCompleted({ repositoryId }: ScanCompletedEvent) {
    Logger.log(`handle ScanCompletedEvent for repository ${repositoryId}`);

    await this.repositoriesService.update(repositoryId, { status: 'DONE' });
  }
}
