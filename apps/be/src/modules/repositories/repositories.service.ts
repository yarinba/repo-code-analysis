import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { type DB, DB_CLIENT } from '../../providers/db.provider';

@Injectable()
export class RepositoriesService {
  private readonly table = 'repositories';

  constructor(@Inject(DB_CLIENT) private readonly db: DB) {}

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
      HttpStatus.UNPROCESSABLE_ENTITY
    );
  }

  public async findAll() {
    const { data } = await this.db.from(this.table).select('*');

    return data;
  }

  public async findOne(id: number) {
    const { data } = await this.db.from(this.table).select('*').eq('id', id);

    return data[0];
  }

  public async create(repositoryURL: string) {
    const { owner, name } = this.extractRepoInfo(repositoryURL);

    const { data: existingData } = await this.db
      .from(this.table)
      .select('*')
      .eq('owner', owner)
      .eq('name', name);

    if (existingData.length > 0) {
      console.error(`repository ${owner}/${name} already exists`);
      throw new HttpException(
        `repository ${owner}/${name} already exists`,
        HttpStatus.BAD_REQUEST
      );
    }

    const { data } = await this.db
      .from(this.table)
      .insert({ owner, name, url: repositoryURL })
      .select();

    return data[0];
  }
}
