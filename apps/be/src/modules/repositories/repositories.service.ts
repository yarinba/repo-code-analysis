import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { type TRepository } from '@types';
import { type DB, DB_CLIENT } from '../../providers/db.provider';

@Injectable()
export class RepositoriesService {
  private readonly table = 'repositories';

  constructor(@Inject(DB_CLIENT) private readonly db: DB) {}

  /**
   * Extracts repository owner and name from the given repository URL.
   * Supports both HTTPS and SSH formats for GitHub URLs.
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
    // Regular expressions for both HTTPS and SSH URLs for GitHub
    const HTTPS_REGEX =
      /^(https?):\/\/(www\.)?github\.com\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)\.git$/;
    const SSH_REGEX =
      /^git@github\.com:([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)\.git$/;

    // Check if the URL matches either HTTPS or SSH format
    const httpsMatch = repositoryURL.match(HTTPS_REGEX);
    const sshMatch = repositoryURL.match(SSH_REGEX);

    if (httpsMatch) {
      return { owner: httpsMatch[3], name: httpsMatch[4] };
    }

    if (sshMatch) {
      return { owner: sshMatch[1], name: sshMatch[2] };
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
    const { data } = await this.db.from(this.table).select('*');

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

    return data[0];
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
