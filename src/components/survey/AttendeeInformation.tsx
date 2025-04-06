
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import DrawingCanvas from "@/components/DrawingCanvas";
import { PlusCircle } from "lucide-react";

interface AttendeeInformationProps {
  formData: any;
  onInputChange: (field: string, value: any) => void;
  showAIRecommendations?: boolean;
}

const AttendeeInformation: React.FC<AttendeeInformationProps> = ({
  formData,
  onInputChange,
  showAIRecommendations = false
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-center mb-6">
        <img 
          src="public/lovable-uploads/f3b0d24a-bde2-40c2-84a6-ed83f7605bce.png" 
          alt="BCX Logo" 
          className="h-20 object-contain" 
        />
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Site visit attendee's information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border p-2 text-left">Date</th>
                  <th className="border p-2 text-left">Name</th>
                  <th className="border p-2 text-left">Company</th>
                  <th className="border p-2 text-left">Department</th>
                  <th className="border p-2 text-left">Cellphone</th>
                </tr>
              </thead>
              <tbody>
                {formData.attendees.map((attendee: any, index: number) => (
                  <tr key={index}>
                    <td className="border p-2">
                      <Input
                        type="date"
                        value={attendee.date}
                        onChange={(e) => {
                          const newAttendees = [...formData.attendees];
                          newAttendees[index] = { ...attendee, date: e.target.value };
                          onInputChange("attendees", newAttendees);
                        }}
                      />
                    </td>
                    <td className="border p-2">
                      <Input
                        value={attendee.name}
                        onChange={(e) => {
                          const newAttendees = [...formData.attendees];
                          newAttendees[index] = { ...attendee, name: e.target.value };
                          onInputChange("attendees", newAttendees);
                        }}
                      />
                    </td>
                    <td className="border p-2">
                      <Input
                        value={attendee.company}
                        onChange={(e) => {
                          const newAttendees = [...formData.attendees];
                          newAttendees[index] = { ...attendee, company: e.target.value };
                          onInputChange("attendees", newAttendees);
                        }}
                      />
                    </td>
                    <td className="border p-2">
                      <Input
                        value={attendee.department}
                        onChange={(e) => {
                          const newAttendees = [...formData.attendees];
                          newAttendees[index] = { ...attendee, department: e.target.value };
                          onInputChange("attendees", newAttendees);
                        }}
                      />
                    </td>
                    <td className="border p-2">
                      <Input
                        value={attendee.cellphone}
                        onChange={(e) => {
                          const newAttendees = [...formData.attendees];
                          newAttendees[index] = { ...attendee, cellphone: e.target.value };
                          onInputChange("attendees", newAttendees);
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4"
              onClick={() => {
                const newAttendees = [...formData.attendees, { date: "", name: "", company: "", department: "", cellphone: "" }];
                onInputChange("attendees", newAttendees);
              }}
            >
              <PlusCircle className="h-4 w-4 mr-2" /> Add Attendee
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Site survey outcome</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="border rounded-md p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                <div className="font-semibold">OEM Contractor</div>
                <div>
                  <Label htmlFor="oemContractorName">Name</Label>
                  <Input
                    id="oemContractorName"
                    value={formData.oemContractor.name}
                    onChange={(e) => onInputChange("oemContractor.name", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="oemContractorDate">Date</Label>
                  <Input
                    id="oemContractorDate"
                    type="date"
                    value={formData.oemContractor.date}
                    onChange={(e) => onInputChange("oemContractor.date", e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex gap-8 items-center mb-2">
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="oemContractorAccepted"
                    checked={formData.oemContractor.accepted}
                    onCheckedChange={(checked) => {
                      onInputChange("oemContractor.accepted", checked);
                    }}
                  />
                  <Label htmlFor="oemContractorAccepted">Accepted</Label>
                </div>
                
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="oemContractorRejected"
                    checked={!formData.oemContractor.accepted}
                    onCheckedChange={(checked) => {
                      onInputChange("oemContractor.accepted", !checked);
                    }}
                  />
                  <Label htmlFor="oemContractorRejected">Rejected</Label>
                </div>
              </div>
              
              <div>
                <Label htmlFor="oemContractorComments">Comments</Label>
                <Textarea
                  id="oemContractorComments"
                  value={formData.oemContractor.comments}
                  onChange={(e) => onInputChange("oemContractor.comments", e.target.value)}
                  rows={2}
                />
              </div>
              
              <div>
                <Label htmlFor="oemContractorSignature">Signature</Label>
                <div className="mt-2">
                  <DrawingCanvas
                    onSave={(dataUrl) => onInputChange("oemContractor.signature", dataUrl)}
                    initialValue={formData.oemContractor.signature}
                  />
                </div>
              </div>
            </div>
            
            <div className="border rounded-md p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                <div className="font-semibold">OEM Engineer</div>
                <div>
                  <Label htmlFor="oemEngineerName">Name</Label>
                  <Input
                    id="oemEngineerName"
                    value={formData.oemEngineer.name}
                    onChange={(e) => onInputChange("oemEngineer.name", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="oemEngineerDate">Date</Label>
                  <Input
                    id="oemEngineerDate"
                    type="date"
                    value={formData.oemEngineer.date}
                    onChange={(e) => onInputChange("oemEngineer.date", e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex gap-8 items-center mb-2">
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="oemEngineerAccepted"
                    checked={formData.oemEngineer.accepted}
                    onCheckedChange={(checked) => {
                      onInputChange("oemEngineer.accepted", checked);
                    }}
                  />
                  <Label htmlFor="oemEngineerAccepted">Accepted</Label>
                </div>
                
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="oemEngineerRejected"
                    checked={!formData.oemEngineer.accepted}
                    onCheckedChange={(checked) => {
                      onInputChange("oemEngineer.accepted", !checked);
                    }}
                  />
                  <Label htmlFor="oemEngineerRejected">Rejected</Label>
                </div>
              </div>
              
              <div>
                <Label htmlFor="oemEngineerComments">Comments</Label>
                <Textarea
                  id="oemEngineerComments"
                  value={formData.oemEngineer.comments}
                  onChange={(e) => onInputChange("oemEngineer.comments", e.target.value)}
                  rows={2}
                />
              </div>
              
              <div>
                <Label htmlFor="oemEngineerSignature">Signature</Label>
                <div className="mt-2">
                  <DrawingCanvas
                    onSave={(dataUrl) => onInputChange("oemEngineer.signature", dataUrl)}
                    initialValue={formData.oemEngineer.signature}
                  />
                </div>
              </div>
            </div>
            
            <div className="border rounded-md p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                <div className="font-semibold">Eskom Representative</div>
                <div>
                  <Label htmlFor="eskomRepName">Name</Label>
                  <Input
                    id="eskomRepName"
                    value={formData.eskomRepresentative.name}
                    onChange={(e) => onInputChange("eskomRepresentative.name", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="eskomRepDate">Date</Label>
                  <Input
                    id="eskomRepDate"
                    type="date"
                    value={formData.eskomRepresentative.date}
                    onChange={(e) => onInputChange("eskomRepresentative.date", e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex gap-8 items-center mb-2">
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="eskomRepAccepted"
                    checked={formData.eskomRepresentative.accepted}
                    onCheckedChange={(checked) => {
                      onInputChange("eskomRepresentative.accepted", checked);
                    }}
                  />
                  <Label htmlFor="eskomRepAccepted">Accepted</Label>
                </div>
                
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="eskomRepRejected"
                    checked={!formData.eskomRepresentative.accepted}
                    onCheckedChange={(checked) => {
                      onInputChange("eskomRepresentative.accepted", !checked);
                    }}
                  />
                  <Label htmlFor="eskomRepRejected">Rejected</Label>
                </div>
              </div>
              
              <div>
                <Label htmlFor="eskomRepComments">Comments</Label>
                <Textarea
                  id="eskomRepComments"
                  value={formData.eskomRepresentative.comments}
                  onChange={(e) => onInputChange("eskomRepresentative.comments", e.target.value)}
                  rows={2}
                />
              </div>
              
              <div>
                <Label htmlFor="eskomRepSignature">Signature</Label>
                <div className="mt-2">
                  <DrawingCanvas
                    onSave={(dataUrl) => onInputChange("eskomRepresentative.signature", dataUrl)}
                    initialValue={formData.eskomRepresentative.signature}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendeeInformation;
