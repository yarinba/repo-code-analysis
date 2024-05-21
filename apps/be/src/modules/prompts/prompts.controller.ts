import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
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

  @Patch('/upvote/:id')
  async upvote(@Param('id') id: number) {
    return this.promptsService.update(id, 'upvote');
  }

  @Patch('/downvote/:id')
  async downvote(@Param('id') id: number) {
    return this.promptsService.update(id, 'downvote');
  }

  @Get()
  async getRepositoryPrompts(@Query('repositoryId') repositoryId: number) {
    return this.promptsService.findHighestRanked(repositoryId);
  }
}
