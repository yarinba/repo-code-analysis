import { Inject, Injectable } from '@nestjs/common';
import { type DB, DB_CLIENT } from '../../providers/db.provider';

@Injectable()
export class PromptsService {
  private readonly table = 'prompts';

  constructor(@Inject(DB_CLIENT) private readonly db: DB) {}

  public async findHighestRanked(repositoryId: number) {
    const { data } = await this.db
      .from(this.table)
      .select('*')
      .eq('repository_id', repositoryId)
      .order('score', { ascending: false })
      .limit(4);

    return data;
  }

  public async create(repositoryId: number, text: string) {
    const { data } = await this.db
      .from(this.table)
      .insert({ repository_id: repositoryId, text })
      .select();

    return data[0];
  }

  public async update(id: number, action: 'upvote' | 'downvote') {
    const { data } = await this.db
      .from(this.table)
      .select('score')
      .eq('id', id);

    const score = data[0].score + (action === 'upvote' ? 1 : -1);

    const { data: updatedData } = await this.db
      .from(this.table)
      .update({ score })
      .eq('id', id)
      .select();

    return updatedData[0];
  }

  public async attachDefaultPromptsToRepo(repositoryId: number) {
    const prompts = [
      'What is the general purpose of this repository?',
      'What are the main technologies used in this repository?',
      'Explain in detail about one core service of this repository.',
    ];

    const { data } = await this.db
      .from(this.table)
      .insert(prompts.map((text) => ({ repository_id: repositoryId, text })))
      .select();

    return data;
  }
}
