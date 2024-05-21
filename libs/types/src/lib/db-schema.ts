type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type DatabaseSchema = {
  public: {
    Tables: {
      documents: {
        Row: {
          content: string | null;
          embedding: string | null;
          id: number;
          metadata: Json | null;
          repository_id: number;
        };
        Insert: {
          content?: string | null;
          embedding?: string | null;
          id?: never;
          metadata?: Json | null;
          repository_id: number;
        };
        Update: {
          content?: string | null;
          embedding?: string | null;
          id?: never;
          metadata?: Json | null;
          repository_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'documents_repository_id_fkey';
            columns: ['repository_id'];
            isOneToOne: false;
            referencedRelation: 'repositories';
            referencedColumns: ['id'];
          },
        ];
      };
      prompts: {
        Row: {
          created_at: string;
          id: number;
          repository_id: number;
          score: number;
          text: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          repository_id: number;
          score?: number;
          text: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          repository_id?: number;
          score?: number;
          text?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'prompts_repository_id_fkey';
            columns: ['repository_id'];
            isOneToOne: false;
            referencedRelation: 'repositories';
            referencedColumns: ['id'];
          },
        ];
      };
      repositories: {
        Row: {
          created_at: string;
          id: number;
          name: string;
          owner: string;
          status: DatabaseSchema['public']['Enums']['repo_status'];
          url: string;
        };
        Insert: {
          created_at?: string;
          id?: never;
          name: string;
          owner: string;
          status?: DatabaseSchema['public']['Enums']['repo_status'];
          url: string;
        };
        Update: {
          created_at?: string;
          id?: never;
          name?: string;
          owner?: string;
          status?: DatabaseSchema['public']['Enums']['repo_status'];
          url?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      binary_quantize:
        | {
            Args: {
              '': string;
            };
            Returns: unknown;
          }
        | {
            Args: {
              '': unknown;
            };
            Returns: unknown;
          };
      halfvec_avg: {
        Args: {
          '': number[];
        };
        Returns: unknown;
      };
      halfvec_out: {
        Args: {
          '': unknown;
        };
        Returns: unknown;
      };
      halfvec_send: {
        Args: {
          '': unknown;
        };
        Returns: string;
      };
      halfvec_typmod_in: {
        Args: {
          '': unknown[];
        };
        Returns: number;
      };
      hnsw_bit_support: {
        Args: {
          '': unknown;
        };
        Returns: unknown;
      };
      hnsw_halfvec_support: {
        Args: {
          '': unknown;
        };
        Returns: unknown;
      };
      hnsw_sparsevec_support: {
        Args: {
          '': unknown;
        };
        Returns: unknown;
      };
      hnswhandler: {
        Args: {
          '': unknown;
        };
        Returns: unknown;
      };
      ivfflat_bit_support: {
        Args: {
          '': unknown;
        };
        Returns: unknown;
      };
      ivfflat_halfvec_support: {
        Args: {
          '': unknown;
        };
        Returns: unknown;
      };
      ivfflathandler: {
        Args: {
          '': unknown;
        };
        Returns: unknown;
      };
      l2_norm:
        | {
            Args: {
              '': unknown;
            };
            Returns: number;
          }
        | {
            Args: {
              '': unknown;
            };
            Returns: number;
          };
      l2_normalize:
        | {
            Args: {
              '': string;
            };
            Returns: string;
          }
        | {
            Args: {
              '': unknown;
            };
            Returns: unknown;
          }
        | {
            Args: {
              '': unknown;
            };
            Returns: unknown;
          };
      match_documents: {
        Args: {
          query_embedding: string;
          match_count?: number;
          filter?: Json;
        };
        Returns: {
          id: number;
          content: string;
          metadata: Json;
          embedding: Json;
          similarity: number;
        }[];
      };
      sparsevec_out: {
        Args: {
          '': unknown;
        };
        Returns: unknown;
      };
      sparsevec_send: {
        Args: {
          '': unknown;
        };
        Returns: string;
      };
      sparsevec_typmod_in: {
        Args: {
          '': unknown[];
        };
        Returns: number;
      };
      vector_avg: {
        Args: {
          '': number[];
        };
        Returns: string;
      };
      vector_dims:
        | {
            Args: {
              '': string;
            };
            Returns: number;
          }
        | {
            Args: {
              '': unknown;
            };
            Returns: number;
          };
      vector_norm: {
        Args: {
          '': string;
        };
        Returns: number;
      };
      vector_out: {
        Args: {
          '': string;
        };
        Returns: unknown;
      };
      vector_send: {
        Args: {
          '': string;
        };
        Returns: string;
      };
      vector_typmod_in: {
        Args: {
          '': unknown[];
        };
        Returns: number;
      };
    };
    Enums: {
      repo_status: 'EMBEDDING' | 'DONE';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = DatabaseSchema[Extract<keyof DatabaseSchema, 'public'>];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof DatabaseSchema },
  TableName extends PublicTableNameOrOptions extends {
    schema: keyof DatabaseSchema;
  }
    ? keyof (DatabaseSchema[PublicTableNameOrOptions['schema']]['Tables'] &
        DatabaseSchema[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof DatabaseSchema }
  ? (DatabaseSchema[PublicTableNameOrOptions['schema']]['Tables'] &
      DatabaseSchema[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
        PublicSchema['Views'])
    ? (PublicSchema['Tables'] &
        PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof DatabaseSchema },
  TableName extends PublicTableNameOrOptions extends {
    schema: keyof DatabaseSchema;
  }
    ? keyof DatabaseSchema[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof DatabaseSchema }
  ? DatabaseSchema[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof DatabaseSchema },
  TableName extends PublicTableNameOrOptions extends {
    schema: keyof DatabaseSchema;
  }
    ? keyof DatabaseSchema[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof DatabaseSchema }
  ? DatabaseSchema[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof DatabaseSchema },
  EnumName extends PublicEnumNameOrOptions extends {
    schema: keyof DatabaseSchema;
  }
    ? keyof DatabaseSchema[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof DatabaseSchema }
  ? DatabaseSchema[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never;
