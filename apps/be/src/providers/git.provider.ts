import { simpleGit, type SimpleGit } from 'simple-git';

export const GIT_CLIENT = 'GIT_CLIENT';

export const GitProvider = {
  provide: GIT_CLIENT,
  useFactory: () => simpleGit(),
};

export type Git = SimpleGit;
