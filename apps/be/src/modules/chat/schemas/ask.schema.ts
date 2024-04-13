import { z } from 'zod';

const schema = z.object({
  repositoryId: z.number(),
  question: z.string(),
});

export default schema;
