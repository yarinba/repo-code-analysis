import { Body, Controller, Get, Patch, Post, Query } from '@nestjs/common';
import { PromptsService } from './prompts.service';

@Controller('prompts')
export class PromptsController {
  constructor(private readonly promptsService: PromptsService) {}

  @Post()
  async createPrompt(
    @Body() { repositoryId, text }: { repositoryId: number; text: string },
  ) {
    return this.promptsService.create(repositoryId, text);
  }

  @Patch('/upvote')
  async upvote(@Body() { id }: { id: number }) {
    return this.promptsService.update(id, 'upvote');
  }

  @Patch('/downvote')
  async downvote(@Body() { id }: { id: number }) {
    return this.promptsService.update(id, 'downvote');
  }

  @Get()
  async getRepositoryPrompts(@Query('repositoryId') repositoryId: number) {
    return this.promptsService.findHighestRanked(repositoryId);
  }
}
