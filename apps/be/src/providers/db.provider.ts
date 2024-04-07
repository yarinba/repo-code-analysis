import { type Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { type SupabaseClient, createClient } from '@supabase/supabase-js';
import { type DatabaseSchema } from '../db/schema';

export const DB_CLIENT = 'DB_CLIENT';

export const DBProvider: Provider = {
  provide: DB_CLIENT,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const supabaseKey = configService.getOrThrow('SUPABASE_PRIVATE_KEY');
    const supabaseUrl = configService.getOrThrow('SUPABASE_URL');

    return createClient(supabaseUrl, supabaseKey);
  },
};

export type DB = SupabaseClient<DatabaseSchema>;
