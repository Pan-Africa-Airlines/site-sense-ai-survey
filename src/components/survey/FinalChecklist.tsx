
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
              <div className="bg-white border rounded-lg p-6 shadow-sm max-h-[700px] overflow-y-auto">
                <div className="text-center mb-8">
                  <BCXLogo className="mx-auto h-20 w-auto mb-4" />
                  <h1 className="text-2xl font-bold mb-2">Eskom OT IP/MPLS Network Site Survey</h1>
                  <h2 className="text-xl text-gray-700">{formData.siteName || 'Site Name'} - {formData.siteId || 'Site ID'}</h2>
                  <p className="text-gray-500 mt-2">Survey Date: {formData.date || new Date().toLocaleDateString()}</p>
                </div>
                
                <div className="space-y-6">
                  {/* Site Information Section */}
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold mb-3">1. Site Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p><strong>Site Name:</strong> {formData.siteName || 'Not specified'}</p>
                        <p><strong>Site ID:</strong> {formData.siteId || 'Not specified'}</p>
                        <p><strong>Site Type:</strong> {formData.siteType || 'Not specified'}</p>
                        <p><strong>Region:</strong> {formData.region || 'Not specified'}</p>
                      </div>
                      <div>
                        <p><strong>Building Name:</strong> {formData.buildingName || 'Not specified'}</p>
                        <p><strong>Building Type:</strong> {formData.buildingType || 'Not specified'}</p>
                        <p><strong>Floor Level:</strong> {formData.floorLevel || 'Not specified'}</p>
                        <p><strong>Address:</strong> {formData.address || 'Not specified'}</p>
                        <p><strong>GPS Coordinates:</strong> {formData.gpsCoordinates || 'Not specified'}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <p><strong>Equipment Room Name:</strong> {formData.equipmentRoomName || 'Not specified'}</p>
                      <p><strong>Access Requirements:</strong> {formData.accessRequirements || 'Not specified'}</p>
                      <p><strong>Security Requirements:</strong> {formData.securityRequirements || 'Not specified'}</p>
                      <p><strong>Vehicle Type:</strong> {formData.vehicleType || 'Not specified'}</p>
                    </div>
                    
                    {/* Display building photo and Google Map view if available */}
                    {(formData.buildingPhoto || formData.googleMapView) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        {formData.buildingPhoto && (
                          <div>
                            <p className="font-medium mb-1">Building Photo:</p>
                            <img src={formData.buildingPhoto} alt="Building" className="max-h-40 border rounded" />
                          </div>
                        )}
                        {formData.googleMapView && (
                          <div>
                            <p className="font-medium mb-1">Google Map View:</p>
                            <img src={formData.googleMapView} alt="Map View" className="max-h-40 border rounded" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Site Contacts Section */}
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold mb-3">Site Contacts</h3>
                    {formData.siteContacts.some((contact: any) => contact.name || contact.cellphone || contact.email) ? (
                      <div className="grid grid-cols-1 gap-2">
                        {formData.siteContacts.map((contact: any, index: number) => 
                          (contact.name || contact.cellphone || contact.email) && (
                            <div key={index} className="border-b last:border-0 pb-2 last:pb-0">
                              <p><strong>Name:</strong> {contact.name || 'Not specified'}</p>
                              <p><strong>Cellphone:</strong> {contact.cellphone || 'Not specified'}</p>
                              <p><strong>Email:</strong> {contact.email || 'Not specified'}</p>
                            </div>
                          )
                        )}
                      </div>
                    ) : (
                      <p className="italic text-gray-500">No contacts specified</p>
                    )}
                  </div>
                  
                  {/* Equipment Room General Section */}
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold mb-3">2. Equipment Room Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p><strong>Cable Access:</strong> {formData.cableAccess || 'Not specified'}</p>
                        <p><strong>Room Lighting:</strong> {formData.roomLighting || 'Not specified'}</p>
                        <p><strong>Fire Protection:</strong> {formData.fireProtection || 'Not specified'}</p>
                        <p><strong>Cooling Method:</strong> {formData.coolingMethod || 'Not specified'}</p>
                      </div>
                      <div>
                        <p><strong>Cooling Rating:</strong> {formData.coolingRating || 'Not specified'}</p>
                        <p><strong>Room Temperature:</strong> {formData.roomTemperature || 'Not specified'}</p>
                        <p><strong>Equipment Room Condition:</strong> {formData.equipmentRoomCondition || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Cabinet Space Planning Section */}
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold mb-3">3. Cabinet Space Planning</h3>
                    <p><strong>Number of Routers:</strong> {formData.numberOfRouters || 'Not specified'}</p>
                    
                    {formData.roomLayoutDrawing && (
                      <div className="mt-2">
                        <p className="font-medium mb-1">Room Layout Drawing:</p>
                        <img src={formData.roomLayoutDrawing} alt="Room Layout" className="max-h-40 border rounded" />
                      </div>
                    )}
                    
                    {formData.roomLayoutMarkup && (
                      <div className="mt-2">
                        <p className="font-medium mb-1">Room Layout Markup:</p>
                        <img src={formData.roomLayoutMarkup} alt="Room Layout Markup" className="max-h-40 border rounded" />
                      </div>
                    )}
                  </div>
                  
                  {/* Transport Platforms Section */}
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold mb-3">4. Transport Platforms</h3>
                    {formData.transportLinks.some((link: any) => link.linkType || link.direction || link.capacity) ? (
                      <div className="space-y-3">
                        {formData.transportLinks.map((link: any, index: number) => 
                          (link.linkType || link.direction || link.capacity) && (
                            <div key={index} className="border-b last:border-0 pb-2 last:pb-0">
                              <p><strong>Link {link.linkNumber}:</strong></p>
                              <p><strong>Type:</strong> {link.linkType || 'Not specified'}</p>
                              <p><strong>Direction:</strong> {link.direction || 'Not specified'}</p>
                              <p><strong>Capacity:</strong> {link.capacity || 'Not specified'}</p>
                            </div>
                          )
                        )}
                      </div>
                    ) : (
                      <p className="italic text-gray-500">No transport links specified</p>
                    )}
                  </div>
                  
                  {/* DC Power Section */}
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold mb-3">5. DC Power Distribution</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p><strong>Charger A:</strong> {formData.chargerA || 'Not specified'}</p>
                        <p><strong>Charger B:</strong> {formData.chargerB || 'Not specified'}</p>
                      </div>
                      <div>
                        <p><strong>Power Supply Method:</strong> {formData.powerSupplyMethod || 'Not specified'}</p>
                        <p><strong>Cable Length:</strong> {formData.cableLength || 'Not specified'}</p>
                      </div>
                    </div>
                    
                    {formData.endOfAisleLayout && (
                      <div className="mt-2">
                        <p className="font-medium mb-1">End of Aisle Layout:</p>
                        <p>{formData.endOfAisleLayout}</p>
                      </div>
                    )}
                    
                    {/* 50V Charger Layout Section */}
                    <div className="mt-3">
                      <p className="font-medium">50V Charger Details:</p>
                      <p><strong>Charger Label:</strong> {formData.chargerDetails?.chargerLabel || 'Not specified'}</p>
                      <p><strong>Charger Type:</strong> {formData.chargerDetails?.chargerType || 'Not specified'}</p>
                      
                      {formData.chargerDetails?.chargerA?.some((circuit: any) => circuit.used) && (
                        <div className="mt-2">
                          <p className="font-medium">Charger A Circuits:</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs mt-1">
                            {formData.chargerDetails.chargerA
                              .filter((circuit: any) => circuit.used)
                              .map((circuit: any, idx: number) => (
                                <div key={idx} className="border-b pb-1">
                                  <p><strong>Circuit {circuit.circuit}:</strong> {circuit.mcbRating || 'No rating'} - {circuit.label || 'No label'}</p>
                                </div>
                              ))
                            }
                          </div>
                        </div>
                      )}
                      
                      {formData.chargerDetails?.chargerB?.some((circuit: any) => circuit.used) && (
                        <div className="mt-2">
                          <p className="font-medium">Charger B Circuits:</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs mt-1">
                            {formData.chargerDetails.chargerB
                              .filter((circuit: any) => circuit.used)
                              .map((circuit: any, idx: number) => (
                                <div key={idx} className="border-b pb-1">
                                  <p><strong>Circuit {circuit.circuit}:</strong> {circuit.mcbRating || 'No rating'} - {circuit.label || 'No label'}</p>
                                </div>
                              ))
                            }
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Show equipment photo thumbnails */}
                  {hasPhotos() && (
                    <div className="border-b pb-4">
                      <h3 className="text-lg font-semibold mb-3">6. Equipment Photos</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-2">
                        {['equipmentRoomPhotos', 'cabinetLocationPhotos', 'powerDistributionPhotos',
                          'transportEquipmentPhotos', 'opticalFramePhotos', 'accessEquipmentPhotos',
                          'cableRoutingPhotos', 'ceilingHVACPhotos'].map(field => 
                          Array.isArray(formData[field]) && formData[field].map((photo: string, photoIdx: number) => 
                            photo && (
                              <div key={`${field}-${photoIdx}`} className="border rounded overflow-hidden">
                                <img src={photo} alt={`${field} ${photoIdx + 1}`} className="w-full h-24 object-cover" />
                              </div>
                            )
                          )
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Optical Distribution Frame Section */}
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold mb-3">7. Optical Distribution Frame</h3>
                    {formData.odfCabinets.some((cabinet: any) => cabinet.direction || cabinet.connectionType || cabinet.cores) ? (
                      <div className="space-y-3">
                        {formData.odfCabinets.map((cabinet: any, index: number) => 
                          (cabinet.direction || cabinet.connectionType || cabinet.cores) && (
                            <div key={index} className="border-b last:border-0 pb-2 last:pb-0">
                              <p><strong>{cabinet.name}:</strong></p>
                              <p><strong>Direction:</strong> {cabinet.direction || 'Not specified'}</p>
                              <p><strong>Connection Type:</strong> {cabinet.connectionType || 'Not specified'}</p>
                              <p><strong>Cores:</strong> {cabinet.cores || 'Not specified'}</p>
                            </div>
                          )
                        )}
                      </div>
                    ) : (
                      <p className="italic text-gray-500">No ODF cabinets specified</p>
                    )}
                  </div>
                  
                  {/* Requirements & Remarks Section */}
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold mb-3">8. Requirements & Remarks</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p><strong>Access & Security:</strong> {formData.accessSecurity || 'Not specified'}</p>
                        <p><strong>Cooling & Ventilation:</strong> {formData.coolingVentilation || 'Not specified'}</p>
                        <p><strong>Flooring Type:</strong> {formData.flooringType || 'Not specified'}</p>
                        <p><strong>Fire Protection:</strong> {formData.fireProt || 'Not specified'}</p>
                      </div>
                      <div>
                        <p><strong>Lighting:</strong> {formData.lighting || 'Not specified'}</p>
                        <p><strong>Roof Type:</strong> {formData.roofType || 'Not specified'}</p>
                        <p><strong>Power Cables:</strong> {formData.powerCables || 'Not specified'}</p>
                      </div>
                    </div>
                    
                    {formData.remarks && (
                      <div className="mt-3">
                        <p className="font-medium">General Remarks:</p>
                        <p className="mt-1 whitespace-pre-line">{formData.remarks}</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Attendee Information Section */}
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold mb-3">9. Attendee Information</h3>
                    {formData.attendees.some((a: any) => a.name || a.company || a.department || a.cellphone) ? (
                      <div className="grid grid-cols-1 gap-2">
                        {formData.attendees.map((attendee: any, index: number) => 
                          (attendee.name || attendee.company || attendee.department || attendee.cellphone) && (
                            <div key={index} className="border-b last:border-0 pb-2 last:pb-0">
                              <p><strong>Date:</strong> {attendee.date || 'Not specified'}</p>
                              <p><strong>Name:</strong> {attendee.name || 'Not specified'}</p>
                              <p><strong>Company:</strong> {attendee.company || 'Not specified'}</p>
                              <p><strong>Department:</strong> {attendee.department || 'Not specified'}</p>
                              <p><strong>Cellphone:</strong> {attendee.cellphone || 'Not specified'}</p>
                            </div>
                          )
                        )}
                      </div>
                    ) : (
                      <p className="italic text-gray-500">No attendees specified</p>
                    )}
                  </div>
                  
                  {/* Survey Outcome Section */}
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold mb-3">10. Survey Outcome & Approval</h3>
                    <div className="grid grid-cols-1 gap-3 text-sm">
                      <div>
                        <p>
                          <strong>OEM Contractor:</strong> {formData.oemContractor.name || 'Not signed'} 
                          <span className={`ml-2 px-2 py-0.5 rounded text-xs ${formData.oemContractor.accepted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {formData.oemContractor.accepted ? 'Accepted' : 'Pending'}
                          </span>
                        </p>
                        {formData.oemContractor.comments && (
                          <p className="ml-4 text-gray-600 italic">{formData.oemContractor.comments}</p>
                        )}
                        {formData.oemContractor.signature && (
                          <div className="mt-1 ml-4">
                            <img src={formData.oemContractor.signature} alt="OEM Contractor Signature" className="h-10 border rounded" />
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <p>
                          <strong>OEM Engineer:</strong> {formData.oemEngineer.name || 'Not signed'}
                          <span className={`ml-2 px-2 py-0.5 rounded text-xs ${formData.oemEngineer.accepted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {formData.oemEngineer.accepted ? 'Accepted' : 'Pending'}
                          </span>
                        </p>
                        {formData.oemEngineer.comments && (
                          <p className="ml-4 text-gray-600 italic">{formData.oemEngineer.comments}</p>
                        )}
                        {formData.oemEngineer.signature && (
                          <div className="mt-1 ml-4">
                            <img src={formData.oemEngineer.signature} alt="OEM Engineer Signature" className="h-10 border rounded" />
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <p>
                          <strong>Eskom Representative:</strong> {formData.eskomRepresentative.name || 'Not signed'}
                          <span className={`ml-2 px-2 py-0.5 rounded text-xs ${formData.eskomRepresentative.accepted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {formData.eskomRepresentative.accepted ? 'Accepted' : 'Pending'}
                          </span>
                        </p>
                        {formData.eskomRepresentative.comments && (
                          <p className="ml-4 text-gray-600 italic">{formData.eskomRepresentative.comments}</p>
                        )}
                        {formData.eskomRepresentative.signature && (
                          <div className="mt-1 ml-4">
                            <img src={formData.eskomRepresentative.signature} alt="Eskom Representative Signature" className="h-10 border rounded" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Room Layout Drawings Section */}
                  {hasDrawings() && (
                    <div className="border-b pb-4">
                      <h3 className="text-lg font-semibold mb-3">11. Room Layout Drawings</h3>
                      <div className="grid grid-cols-1 gap-4 mt-2">
                        {formData.roomLayoutDrawing && (
                          <div>
                            <p className="font-medium mb-1">Room Layout Drawing:</p>
                            <img src={formData.roomLayoutDrawing} alt="Room Layout" className="max-h-40 border rounded" />
                          </div>
                        )}
                        
                        {formData.cabinetLayoutDrawing && (
                          <div>
                            <p className="font-medium mb-1">Cabinet Layout Drawing:</p>
                            <img src={formData.cabinetLayoutDrawing} alt="Cabinet Layout" className="max-h-40 border rounded" />
                          </div>
                        )}
                        
                        {formData.scannedRoomLayout && (
                          <div>
                            <p className="font-medium mb-1">Scanned Room Layout:</p>
                            <img src={formData.scannedRoomLayout} alt="Scanned Room Layout" className="max-h-40 border rounded" />
                          </div>
                        )}
                        
                        {formData.additionalDrawings?.map((drawing: string, idx: number) => 
                          drawing && (
                            <div key={idx}>
                              <p className="font-medium mb-1">Additional Drawing {idx + 1}:</p>
                              <img src={drawing} alt={`Additional Drawing ${idx + 1}`} className="max-h-40 border rounded" />
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Final Notes Section */}
                  {formData.finalNotes && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Final Notes & Recommendations</h3>
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
