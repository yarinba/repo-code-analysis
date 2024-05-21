import { type DatabaseSchema } from './db-schema';

export type TRepository =
  DatabaseSchema['public']['Tables']['repositories']['Row'];
