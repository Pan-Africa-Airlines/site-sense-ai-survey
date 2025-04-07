
import { supabase } from "@/integrations/supabase/client";
import { useCallback } from "react";

export const useAllocationRealtime = (onUpdate: () => void) => {
  const subscribeToRealTimeUpdates = useCallback(() => {
    const channel = supabase
      .channel('allocation-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'engineer_allocations' },
        (payload) => {
          console.log('Real-time update received:', payload);
          onUpdate();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onUpdate]);

  return { subscribeToRealTimeUpdates };
};
