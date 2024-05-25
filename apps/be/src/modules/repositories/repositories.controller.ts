import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { RepositoriesService } from './repositories.service';
import { CodeAnalyzerService } from '../code-analyzer/code-analyzer.service';

@Controller('repositories')
export class RepositoriesController {
  constructor(
    private readonly repositoriesService: RepositoriesService,
    private readonly codeAnalyzerService: CodeAnalyzerService
  ) {
  }


  /**
   * Create a new repository based on the provided URL.
   *
   * @param repositoryURL The URL of the repository to create.
   * @returns Promise<void> indicating the completion of the create operation.
   */
  @Post('create')
  @HttpCode(201)
  async create(@Body() { repositoryURL }: { repositoryURL: string }) {
    return await this.repositoriesService.create(repositoryURL);
  }
    private readonly codeAnalyzerService: CodeAnalyzerService,
  ) {}


  /**
   * Endpoint for scanning a repository specified by its URL.
   *
   * @param repositoryURL The URL of the repository to scan.
   *
   * @returns Promise<TRepository> indicating the start of the scanning operation.
   */
  @Post()
  async scan(@Body() { repositoryURL }: { repositoryURL: string }) {
    const repository = await this.repositoriesService.create(repositoryURL);

    void this.codeAnalyzerService.scan(repository);

    return repository;
  }

  /**
   * Endpoint for retrieving all repositories.
   *
   * @returns Promise<TRepository[]> representing an array of all repositories.
   */
  @Get()
  async findAll() {
    return this.repositoriesService.findAll();
  }
}
