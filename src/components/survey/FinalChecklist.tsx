
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface FinalChecklistProps {
  formData: any;
  onInputChange: (field: string, value: any) => void;
  showAIRecommendations?: boolean;
}

const FinalChecklist: React.FC<FinalChecklistProps> = ({
  formData,
  onInputChange,
  showAIRecommendations = false
}) => {
  // We'll add a checklist state to the component
  const [checklist, setChecklist] = React.useState({
    siteInfoComplete: false,
    buildingInfoComplete: false,
    accessProcedureComplete: false,
    siteContactsComplete: false,
    equipmentRoomComplete: false,
    cabinetSpaceComplete: false,
    transportComplete: false,
    powerComplete: false,
    photosComplete: false,
    requirementsComplete: false,
    drawingsComplete: false,
    signaturesComplete: false
  });
  
  const handleChecklistChange = (item: string, checked: boolean) => {
    setChecklist(prev => ({
      ...prev,
      [item]: checked
    }));
  };
  
  // Calculate completion percentage
  const completionPercentage = Object.values(checklist).filter(Boolean).length / Object.values(checklist).length * 100;

  return (
    <div className="space-y-6">
      <div className="flex justify-center mb-6">
        <img 
          src="/lovable-uploads/f3b0d24a-bde2-40c2-84a6-ed83f7605bce.png" 
          alt="BCX Logo" 
          className="h-20 object-contain" 
        />
      </div>
      
      <h2 className="text-xl font-bold border-b pb-2 mb-4">16. Final Checklist</h2>
      
      <Card className="mb-6">
        <CardHeader className="bg-gray-50">
          <CardTitle className="text-base">Survey Completion Progress</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <div 
              className="bg-green-500 h-4 rounded-full" 
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
          <p className="text-right text-sm text-gray-500">{Math.round(completionPercentage)}% Complete</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="siteInfoComplete"
                  checked={checklist.siteInfoComplete}
                  onCheckedChange={(checked) => handleChecklistChange('siteInfoComplete', checked === true)}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="siteInfoComplete" className="font-normal">
                    Site Information Complete
                  </Label>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="buildingInfoComplete"
                  checked={checklist.buildingInfoComplete}
                  onCheckedChange={(checked) => handleChecklistChange('buildingInfoComplete', checked === true)}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="buildingInfoComplete" className="font-normal">
                    Building Information Complete
                  </Label>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="accessProcedureComplete"
                  checked={checklist.accessProcedureComplete}
                  onCheckedChange={(checked) => handleChecklistChange('accessProcedureComplete', checked === true)}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="accessProcedureComplete" className="font-normal">
                    Access Procedure Complete
                  </Label>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="siteContactsComplete"
                  checked={checklist.siteContactsComplete}
                  onCheckedChange={(checked) => handleChecklistChange('siteContactsComplete', checked === true)}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="siteContactsComplete" className="font-normal">
                    Site Contacts Complete
                  </Label>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="equipmentRoomComplete"
                  checked={checklist.equipmentRoomComplete}
                  onCheckedChange={(checked) => handleChecklistChange('equipmentRoomComplete', checked === true)}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="equipmentRoomComplete" className="font-normal">
                    Equipment Room Information Complete
                  </Label>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="cabinetSpaceComplete"
                  checked={checklist.cabinetSpaceComplete}
                  onCheckedChange={(checked) => handleChecklistChange('cabinetSpaceComplete', checked === true)}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="cabinetSpaceComplete" className="font-normal">
                    Cabinet Space Planning Complete
                  </Label>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="transportComplete"
                  checked={checklist.transportComplete}
                  onCheckedChange={(checked) => handleChecklistChange('transportComplete', checked === true)}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="transportComplete" className="font-normal">
                    Transport Platforms Complete
                  </Label>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="powerComplete"
                  checked={checklist.powerComplete}
                  onCheckedChange={(checked) => handleChecklistChange('powerComplete', checked === true)}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="powerComplete" className="font-normal">
                    Power Distribution Complete
                  </Label>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="photosComplete"
                  checked={checklist.photosComplete}
                  onCheckedChange={(checked) => handleChecklistChange('photosComplete', checked === true)}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="photosComplete" className="font-normal">
                    Equipment Photos Complete
                  </Label>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="requirementsComplete"
                  checked={checklist.requirementsComplete}
                  onCheckedChange={(checked) => handleChecklistChange('requirementsComplete', checked === true)}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="requirementsComplete" className="font-normal">
                    Requirements & Remarks Complete
                  </Label>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="drawingsComplete"
                  checked={checklist.drawingsComplete}
                  onCheckedChange={(checked) => handleChecklistChange('drawingsComplete', checked === true)}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="drawingsComplete" className="font-normal">
                    Room Layout Drawings Complete
                  </Label>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="signaturesComplete"
                  checked={checklist.signaturesComplete}
                  onCheckedChange={(checked) => handleChecklistChange('signaturesComplete', checked === true)}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="signaturesComplete" className="font-normal">
                    All Required Signatures Obtained
                  </Label>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="bg-gray-50">
          <CardTitle className="text-base">Final Notes</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <Label htmlFor="finalNotes">Additional Notes & Recommendations</Label>
            <Textarea
              id="finalNotes"
              value={formData.finalNotes || ""}
              onChange={(e) => onInputChange("finalNotes", e.target.value)}
              className="min-h-[200px]"
              placeholder="Enter any final notes, recommendations, or follow-up actions required..."
            />
          </div>
        </CardContent>
      </Card>
      
      {showAIRecommendations && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800 text-base">AI Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-blue-700 space-y-2">
              <p>🔍 <strong>Double Check:</strong> Review all sections before finalizing the survey report, especially technical specifications.</p>
              <p>📅 <strong>Follow-up Schedule:</strong> Document any agreed follow-up actions with specific timelines.</p>
              <p>📋 <strong>Assign Responsibilities:</strong> Clearly note who is responsible for addressing any outstanding issues.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FinalChecklist;
