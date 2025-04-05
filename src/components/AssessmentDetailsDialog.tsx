
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, User, FileText, Clipboard, CheckCircle } from "lucide-react";

type AssessmentDetailsProps = {
  isOpen: boolean;
  onClose: () => void;
  assessment: any; // In a real app, this would be properly typed
};

const AssessmentDetailsDialog = ({ isOpen, onClose, assessment }: AssessmentDetailsProps) => {
  if (!assessment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <span className="text-2xl">{assessment.siteName}</span>
            <Badge variant={assessment.status === "completed" ? "success" : assessment.status === "rejected" ? "destructive" : "outline"}>
              {assessment.status}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Assessment ID: #{assessment.id} | Date: {assessment.date}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)]">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="technical">Technical Details</TabsTrigger>
              <TabsTrigger value="photos">Site Photos</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoCard 
                  icon={<MapPin className="h-5 w-5 text-gray-500" />} 
                  title="Location"
                  details={[
                    { label: "Region", value: assessment.region },
                    { label: "Site Name", value: assessment.siteName },
                    { label: "GPS Coordinates", value: "34.0522° N, 118.2437° W" }
                  ]}
                />
                
                <InfoCard 
                  icon={<User className="h-5 w-5 text-gray-500" />} 
                  title="Personnel"
                  details={[
                    { label: "Engineer", value: assessment.engineer },
                    { label: "Department", value: "Infrastructure" },
                    { label: "Contact", value: "+27 123 456 789" }
                  ]}
                />
                
                <InfoCard 
                  icon={<Calendar className="h-5 w-5 text-gray-500" />} 
                  title="Timeline"
                  details={[
                    { label: "Assessment Date", value: assessment.date },
                    { label: "Submission Time", value: "14:30" },
                    { label: "Last Updated", value: "2025-04-01" }
                  ]}
                />
                
                <InfoCard 
                  icon={<CheckCircle className="h-5 w-5 text-gray-500" />} 
                  title="Status Information"
                  details={[
                    { label: "Current Status", value: assessment.status },
                    { label: "Approval Date", value: assessment.status === "completed" ? "2025-04-02" : "Pending" },
                    { label: "Work Order", value: `WO-${assessment.id}-2025` }
                  ]}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="technical" className="space-y-4 py-4">
              <div className="grid grid-cols-1 gap-4">
                <InfoCard 
                  icon={<Clipboard className="h-5 w-5 text-gray-500" />} 
                  title="Technical Specifications"
                  details={[
                    { label: "Site Type", value: "Substation" },
                    { label: "Equipment Type", value: "Transmission" },
                    { label: "Power Capacity", value: "500 MW" },
                    { label: "Area Size", value: "2.5 hectares" },
                    { label: "Network Integration", value: "High Voltage Grid" },
                    { label: "Security Level", value: "Level 3" }
                  ]}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoCard 
                    icon={<FileText className="h-5 w-5 text-gray-500" />} 
                    title="Infrastructure Assessment"
                    details={[
                      { label: "Foundation Status", value: "Good" },
                      { label: "Building Integrity", value: "Excellent" },
                      { label: "Access Roads", value: "Requires maintenance" },
                      { label: "Perimeter Security", value: "Adequate" }
                    ]}
                  />
                  
                  <InfoCard 
                    icon={<FileText className="h-5 w-5 text-gray-500" />} 
                    title="Equipment Assessment"
                    details={[
                      { label: "Transformers", value: "Operational" },
                      { label: "Control Systems", value: "Upgrades needed" },
                      { label: "Circuit Breakers", value: "Good condition" },
                      { label: "Backup Generators", value: "Maintenance required" }
                    ]}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="photos" className="py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PhotoCard title="Building Exterior" timestamp="2025-04-01 09:15" />
                <PhotoCard title="Control Room" timestamp="2025-04-01 10:22" />
                <PhotoCard title="Transformer Area" timestamp="2025-04-01 11:05" />
                <PhotoCard title="Security Perimeter" timestamp="2025-04-01 11:43" />
              </div>
            </TabsContent>
            
            <TabsContent value="notes" className="py-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Engineer's Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 whitespace-pre-line">
                    The site inspection for {assessment.siteName} was completed on {assessment.date}. The overall condition of the facility is good, with some minor maintenance issues identified.
                    
                    Key observations:
                    - Main transformer is operating within normal parameters
                    - Control systems need firmware updates within next 3 months
                    - Perimeter fencing has two sections requiring repair on the western boundary
                    - Backup generator tested successfully but is due for scheduled maintenance
                    
                    Recommendations:
                    1. Schedule control system updates for next month
                    2. Repair perimeter fencing within 2 weeks
                    3. Perform preventative maintenance on backup generator
                    4. Implement improved drainage system near the southern access road
                    
                    This site is critical to the regional power distribution network and should be prioritized for the recommended improvements.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

// Helper components
const InfoCard = ({ 
  icon, 
  title, 
  details 
}: { 
  icon: React.ReactNode, 
  title: string, 
  details: { label: string, value: string }[] 
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <dl className="divide-y divide-gray-100">
          {details.map((detail, index) => (
            <div key={index} className="py-1 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-500">{detail.label}</dt>
              <dd className="text-sm text-gray-900 sm:col-span-2">{detail.value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
};

const PhotoCard = ({ title, timestamp }: { title: string, timestamp: string }) => {
  return (
    <Card>
      <CardContent className="p-2">
        <div className="aspect-video bg-gray-200 rounded-md flex items-center justify-center mb-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="text-gray-400 text-sm">Site photo placeholder</div>
              </TooltipTrigger>
              <TooltipContent>
                <p>In a real app, this would display the actual site photo.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="text-sm font-medium">{title}</div>
        <div className="text-xs text-gray-500">{timestamp}</div>
      </CardContent>
    </Card>
  );
};

export default AssessmentDetailsDialog;
