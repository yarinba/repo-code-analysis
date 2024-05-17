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
      repositories: {
        Row: {
          created_at: string;
          id: number;
          name: string;
          owner: string;
          status: 'EMBEDDING' | 'DONE';
          url: string;
        };
        Insert: {
          created_at?: string;
          id?: never;
          name: string;
          owner: string;
          status?: 'EMBEDDING' | 'DONE';
          url: string;
        };
        Update: {
          created_at?: string;
          id?: never;
          name?: string;
          owner?: string;
          status?: 'EMBEDDING' | 'DONE';
          url?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      hnswhandler: {
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
      vector_avg: {
        Args: {
          '': number[];
        };
        Returns: string;
      };
      vector_dims: {
        Args: {
          '': string;
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
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
