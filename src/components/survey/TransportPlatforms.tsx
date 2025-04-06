
import React from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2 } from "lucide-react";

interface TransportPlatformsProps {
  formData: any;
  onInputChange: (field: string, value: any) => void;
  showAIRecommendations?: boolean;
}

const TransportPlatforms: React.FC<TransportPlatformsProps> = ({
  formData,
  onInputChange,
  showAIRecommendations = false
}) => {
  const addTransportLink = () => {
    const newLinks = [
      ...formData.transportLinks,
      { linkNumber: `${formData.transportLinks.length + 1}`, linkType: "", direction: "", capacity: "" }
    ];
    onInputChange("transportLinks", newLinks);
  };
  
  const removeTransportLink = (index: number) => {
    if (formData.transportLinks.length <= 1) return;
    
    const newLinks = [...formData.transportLinks];
    newLinks.splice(index, 1);
    
    // Renumber the links
    newLinks.forEach((link, i) => {
      link.linkNumber = `${i + 1}`;
    });
    
    onInputChange("transportLinks", newLinks);
  };
  
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-center mb-6">
        <img 
          src="/lovable-uploads/f3b0d24a-bde2-40c2-84a6-ed83f7605bce.png" 
          alt="BCX Logo" 
          className="h-16 object-contain" 
        />
      </div>
      
      <h2 className="text-xl font-bold border-b pb-2 mb-6 text-akhanya">3.2. Transport Platforms</h2>
      
      <Card className="mb-6 shadow-md">
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border p-3 text-left font-medium text-gray-700">Subject</th>
                  <th className="border p-3 text-left font-medium text-gray-700">Description</th>
                  <th className="border p-3 text-center font-medium text-gray-700 w-16">Actions</th>
                </tr>
              </thead>
              <tbody>
                {formData.transportLinks.map((link: any, index: number) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="border p-3">
                      Link {link.linkNumber} – Link Type, Direction, Capacity
                    </td>
                    <td className="border p-3">
                      <div className="grid grid-cols-3 gap-3">
                        <Input
                          placeholder="Link Type"
                          value={link.linkType}
                          onChange={(e) => {
                            const newLinks = [...formData.transportLinks];
                            newLinks[index] = { ...link, linkType: e.target.value };
                            onInputChange("transportLinks", newLinks);
                          }}
                          className="bg-white"
                        />
                        <Input
                          placeholder="Direction"
                          value={link.direction}
                          onChange={(e) => {
                            const newLinks = [...formData.transportLinks];
                            newLinks[index] = { ...link, direction: e.target.value };
                            onInputChange("transportLinks", newLinks);
                          }}
                          className="bg-white"
                        />
                        <Input
                          placeholder="Capacity"
                          value={link.capacity}
                          onChange={(e) => {
                            const newLinks = [...formData.transportLinks];
                            newLinks[index] = { ...link, capacity: e.target.value };
                            onInputChange("transportLinks", newLinks);
                          }}
                          className="bg-white"
                        />
                      </div>
                    </td>
                    <td className="border p-3 text-center">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => removeTransportLink(index)}
                        disabled={formData.transportLinks.length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-4 bg-white"
              onClick={addTransportLink}
            >
              <PlusCircle className="h-4 w-4 mr-2" /> Add Transport Link
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {showAIRecommendations && (
        <Card className="bg-blue-50 border-blue-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-blue-800 text-base">AI Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-blue-700 space-y-2">
              <p>🔄 <strong>Link Capacity:</strong> Ensure the capacity specified is sufficient for current traffic plus expected growth (typically add 30% overhead for future needs).</p>
              <p>🔌 <strong>Interface Types:</strong> Document the physical interface types (e.g., Ethernet, SDH, Fiber, etc.) for each link to ensure proper equipment planning.</p>
              <p>📊 <strong>Direction Specification:</strong> For clarity, use specific site names or IDs when documenting direction (e.g., "From Site X to Site Y").</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TransportPlatforms;
