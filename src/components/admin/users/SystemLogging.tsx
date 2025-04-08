
import { supabase } from "@/integrations/supabase/client";

interface SystemLoggingProps {
  userId: string | number;
  userName: string;
  action: string;
  details: any;
}

export const logSystemAction = async ({ userId, userName, action, details }: SystemLoggingProps) => {
  try {
    await supabase
      .from("system_logs")
      .insert({
        user_id: userId.toString(),
        user_name: userName,
        action,
        details
      });
  } catch (error) {
    console.error("Error logging action:", error);
    // We don't throw here as logging shouldn't break the main flow
  }
};
