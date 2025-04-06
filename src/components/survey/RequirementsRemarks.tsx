
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import html2pdf from 'html2pdf.js';
import { toast } from "sonner";

interface RequirementsRemarksProps {
  formData: any;
  onInputChange: (field: string, value: any) => void;
  showAIRecommendations?: boolean;
}

const RequirementsRemarks: React.FC<RequirementsRemarksProps> = ({
  formData,
  onInputChange,
  showAIRecommendations = false
}) => {
  const generatePDF = () => {
    const element = document.getElementById('survey-content');
    if (!element) {
      toast.error("Could not find content to export");
      return;
    }

    const opt = {
      margin: 10,
      filename: `Eskom_Site_Survey_${formData.siteName || 'Report'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    toast.info("Generating PDF, please wait...");
    
    html2pdf().from(element).set(opt).save()
      .then(() => {
        toast.success("PDF generated successfully!");
      })
      .catch((error) => {
        console.error("PDF generation failed:", error);
        toast.error("Failed to generate PDF");
      });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-center mb-6">
        <img 
          src="public/lovable-uploads/f3b0d24a-bde2-40c2-84a6-ed83f7605bce.png" 
          alt="BCX Logo" 
          className="h-20 object-contain" 
        />
      </div>
      
      <h2 className="text-xl font-bold border-b pb-2 mb-4">4. INSTALLATION REQUIREMENTS</h2>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border p-2 text-left w-16">Item</th>
                  <th className="border p-2 text-left w-1/3">Description</th>
                  <th className="border p-2 text-left">Remarks</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 text-center">1</td>
                  <td className="border p-2">Access & Security</td>
                  <td className="border p-2">
                    <Textarea
                      value={formData.accessSecurity}
                      onChange={(e) => onInputChange("accessSecurity", e.target.value)}
                      rows={2}
                    />
                  </td>
                </tr>
                
                <tr>
                  <td className="border p-2 text-center">2</td>
                  <td className="border p-2">Cooling & Ventilation</td>
                  <td className="border p-2">
                    <Textarea
                      value={formData.coolingVentilation}
                      onChange={(e) => onInputChange("coolingVentilation", e.target.value)}
                      rows={2}
                    />
                  </td>
                </tr>
                
                <tr>
                  <td className="border p-2 text-center">3</td>
                  <td className="border p-2">Flooring Type</td>
                  <td className="border p-2">
                    <Input
                      value={formData.flooringType}
                      onChange={(e) => onInputChange("flooringType", e.target.value)}
                    />
                  </td>
                </tr>
                
                <tr>
                  <td className="border p-2 text-center">4</td>
                  <td className="border p-2">Fire Protection</td>
                  <td className="border p-2">
                    <Input
                      value={formData.fireProt}
                      onChange={(e) => onInputChange("fireProt", e.target.value)}
                    />
                  </td>
                </tr>
                
                <tr>
                  <td className="border p-2 text-center">5</td>
                  <td className="border p-2">Room Lighting</td>
                  <td className="border p-2">
                    <Input
                      value={formData.lighting}
                      onChange={(e) => onInputChange("lighting", e.target.value)}
                    />
                  </td>
                </tr>
                
                <tr>
                  <td className="border p-2 text-center">6</td>
                  <td className="border p-2">Roof type</td>
                  <td className="border p-2">
                    <Input
                      value={formData.roofType}
                      onChange={(e) => onInputChange("roofType", e.target.value)}
                    />
                  </td>
                </tr>
                
                <tr>
                  <td className="border p-2 text-center">7</td>
                  <td className="border p-2">Power cable(s)</td>
                  <td className="border p-2">
                    <Input
                      value={formData.powerCables}
                      onChange={(e) => onInputChange("powerCables", e.target.value)}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      <h2 className="text-xl font-bold border-b pb-2 mb-4">5. GENERAL REMARKS</h2>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <Textarea
            value={formData.remarks}
            onChange={(e) => onInputChange("remarks", e.target.value)}
            rows={8}
            placeholder="Enter any general remarks or additional observations here..."
          />
        </CardContent>
      </Card>
      
      <div className="pt-4 text-center font-bold text-lg">
        END OF THE DOCUMENT
      </div>
      
      <div className="mt-8 text-right">
        <Button 
          onClick={generatePDF}
          className="flex items-center gap-2 bg-akhanya hover:bg-akhanya-dark"
          type="button"
        >
          <FileDown className="h-4 w-4" />
          Export Completed Survey as PDF
        </Button>
      </div>
      
      {showAIRecommendations && (
        <Card className="bg-blue-50 border-blue-200 mt-8">
          <CardHeader>
            <CardTitle className="text-blue-800 text-base">AI Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-blue-700 space-y-2">
              <p>📝 <strong>Requirements Documentation:</strong> Clearly articulate any special installation requirements or site-specific considerations that installation teams need to be aware of.</p>
              <p>🔄 <strong>Feedback Loop:</strong> Use the remarks section to highlight any discrepancies between site conditions and original plans/expectations.</p>
              <p>⚠️ <strong>Risk Identification:</strong> Document any potential risks or challenges that might affect installation timelines or project success.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RequirementsRemarks;
