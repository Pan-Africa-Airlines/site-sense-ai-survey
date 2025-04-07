
// Utility to convert DB date to display format
export const formatDbDate = (dbDate: string | null): string => {
  if (!dbDate) return "Not scheduled";
  
  try {
    const date = new Date(dbDate);
    return date.toLocaleDateString('en-ZA', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  } catch (error) {
    // If dbDate is already formatted or can't be parsed, return as is
    return dbDate;
  }
};
