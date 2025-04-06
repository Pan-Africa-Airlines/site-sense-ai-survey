
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface SurveyOutcomeProps {
  formData: any;
  onInputChange: (field: string, value: any) => void;
  showAIRecommendations?: boolean;
}

const SurveyOutcome: React.FC<SurveyOutcomeProps> = ({
  formData,
  onInputChange,
  showAIRecommendations = false
}) => {
  const handleSignatureChange = (role: 'oemContractor' | 'oemEngineer' | 'eskomRepresentative', field: string, value: any) => {
    onInputChange(`${role}.${field}`, value);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center mb-6">
        <img 
          src="/lovable-uploads/f3b0d24a-bde2-40c2-84a6-ed83f7605bce.png" 
          alt="BCX Logo" 
          className="h-20 object-contain" 
        />
      </div>
      
      <h2 className="text-xl font-bold border-b pb-2 mb-4">14. Survey Outcome</h2>
      
      <div className="grid grid-cols-1 gap-6">
        {/* OEM Contractor */}
        <Card>
          <CardHeader className="bg-gray-50">
            <CardTitle className="text-base">OEM Contractor</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="oemContractorName">Name</Label>
                <Input
                  id="oemContractorName"
                  value={formData.oemContractor.name}
                  onChange={(e) => handleSignatureChange('oemContractor', 'name', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="oemContractorDate">Date</Label>
                <Input
                  id="oemContractorDate"
                  type="date"
                  value={formData.oemContractor.date}
                  onChange={(e) => handleSignatureChange('oemContractor', 'date', e.target.value)}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="oemContractorAccepted"
                  checked={formData.oemContractor.accepted}
                  onCheckedChange={(checked) => handleSignatureChange('oemContractor', 'accepted', checked)}
                />
                <Label htmlFor="oemContractorAccepted" className="font-normal">Site survey accepted</Label>
              </div>
              
              <div>
                <Label htmlFor="oemContractorComments">Comments</Label>
                <Textarea
                  id="oemContractorComments"
                  value={formData.oemContractor.comments}
                  onChange={(e) => handleSignatureChange('oemContractor', 'comments', e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="border-t pt-4 mt-4">
                <Label>Signature</Label>
                <div className="border-2 border-dashed rounded-md p-4 mt-2 min-h-[100px]">
                  {formData.oemContractor.signature ? (
                    <img 
                      src={formData.oemContractor.signature} 
                      alt="Signature" 
                      className="max-h-[100px] mx-auto"
                    />
                  ) : (
                    <p className="text-center text-gray-400">No signature provided</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* OEM Engineer */}
        <Card>
          <CardHeader className="bg-gray-50">
            <CardTitle className="text-base">OEM Engineer</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="oemEngineerName">Name</Label>
                <Input
                  id="oemEngineerName"
                  value={formData.oemEngineer.name}
                  onChange={(e) => handleSignatureChange('oemEngineer', 'name', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="oemEngineerDate">Date</Label>
                <Input
                  id="oemEngineerDate"
                  type="date"
                  value={formData.oemEngineer.date}
                  onChange={(e) => handleSignatureChange('oemEngineer', 'date', e.target.value)}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="oemEngineerAccepted"
                  checked={formData.oemEngineer.accepted}
                  onCheckedChange={(checked) => handleSignatureChange('oemEngineer', 'accepted', checked)}
                />
                <Label htmlFor="oemEngineerAccepted" className="font-normal">Site survey accepted</Label>
              </div>
              
              <div>
                <Label htmlFor="oemEngineerComments">Comments</Label>
                <Textarea
                  id="oemEngineerComments"
                  value={formData.oemEngineer.comments}
                  onChange={(e) => handleSignatureChange('oemEngineer', 'comments', e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="border-t pt-4 mt-4">
                <Label>Signature</Label>
                <div className="border-2 border-dashed rounded-md p-4 mt-2 min-h-[100px]">
                  {formData.oemEngineer.signature ? (
                    <img 
                      src={formData.oemEngineer.signature} 
                      alt="Signature" 
                      className="max-h-[100px] mx-auto"
                    />
                  ) : (
                    <p className="text-center text-gray-400">No signature provided</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Eskom Representative */}
        <Card>
          <CardHeader className="bg-gray-50">
            <CardTitle className="text-base">Eskom Representative</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="eskomRepName">Name</Label>
                <Input
                  id="eskomRepName"
                  value={formData.eskomRepresentative.name}
                  onChange={(e) => handleSignatureChange('eskomRepresentative', 'name', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="eskomRepDate">Date</Label>
                <Input
                  id="eskomRepDate"
                  type="date"
                  value={formData.eskomRepresentative.date}
                  onChange={(e) => handleSignatureChange('eskomRepresentative', 'date', e.target.value)}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="eskomRepAccepted"
                  checked={formData.eskomRepresentative.accepted}
                  onCheckedChange={(checked) => handleSignatureChange('eskomRepresentative', 'accepted', checked)}
                />
                <Label htmlFor="eskomRepAccepted" className="font-normal">Site survey accepted</Label>
              </div>
              
              <div>
                <Label htmlFor="eskomRepComments">Comments</Label>
                <Textarea
                  id="eskomRepComments"
                  value={formData.eskomRepresentative.comments}
                  onChange={(e) => handleSignatureChange('eskomRepresentative', 'comments', e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="border-t pt-4 mt-4">
                <Label>Signature</Label>
                <div className="border-2 border-dashed rounded-md p-4 mt-2 min-h-[100px]">
                  {formData.eskomRepresentative.signature ? (
                    <img 
                      src={formData.eskomRepresentative.signature} 
                      alt="Signature" 
                      className="max-h-[100px] mx-auto"
                    />
                  ) : (
                    <p className="text-center text-gray-400">No signature provided</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {showAIRecommendations && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800 text-base">AI Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-blue-700 space-y-2">
              <p>🖋️ <strong>Digital Signatures:</strong> Consider implementing a digital signature capture for easier sign-off.</p>
              <p>📅 <strong>Schedule Follow-up:</strong> If survey is not accepted, schedule a follow-up meeting to address concerns.</p>
              <p>📝 <strong>Detailed Comments:</strong> Request specific details in comments section if any aspects need improvement.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SurveyOutcome;
