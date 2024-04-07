import { Body, Controller, Get, Post } from '@nestjs/common';
import { RepositoriesService } from './repositories.service';
import { CodeAnalyzerService } from '../code-analyzer/code-analyzer.service';

@Controller('repositories')
export class RepositoriesController {
  constructor(
    private readonly repositoriesService: RepositoriesService,
    private readonly codeAnalyzerService: CodeAnalyzerService
  ) {}

  @Post()
  async scan(@Body() { repositoryURL }: { repositoryURL: string }) {
    const repository = await this.repositoriesService.create(repositoryURL);

    await this.codeAnalyzerService.scan(repository);
  }

  @Get()
  async findAll() {
    return this.repositoriesService.findAll();
  }
}
