
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import BCXLogo from "@/components/ui/logo";
import { FileText, Image, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  // State for the checklist items
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
  
  // State for the current preview tab
  const [previewTab, setPreviewTab] = useState("checklist");
  
  const handleChecklistChange = (item: string, checked: boolean) => {
    setChecklist(prev => ({
      ...prev,
      [item]: checked
    }));
  };
  
  // Calculate completion percentage
  const completionPercentage = Object.values(checklist).filter(Boolean).length / Object.values(checklist).length * 100;
  
  // Helper functions to check if there are any images or drawings
  const hasPhotos = () => {
    const photoFields = [
      'buildingPhoto', 'googleMapView', 
      'equipmentRoomPhotos', 'cabinetLocationPhotos', 'powerDistributionPhotos',
      'transportEquipmentPhotos', 'opticalFramePhotos', 'accessEquipmentPhotos',
      'cableRoutingPhotos', 'ceilingHVACPhotos'
    ];
    
    return photoFields.some(field => {
      if (Array.isArray(formData[field])) {
        return formData[field].some((url: string) => url && url.trim() !== '');
      }
      return formData[field] && formData[field].trim() !== '';
    });
  };
  
  const hasDrawings = () => {
    const drawingFields = [
      'roomLayoutDrawing', 'cabinetLayoutDrawing', 'scannedRoomLayout'
    ];
    
    return drawingFields.some(field => 
      formData[field] && formData[field].trim() !== ''
    ) || (formData.additionalDrawings && formData.additionalDrawings.some((url: string) => url && url.trim() !== ''));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center mb-6">
        <BCXLogo className="h-20 w-auto" />
      </div>
      
      <h2 className="text-xl font-bold border-b pb-2 mb-4">12. Final Checklist & Document Preview</h2>
      
      <Tabs value={previewTab} onValueChange={setPreviewTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="checklist">Checklist</TabsTrigger>
          <TabsTrigger value="preview">Document Preview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="checklist" className="mt-0">
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
        </TabsContent>
        
        <TabsContent value="preview" className="mt-0">
          <Card className="mb-6">
            <CardHeader className="bg-gray-50">
              <CardTitle className="text-base">Document Preview</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="bg-white border rounded-lg p-6 shadow-sm">
                <div className="text-center mb-8">
                  <BCXLogo className="mx-auto h-20 w-auto mb-4" />
                  <h1 className="text-2xl font-bold mb-2">Eskom OT IP/MPLS Network Site Survey</h1>
                  <h2 className="text-xl text-gray-700">{formData.siteName || 'Site Name'} - {formData.siteId || 'Site ID'}</h2>
                  <p className="text-gray-500 mt-2">Survey Date: {formData.date || new Date().toLocaleDateString()}</p>
                </div>
                
                <div className="space-y-6">
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-medium mb-3">1. Site Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p><strong>Site Name:</strong> {formData.siteName || 'Not specified'}</p>
                        <p><strong>Site ID:</strong> {formData.siteId || 'Not specified'}</p>
                        <p><strong>Site Type:</strong> {formData.siteType || 'Not specified'}</p>
                      </div>
                      <div>
                        <p><strong>Region:</strong> {formData.region || 'Not specified'}</p>
                        <p><strong>Building:</strong> {formData.buildingName || 'Not specified'}</p>
                        <p><strong>Address:</strong> {formData.address || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-medium mb-3">2. Attendee Information</h3>
                    <div className="text-sm">
                      {formData.attendees.some((a: any) => a.name) ? (
                        <div className="grid grid-cols-1 gap-2">
                          {formData.attendees.map((attendee: any, index: number) => 
                            attendee.name && (
                              <p key={index}>
                                <strong>{attendee.name}</strong>
                                {attendee.company && ` (${attendee.company})`}
                                {attendee.cellphone && ` - ${attendee.cellphone}`}
                              </p>
                            )
                          )}
                        </div>
                      ) : (
                        <p className="italic text-gray-500">No attendees specified</p>
                      )}
                    </div>
                  </div>
                  
                  {hasPhotos() && (
                    <div className="border-b pb-4">
                      <h3 className="text-lg font-medium mb-3">Site & Equipment Photos</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Image className="h-4 w-4" />
                        <p>{
                          (() => {
                            let count = 0;
                            ['buildingPhoto', 'googleMapView'].forEach(field => {
                              if (formData[field]) count++;
                            });
                            
                            ['equipmentRoomPhotos', 'cabinetLocationPhotos', 'powerDistributionPhotos',
                            'transportEquipmentPhotos', 'opticalFramePhotos', 'accessEquipmentPhotos',
                            'cableRoutingPhotos', 'ceilingHVACPhotos'].forEach(field => {
                              if (Array.isArray(formData[field])) {
                                count += formData[field].filter((url: string) => url && url.trim() !== '').length;
                              }
                            });
                            
                            return `${count} photos included in full report`;
                          })()
                        }</p>
                      </div>
                    </div>
                  )}
                  
                  {hasDrawings() && (
                    <div className="border-b pb-4">
                      <h3 className="text-lg font-medium mb-3">Equipment & Room Layout Drawings</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FileText className="h-4 w-4" />
                        <p>{
                          (() => {
                            let count = 0;
                            ['roomLayoutDrawing', 'cabinetLayoutDrawing', 'scannedRoomLayout'].forEach(field => {
                              if (formData[field]) count++;
                            });
                            
                            if (Array.isArray(formData.additionalDrawings)) {
                              count += formData.additionalDrawings.filter((url: string) => url && url.trim() !== '').length;
                            }
                            
                            return `${count} drawings included in full report`;
                          })()
                        }</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-medium mb-3">Survey Approval Status</h3>
                    <div className="grid grid-cols-1 gap-3 text-sm">
                      <div>
                        <p>
                          <strong>OEM Contractor:</strong> {formData.oemContractor.name || 'Not signed'} 
                          <span className={`ml-2 px-2 py-0.5 rounded text-xs ${formData.oemContractor.accepted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {formData.oemContractor.accepted ? 'Accepted' : 'Pending'}
                          </span>
                        </p>
                      </div>
                      <div>
                        <p>
                          <strong>OEM Engineer:</strong> {formData.oemEngineer.name || 'Not signed'}
                          <span className={`ml-2 px-2 py-0.5 rounded text-xs ${formData.oemEngineer.accepted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {formData.oemEngineer.accepted ? 'Accepted' : 'Pending'}
                          </span>
                        </p>
                      </div>
                      <div>
                        <p>
                          <strong>Eskom Representative:</strong> {formData.eskomRepresentative.name || 'Not signed'}
                          <span className={`ml-2 px-2 py-0.5 rounded text-xs ${formData.eskomRepresentative.accepted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {formData.eskomRepresentative.accepted ? 'Accepted' : 'Pending'}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {formData.finalNotes && (
                    <div>
                      <h3 className="text-lg font-medium mb-3">Final Notes & Recommendations</h3>
                      <p className="text-sm whitespace-pre-line">{formData.finalNotes}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-center mt-6">
                <Button className="flex items-center gap-2 bg-akhanya hover:bg-akhanya-dark">
                  <Printer className="h-4 w-4" />
                  Print Preview
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
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
