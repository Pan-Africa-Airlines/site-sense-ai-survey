
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, Clock, Calendar, MapPin, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Task {
  id: string;
  title: string;
  location: string;
  dueDate: string;
  status: 'upcoming' | 'in-progress' | 'urgent';
  type: 'assessment' | 'installation';
}

interface EngineerTasksListProps {
  engineerId?: string;
}

const EngineerTasksList: React.FC<EngineerTasksListProps> = ({ engineerId }) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [tasks, setTasks] = React.useState<Task[]>([]);

  React.useEffect(() => {
    // Simulate loading tasks from an API
    const loadTasks = async () => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock data - in a real app, you would fetch this based on engineerId
      setTasks([
        {
          id: '1',
          title: 'Site Assessment - BCX Tower',
          location: 'Johannesburg CBD',
          dueDate: '2025-04-15',
          status: 'upcoming',
          type: 'assessment'
        },
        {
          id: '2',
          title: 'Equipment Installation - Sandton Office',
          location: 'Sandton',
          dueDate: '2025-04-12',
          status: 'urgent',
          type: 'installation'
        },
        {
          id: '3',
          title: 'Network Setup - Pretoria Branch',
          location: 'Pretoria East',
          dueDate: '2025-04-18',
          status: 'in-progress',
          type: 'installation'
        },
        {
          id: '4',
          title: 'Site Survey - Cape Town HQ',
          location: 'Cape Town',
          dueDate: '2025-04-20',
          status: 'upcoming',
          type: 'assessment'
        },
        {
          id: '5',
          title: 'Hardware Upgrade - Durban Office',
          location: 'Durban North',
          dueDate: '2025-04-16',
          status: 'in-progress',
          type: 'installation'
        }
      ]);
      setIsLoading(false);
    };

    loadTasks();
  }, [engineerId]);

  const getStatusBadge = (status: Task['status']) => {
    switch (status) {
      case 'upcoming':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Upcoming</Badge>;
      case 'in-progress':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">In Progress</Badge>;
      case 'urgent':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Urgent</Badge>;
    }
  };

  const getTypeIcon = (type: Task['type']) => {
    switch (type) {
      case 'assessment':
        return <CheckCircle2 className="h-4 w-4 text-blue-500" />;
      case 'installation':
        return <Clock className="h-4 w-4 text-green-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 border rounded-lg">
            <Skeleton className="h-6 w-2/3 mb-2" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div key={task.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getTypeIcon(task.type)}
              <h3 className="font-medium text-gray-800">{task.title}</h3>
            </div>
            {getStatusBadge(task.status)}
          </div>
          
          <div className="mt-2 grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span>{task.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EngineerTasksList;
