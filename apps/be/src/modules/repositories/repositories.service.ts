import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { type TRepository } from '@types';
import { GITHUB_URL_REGEX } from '@utils';
import { type DB, DB_CLIENT } from '../../providers/db.provider';
import { PromptsService } from '../prompts/prompts.service';

@Injectable()
export class RepositoriesService {
  private readonly table = 'repositories';

  constructor(
    @Inject(DB_CLIENT) private readonly db: DB,
    private readonly promptsService: PromptsService,
  ) {}

  /**
   * Extracts repository owner and name from the given repository URL.
   *
   * @param repositoryURL The URL of the repository.
   *
   * @returns An object containing the owner and name of the repository.
   * @throws HttpException if the URL is invalid.
   */
  private extractRepoInfo(repositoryURL: string): {
    owner: string;
    name: string;
  } {
    const match = repositoryURL.match(GITHUB_URL_REGEX);

    if (match) {
      return { owner: match[3], name: match[4] };
    }

    throw new HttpException(
      `invalid repository URL: ${repositoryURL}`,
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }

  /**
   * Retrieves all repositories from the database.
   *
   * @returns Promise<any[]> representing an array of all repositories.
   */
  public async findAll() {
    const { data } = await this.db
      .from(this.table)
      .select('*')
      .order('created_at', { ascending: false });

    return data;
  }

  /**
   * Retrieves a repository by its ID from the database.
   *
   * @param id The ID of the repository to retrieve.
   *
   * @returns Promise<any> representing the retrieved repository.
   */
  public async findOne(id: number) {
    const { data } = await this.db.from(this.table).select('*').eq('id', id);

    return data[0];
  }

  /**
   * Creates a new repository entry in the database.
   *
   * @param repositoryURL The URL of the repository to create.
   *
   * @returns Promise<any> representing the created repository.
   * @throws HttpException if the repository already exists.
   */
  public async create(repositoryURL: string) {
    const { owner, name } = this.extractRepoInfo(repositoryURL);

    const { data: existingData } = await this.db
      .from(this.table)
      .select('*')
      .eq('owner', owner)
      .eq('name', name);

    if (existingData.length > 0) {
      Logger.error(`repository ${owner}/${name} already exists`);
      throw new HttpException(
        `repository ${owner}/${name} already exists`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const { data } = await this.db
      .from(this.table)
      .insert({ owner, name, url: repositoryURL })
      .select();

    const createdRepo = data[0];

    await this.promptsService.attachDefaultPromptsToRepo(createdRepo.id);

    return createdRepo;
  }

  /**
   * Updates the status of a repository in the database.
   *
   * @param id The ID of the repository to update.
   * @param repository An object containing the updated status of the repository.
   *
   * @returns Promise<any> representing the updated repository.
   */
  public async update(id: number, repository: Pick<TRepository, 'status'>) {
    const { data } = await this.db
      .from(this.table)
      .update({ status: repository.status })
      .eq('id', id)
      .select();

    return data[0];
  }
}
