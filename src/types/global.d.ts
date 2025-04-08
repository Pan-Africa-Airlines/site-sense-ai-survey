
// This file extends database types for TypeScript

import { Database } from '@/integrations/supabase/types';

declare global {
  type Tables = Database['public']['Tables'];
  
  // Extend the definition to include system_logs
  namespace Database {
    interface PublicSchema {
      Tables: {
        system_logs: {
          Row: {
            id: string;
            user_id: string;
            user_name: string | null;
            action: string;
            details: any;
            timestamp: string;
          };
          Insert: {
            id?: string;
            user_id: string;
            user_name?: string | null;
            action: string;
            details?: any;
            timestamp?: string;
          };
          Update: {
            id?: string;
            user_id?: string;
            user_name?: string | null;
            action?: string;
            details?: any;
            timestamp?: string;
          };
        };
      };
    }
  }
}
