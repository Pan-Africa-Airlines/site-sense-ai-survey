
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import BCXLogo from "@/components/ui/logo";
import ImageCapture from "@/components/ImageCapture";

interface SurveyCoverProps {
  formData: any;
  onInputChange: (field: string, value: any) => void;
  showAIRecommendations?: boolean;
}

const SurveyCover: React.FC<SurveyCoverProps> = ({
  formData,
  onInputChange,
  showAIRecommendations = false
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-center mb-6">
        <BCXLogo className="h-20" />
      </div>
      
      <div className="text-center space-y-4 mb-10">
        <h1 className="text-2xl font-bold uppercase">Eskom OT IP/MPLS Network</h1>
        <h2 className="text-xl font-bold uppercase">Site Survey Report</h2>
      </div>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <table className="w-full border-collapse">
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2 font-semibold w-1/3">Site Name:</td>
                <td className="border border-gray-300 p-2">
                  {formData.siteName}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 font-semibold">Region:</td>
                <td className="border border-gray-300 p-2">
                  {formData.region}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 font-semibold">Date:</td>
                <td className="border border-gray-300 p-2">
                  {formData.date}
                </td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <p className="text-sm font-medium mb-3">Full front view photo of building where IP/MPLS equipment will be situated.</p>
          <div className="border border-gray-300 p-2 min-h-[300px] flex items-center justify-center">
            {formData.buildingPhoto ? (
              <img 
                src={formData.buildingPhoto} 
                alt="Building Photo" 
                className="max-h-[300px] max-w-full object-contain"
              />
            ) : (
              <ImageCapture
                onImageCaptured={(url) => onInputChange("buildingPhoto", url)}
                onCapture={(url) => onInputChange("buildingPhoto", url)}
                capturedImage={formData.buildingPhoto}
                label="Building Photo"
                description="Take a clear photo of the building front"
              />
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-center mb-2">Site visit attendee's information</h3>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2 text-center w-1/6">Date</th>
                <th className="border border-gray-300 p-2 text-center w-1/4">Name</th>
                <th className="border border-gray-300 p-2 text-center w-1/4">Company</th>
                <th className="border border-gray-300 p-2 text-center w-1/6">Department</th>
                <th className="border border-gray-300 p-2 text-center w-1/6">Cellphone</th>
              </tr>
            </thead>
            <tbody>
              {formData.attendees.slice(0, 5).map((attendee: any, index: number) => (
                <tr key={index}>
                  <td className="border border-gray-300 p-2 text-center">{attendee.date}</td>
                  <td className="border border-gray-300 p-2 text-center">{attendee.name}</td>
                  <td className="border border-gray-300 p-2 text-center">{attendee.company}</td>
                  <td className="border border-gray-300 p-2 text-center">{attendee.department}</td>
                  <td className="border border-gray-300 p-2 text-center">{attendee.cellphone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-center mb-2">Site survey outcome</h3>
          <table className="w-full border-collapse">
            <tbody>
              {/* OEM Contractor */}
              <tr>
                <td rowSpan={2} className="border border-gray-300 p-2 text-center font-medium w-1/5">OEM Contractor</td>
                <td className="border border-gray-300 p-2 text-center w-1/4">Name</td>
                <td className="border border-gray-300 p-2 text-center w-1/3">Signature</td>
                <td className="border border-gray-300 p-2 text-center w-1/5">Date</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 text-center">{formData.oemContractor.name}</td>
                <td className="border border-gray-300 p-2 text-center">
                  {formData.oemContractor.signature && (
                    <img 
                      src={formData.oemContractor.signature} 
                      alt="Signature" 
                      className="h-10 mx-auto"
                    />
                  )}
                </td>
                <td className="border border-gray-300 p-2 text-center">{formData.oemContractor.date}</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 w-10">
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 border border-gray-500 ${formData.oemContractor.accepted ? 'bg-black' : 'bg-white'}`}></div>
                    <span>Accepted</span>
                  </div>
                </td>
                <td className="border border-gray-300 p-2 w-10">
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 border border-gray-500 ${!formData.oemContractor.accepted ? 'bg-black' : 'bg-white'}`}></div>
                    <span>Rejected</span>
                  </div>
                </td>
                <td colSpan={2} className="border border-gray-300 p-2">Comments: {formData.oemContractor.comments}</td>
              </tr>
              
              {/* OEM Engineer */}
              <tr>
                <td rowSpan={2} className="border border-gray-300 p-2 text-center font-medium">OEM Engineer</td>
                <td className="border border-gray-300 p-2 text-center">Name</td>
                <td className="border border-gray-300 p-2 text-center">Signature</td>
                <td className="border border-gray-300 p-2 text-center">Date</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 text-center">{formData.oemEngineer.name}</td>
                <td className="border border-gray-300 p-2 text-center">
                  {formData.oemEngineer.signature && (
                    <img 
                      src={formData.oemEngineer.signature} 
                      alt="Signature" 
                      className="h-10 mx-auto"
                    />
                  )}
                </td>
                <td className="border border-gray-300 p-2 text-center">{formData.oemEngineer.date}</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 border border-gray-500 ${formData.oemEngineer.accepted ? 'bg-black' : 'bg-white'}`}></div>
                    <span>Accepted</span>
                  </div>
                </td>
                <td className="border border-gray-300 p-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 border border-gray-500 ${!formData.oemEngineer.accepted ? 'bg-black' : 'bg-white'}`}></div>
                    <span>Rejected</span>
                  </div>
                </td>
                <td colSpan={2} className="border border-gray-300 p-2">Comments: {formData.oemEngineer.comments}</td>
              </tr>
              
              {/* Eskom Representative */}
              <tr>
                <td rowSpan={2} className="border border-gray-300 p-2 text-center font-medium">Eskom Representative</td>
                <td className="border border-gray-300 p-2 text-center">Name</td>
                <td className="border border-gray-300 p-2 text-center">Signature</td>
                <td className="border border-gray-300 p-2 text-center">Date</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 text-center">{formData.eskomRepresentative.name}</td>
                <td className="border border-gray-300 p-2 text-center">
                  {formData.eskomRepresentative.signature && (
                    <img 
                      src={formData.eskomRepresentative.signature} 
                      alt="Signature" 
                      className="h-10 mx-auto"
                    />
                  )}
                </td>
                <td className="border border-gray-300 p-2 text-center">{formData.eskomRepresentative.date}</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 border border-gray-500 ${formData.eskomRepresentative.accepted ? 'bg-black' : 'bg-white'}`}></div>
                    <span>Accepted</span>
                  </div>
                </td>
                <td className="border border-gray-300 p-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 border border-gray-500 ${!formData.eskomRepresentative.accepted ? 'bg-black' : 'bg-white'}`}></div>
                    <span>Rejected</span>
                  </div>
                </td>
                <td colSpan={2} className="border border-gray-300 p-2">Comments: {formData.eskomRepresentative.comments}</td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-blue-700 mb-4">Contents</h3>
          <div className="space-y-1 text-sm">
            <p><span className="font-medium">1. SITE INFORMATION & LOCATION</span> ...................................................................................................... 4</p>
            <p className="ml-4">1.1. Site Identification......................................................................................................................................... 4</p>
            <p className="ml-4">1.2. Eskom Site Location.................................................................................................................................... 4</p>
            <p className="ml-4">1.3. Equipment Location..................................................................................................................................... 5</p>
            <p className="ml-4">1.4. Access Procedure........................................................................................................................................ 5</p>
            <p className="ml-4">1.5. Eskom site owner contact details .............................................................................................................. 5</p>
            <p><span className="font-medium">2. EQUIPMENT ROOM (GENERAL)</span> ..................................................................................................... 6</p>
            <p><span className="font-medium">3. DETAILED SITE RECORDS</span> .................................................................................................................. 6</p>
            <p className="ml-4">3.1. Equipment Cabinet Space Planning........................................................................................................ 6</p>
            <p className="ml-4">3.2. Transport Platforms................................................................................................................................... 7</p>
            <p className="ml-4">3.3. 50V DC Power Distribution .................................................................................................................... 7</p>
            <p className="ml-4">3.4. Eskom equipment room photos ............................................................................................................. 7</p>
            <p className="ml-4">3.5. New cabinet location photos.................................................................................................................. 8</p>
            <p className="ml-4">3.6. DC Power Distribution photos .............................................................................................................. 8</p>
            <p className="ml-4">3.7. Transport Equipment photos (Close-Ups) .......................................................................................... 9</p>
            <p className="ml-4">3.8. Optical Distribution Frame photos (Close-Ups), if applicable........................................................... 9</p>
            <p className="ml-4">3.9. Access Equipment photos (Close-Ups) ............................................................................................ 10</p>
            <p className="ml-4">3.10. Cable routing (overhead/underfloor/Both)................................................................................... 10</p>
            <p className="ml-4">3.11. Equipment Room ceiling & HVAC photos ...................................................................................... 11</p>
            <p><span className="font-medium">4. INSTALLATION REQUIREMENTS</span> ...................................................................................................... 12</p>
            <p><span className="font-medium">5. GENERAL REMARKS</span> ............................................................................................................................ 12</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SurveyCover;
