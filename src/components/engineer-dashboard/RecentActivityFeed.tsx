
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarCheck, Tool, ClipboardCheck, MapPin, RefreshCw } from "lucide-react";

interface Activity {
  id: string;
  type: 'assessment' | 'installation' | 'update' | 'location';
  description: string;
  time: string;
}

interface RecentActivityFeedProps {
  engineerId?: string;
}

const RecentActivityFeed: React.FC<RecentActivityFeedProps> = ({ engineerId }) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [activities, setActivities] = React.useState<Activity[]>([]);

  React.useEffect(() => {
    // Simulate loading activities from an API
    const loadActivities = async () => {
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Mock data - in a real app, you would fetch this based on engineerId
      setActivities([
        {
          id: '1',
          type: 'assessment',
          description: 'Completed site assessment at BCX Tower',
          time: '2 hours ago'
        },
        {
          id: '2',
          type: 'installation',
          description: 'Installed new equipment at Sandton Office',
          time: '4 hours ago'
        },
        {
          id: '3',
          type: 'update',
          description: 'Updated system at Pretoria Branch',
          time: '1 day ago'
        },
        {
          id: '4',
          type: 'location',
          description: 'Traveled to Cape Town HQ',
          time: '2 days ago'
        },
        {
          id: '5',
          type: 'update',
          description: 'Updated firmware at Durban Office',
          time: '3 days ago'
        }
      ]);
      setIsLoading(false);
    };

    loadActivities();
  }, [engineerId]);

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'assessment':
        return <CalendarCheck className="h-5 w-5 text-blue-500" />;
      case 'installation':
        return <Tool className="h-5 w-5 text-green-500" />;
      case 'update':
        return <RefreshCw className="h-5 w-5 text-purple-500" />;
      case 'location':
        return <MapPin className="h-5 w-5 text-amber-500" />;
      default:
        return <ClipboardCheck className="h-5 w-5 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
            <div className="flex-1">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
      {activities.map((activity) => (
        <div key={activity.id} className="flex gap-3">
          <div className="rounded-full bg-gray-100 p-2 flex-shrink-0">
            {getActivityIcon(activity.type)}
          </div>
          <div>
            <p className="text-sm text-gray-800">{activity.description}</p>
            <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentActivityFeed;
