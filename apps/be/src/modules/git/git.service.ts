import { Inject, Injectable } from '@nestjs/common';
import fs from 'fs/promises';

import { type Git, GIT_CLIENT } from '../../providers/git.provider';
import { type TRepository } from '../../db/schema';

@Injectable()
export class GitService {
  private readonly clonesDir = './clones';

  constructor(@Inject(GIT_CLIENT) private readonly gitClient: Git) {}

  private generateRepositoryClonePath(repositoryId: TRepository['id']): string {
    return `${this.clonesDir}/${repositoryId}`;
  }

  public async clone(
    repository: TRepository
  ): Promise<{ repositoryClonePath: string }> {
    const repositoryClonePath = this.generateRepositoryClonePath(repository.id);

    await this.gitClient.clone(repository.url, repositoryClonePath);

    // ! this is a workaround since NX is crashing when trying to clone a repo with .gitignore @see https://github.com/nrwl/nx/issues/16718
    // remove the .git directory & .gitignore from the clone
    await Promise.all([
      fs.rm(`${repositoryClonePath}/.git`, {
        recursive: true,
        force: true,
      }),
      fs.rm(`${repositoryClonePath}/.gitignore`),
    ]);

    return { repositoryClonePath };
  }

  public async deleteClone(repositoryId: TRepository['id']): Promise<void> {
    const repositoryClonePath = this.generateRepositoryClonePath(repositoryId);

    await fs.rm(repositoryClonePath, { recursive: true, force: true });
  }

  public async deleteAllClones(): Promise<void> {
    await fs.rm(this.clonesDir, { recursive: true, force: true });
  }
}
