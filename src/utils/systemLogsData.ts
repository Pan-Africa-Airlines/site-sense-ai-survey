
import { supabase } from "@/integrations/supabase/client";

export interface SystemLog {
  id: string;
  user_id: string;
  user_name: string | null;
  action: string;
  details: any;
  timestamp: string;
}

export const fetchSystemLogs = async (
  page = 1, 
  pageSize = 20, 
  filterUser?: string
) => {
  try {
    console.log("Fetching system logs, page:", page, "pageSize:", pageSize);
    let query = supabase
      .from('system_logs')
      .select('*', { count: 'exact' })
      .order('timestamp', { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1);
      
    if (filterUser) {
      query = query.eq('user_id', filterUser);
    }
    
    const { data, error, count } = await query;
    
    if (error) {
      console.error("Error fetching system logs:", error);
      return { logs: [], count: 0, error };
    }
    
    return { 
      logs: data as SystemLog[], 
      count: count || 0, 
      error: null 
    };
  } catch (error) {
    console.error("Exception fetching system logs:", error);
    return { logs: [], count: 0, error };
  }
};

export const fetchUsers = async () => {
  try {
    // Fetch unique users from the logs table
    const { data, error } = await supabase
      .from('system_logs')
      .select('user_id, user_name')
      .order('user_name', { ascending: true });
      
    if (error) {
      console.error("Error fetching unique users:", error);
      return { users: [], error };
    }
    
    // Convert to a map and then back to an array to remove duplicates
    const userMap = new Map();
    data?.forEach(item => {
      if (!userMap.has(item.user_id)) {
        userMap.set(item.user_id, { id: item.user_id, name: item.user_name });
      }
    });
    
    const uniqueUsers = Array.from(userMap.values());
    
    return { 
      users: uniqueUsers,
      error: null 
    };
  } catch (error) {
    console.error("Exception fetching unique users:", error);
    return { users: [], error };
  }
};
