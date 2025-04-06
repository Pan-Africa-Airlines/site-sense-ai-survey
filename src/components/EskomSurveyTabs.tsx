import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, FileDown } from "lucide-react";
import SiteInformation from "./survey/SiteInformation";
import EquipmentRoomGeneral from "./survey/EquipmentRoomGeneral";
import CabinetSpacePlanning from "./survey/CabinetSpacePlanning";
import TransportPlatforms from "./survey/TransportPlatforms";
import PowerDistribution from "./survey/PowerDistribution";
import EquipmentPhotos from "./survey/EquipmentPhotos";
import RequirementsRemarks from "./survey/RequirementsRemarks";
import AttendeeInformation from "./survey/AttendeeInformation";
import OpticalFrame from "./survey/OpticalFrame";
import SurveyOutcome from "./survey/SurveyOutcome";
import RoomLayoutDrawing from "./survey/RoomLayoutDrawing";
import FinalChecklist from "./survey/FinalChecklist";
import BCXLogo from "./ui/logo";
import html2pdf from 'html2pdf.js';
import { toast } from "sonner";

interface FormData {
  // Site Information
  siteName: string;
  siteId: string;
  siteType: string;
  region: string;
  date: string;
  address: string;
  gpsCoordinates: string;
  buildingPhoto: string;
  googleMapView: string;
  
  // Building Information
  buildingName: string;
  buildingType: string;
  floorLevel: string;
  equipmentRoomName: string;
  
  // Access Procedure
  accessRequirements: string;
  securityRequirements: string;
  vehicleType: string;
  
  // Site Contacts
  siteContacts: Array<{
    name: string;
    cellphone: string;
    email: string;
  }>;
  
  // Equipment Room General
  cableAccess: string;
  roomLighting: string;
  fireProtection: string;
  coolingMethod: string;
  coolingRating: string;
  roomTemperature: string;
  equipmentRoomCondition: string;
  
  // Cabinet Space Planning
  roomLayoutDrawing: string;
  numberOfRouters: string;
  roomLayoutMarkup: string;
  additionalDrawings: string[];
  
  // Transport Platforms
  transportLinks: Array<{
    linkNumber: string;
    linkType: string;
    direction: string;
    capacity: string;
  }>;
  
  // DC Power
  chargerA: string;
  chargerB: string;
  powerSupplyMethod: string;
  cableLength: string;
  endOfAisleLayout: string;
  
  // Photos
  equipmentRoomPhotos: string[];
  cabinetLocationPhotos: string[];
  powerDistributionPhotos: string[];
  transportEquipmentPhotos: string[];
  opticalFramePhotos: string[];
  accessEquipmentPhotos: string[];
  cableRoutingPhotos: string[];
  ceilingHVACPhotos: string[];
  
  // Requirements
  accessSecurity: string;
  coolingVentilation: string;
  flooringType: string;
  fireProt: string;
  lighting: string;
  roofType: string;
  powerCables: string;
  
  // General Remarks
  remarks: string;
  
  // ODF Layout
  odfCabinets: Array<{
    name: string;
    direction: string;
    connectionType: string;
    cores: string;
    usedPorts: Record<string, boolean>;
  }>;
  
  // Cabinet Layout
  cabinetLayoutDrawing: string;
  
  // 50V Charger Layout
  chargerDetails: {
    siteName: string;
    chargerLabel: string;
    chargerType: string;
    chargerA: Array<{
      circuit: string;
      mcbRating: string;
      used: boolean;
      label: string;
    }>;
    chargerB: Array<{
      circuit: string;
      mcbRating: string;
      used: boolean;
      label: string;
    }>;
  };
  
  // Attendee Information
  attendees: Array<{
    date: string;
    name: string;
    company: string;
    department: string;
    cellphone: string;
  }>;
  
  // Survey Outcome
  oemContractor: {
    name: string;
    signature: string;
    date: string;
    accepted: boolean;
    comments: string;
  };
  oemEngineer: {
    name: string;
    signature: string;
    date: string;
    accepted: boolean;
    comments: string;
  };
  eskomRepresentative: {
    name: string;
    signature: string;
    date: string;
    accepted: boolean;
    comments: string;
  };
  
  // Room Layout Scanned Drawing
  scannedRoomLayout: string;
  
  // Final Notes
  finalNotes?: string;
}

interface EskomSurveyTabsProps {
  formData: FormData;
  onInputChange: (field: string, value: any) => void;
  showAIRecommendations?: boolean;
}

const EskomSurveyTabs: React.FC<EskomSurveyTabsProps> = ({
  formData,
  onInputChange,
  showAIRecommendations = false
}) => {
  const [activeTab, setActiveTab] = useState("site-info");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  
  const tabs = [
    { id: "site-info", label: "1. Site Information" },
    { id: "attendees", label: "2. Attendees" },
    { id: "equipment-room", label: "3. Equipment Room" },
    { id: "cabinet-planning", label: "4. Cabinet Planning" },
    { id: "transport", label: "5. Transport" },
    { id: "power", label: "6. Power Distribution" },
    { id: "photos", label: "7. Equipment Photos" },
    { id: "odf", label: "8. Optical Frame" },
    { id: "requirements", label: "9. Requirements" },
    { id: "survey-outcome", label: "10. Survey Outcome" },
    { id: "room-layout", label: "11. Room Layout" },
    { id: "final-checklist", label: "12. Final Checklist" }
  ];
  
  const currentTabIndex = tabs.findIndex(tab => tab.id === activeTab);
  
  const handleNextTab = () => {
    if (currentTabIndex < tabs.length - 1) {
      setActiveTab(tabs[currentTabIndex + 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const handlePrevTab = () => {
    if (currentTabIndex > 0) {
      setActiveTab(tabs[currentTabIndex - 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const prepareFullPDFContent = () => {
    const container = document.createElement('div');
    container.className = 'pdf-container';
    container.style.padding = '20px';
    container.style.backgroundColor = 'white';
    container.style.fontFamily = 'Arial, sans-serif';
    
    const header = document.createElement('div');
    header.innerHTML = `
      <div style="text-align: center; margin-bottom: 20px;">
        <div id="bcx-logo-container" style="margin-bottom: 15px;"></div>
        <h1 style="margin-top: 10px; color: #333;">Eskom OT IP/MPLS Network Site Survey</h1>
        <h2 style="color: #666; font-weight: normal;">${formData.siteName || 'Site'} - ${formData.siteId || 'ID'}</h2>
        <p style="margin-top: 5px; color: #888;">Survey Date: ${formData.date || new Date().toLocaleDateString()}</p>
      </div>
    `;
    container.appendChild(header);
    
    tabs.forEach(tab => {
      const tabContent = document.querySelector(`[data-state="inactive"][data-orientation="horizontal"][data-value="${tab.id}"]`);
      
      if (tabContent) {
        const section = document.createElement('div');
        section.className = 'pdf-section';
        section.style.marginBottom = '30px';
        section.style.pageBreakInside = 'avoid';
        
        const title = document.createElement('h2');
        title.textContent = tab.label;
        title.style.borderBottom = '2px solid #eee';
        title.style.paddingBottom = '10px';
        title.style.marginBottom = '20px';
        title.style.color = '#444';
        
        section.appendChild(title);
        
        const content = tabContent.cloneNode(true) as HTMLElement;
        
        content.querySelectorAll('button').forEach(btn => btn.remove());
        content.querySelectorAll('input[type="file"]').forEach(input => input.remove());
        content.querySelectorAll('.copy-icon').forEach(icon => icon.remove());
        
        section.appendChild(content);
        container.appendChild(section);
      }
    });
    
    if (hasAnyImages()) {
      addImagesSection(container);
    }
    
    if (hasAnyDrawings()) {
      addDrawingsSection(container);
    }
    
    addSignatureSection(container);
    
    return container;
  };
  
  const hasAnyImages = () => {
    const imageFields = [
      'buildingPhoto', 'googleMapView', 
      'equipmentRoomPhotos', 'cabinetLocationPhotos', 'powerDistributionPhotos',
      'transportEquipmentPhotos', 'opticalFramePhotos', 'accessEquipmentPhotos',
      'cableRoutingPhotos', 'ceilingHVACPhotos'
    ];
    
    return imageFields.some(field => {
      if (Array.isArray(formData[field as keyof typeof formData])) {
        return (formData[field as keyof typeof formData] as string[]).some(url => url && url.trim() !== '');
      }
      return formData[field as keyof typeof formData] && (formData[field as keyof typeof formData] as string).trim() !== '';
    });
  };
  
  const hasAnyDrawings = () => {
    const drawingFields = [
      'roomLayoutDrawing', 'cabinetLayoutDrawing', 'scannedRoomLayout', 'additionalDrawings'
    ];
    
    return drawingFields.some(field => {
      if (field === 'additionalDrawings') {
        return (formData.additionalDrawings as string[]).some(url => url && url.trim() !== '');
      }
      return formData[field as keyof typeof formData] && (formData[field as keyof typeof formData] as string).trim() !== '';
    });
  };
  
  const addImagesSection = (container: HTMLElement) => {
    const section = document.createElement('div');
    section.className = 'pdf-section images-section';
    section.style.marginBottom = '30px';
    section.style.pageBreakBefore = 'always';
    
    const title = document.createElement('h2');
    title.textContent = 'Site Photographs';
    title.style.borderBottom = '2px solid #eee';
    title.style.paddingBottom = '10px';
    title.style.marginBottom = '20px';
    title.style.color = '#444';
    
    section.appendChild(title);
    
    if (formData.buildingPhoto) {
      addImageToSection(section, formData.buildingPhoto, 'Building Exterior');
    }
    
    if (formData.googleMapView) {
      addImageToSection(section, formData.googleMapView, 'Google Map View');
    }
    
    if (formData.equipmentRoomPhotos && formData.equipmentRoomPhotos.length > 0) {
      const photoSection = document.createElement('div');
      photoSection.className = 'photo-category';
      photoSection.style.marginBottom = '20px';
      
      const photoTitle = document.createElement('h3');
      photoTitle.textContent = 'Equipment Room Photos';
      photoTitle.style.marginBottom = '10px';
      photoTitle.style.color = '#555';
      
      photoSection.appendChild(photoTitle);
      
      formData.equipmentRoomPhotos.forEach((photo: string, index: number) => {
        if (photo && photo.trim() !== '') {
          addImageToSection(photoSection, photo, `Equipment Room Photo ${index + 1}`);
        }
      });
      
      section.appendChild(photoSection);
    }
    
    const photoCategories = [
      { field: 'cabinetLocationPhotos', title: 'Cabinet Location Photos' },
      { field: 'powerDistributionPhotos', title: 'Power Distribution Photos' },
      { field: 'transportEquipmentPhotos', title: 'Transport Equipment Photos' },
      { field: 'opticalFramePhotos', title: 'Optical Frame Photos' },
      { field: 'accessEquipmentPhotos', title: 'Access Equipment Photos' },
      { field: 'cableRoutingPhotos', title: 'Cable Routing Photos' },
      { field: 'ceilingHVACPhotos', title: 'Ceiling & HVAC Photos' }
    ];
    
    photoCategories.forEach(category => {
      const photos = formData[category.field as keyof typeof formData] as string[];
      if (photos && photos.length > 0) {
        const categorySection = document.createElement('div');
        categorySection.className = 'photo-category';
        categorySection.style.marginBottom = '20px';
        categorySection.style.pageBreakInside = 'avoid';
        
        const categoryTitle = document.createElement('h3');
        categoryTitle.textContent = category.title;
        categoryTitle.style.marginBottom = '10px';
        categoryTitle.style.color = '#555';
        
        categorySection.appendChild(categoryTitle);
        
        photos.forEach((photo: string, index: number) => {
          if (photo && photo.trim() !== '') {
            addImageToSection(categorySection, photo, `${category.title} ${index + 1}`);
          }
        });
        
        section.appendChild(categorySection);
      }
    });
    
    container.appendChild(section);
  };
  
  const addImageToSection = (section: HTMLElement, imageUrl: string, caption: string) => {
    if (!imageUrl || imageUrl.trim() === '') return;
    
    const imgContainer = document.createElement('div');
    imgContainer.className = 'image-container';
    imgContainer.style.margin = '10px 0';
    imgContainer.style.pageBreakInside = 'avoid';
    
    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = caption;
    img.style.maxWidth = '100%';
    img.style.maxHeight = '300px';
    img.style.border = '1px solid #ddd';
    img.style.borderRadius = '4px';
    img.style.padding = '5px';
    
    const captionEl = document.createElement('p');
    captionEl.textContent = caption;
    captionEl.style.margin = '5px 0';
    captionEl.style.fontStyle = 'italic';
    captionEl.style.color = '#666';
    
    imgContainer.appendChild(img);
    imgContainer.appendChild(captionEl);
    section.appendChild(imgContainer);
  };
  
  const addDrawingsSection = (container: HTMLElement) => {
    const section = document.createElement('div');
    section.className = 'pdf-section drawings-section';
    section.style.marginBottom = '30px';
    section.style.pageBreakBefore = 'always';
    
    const title = document.createElement('h2');
    title.textContent = 'Site Drawings & Layouts';
    title.style.borderBottom = '2px solid #eee';
    title.style.paddingBottom = '10px';
    title.style.marginBottom = '20px';
    title.style.color = '#444';
    
    section.appendChild(title);
    
    if (formData.roomLayoutDrawing) {
      addImageToSection(section, formData.roomLayoutDrawing, 'Room Layout Drawing');
    }
    
    if (formData.cabinetLayoutDrawing) {
      addImageToSection(section, formData.cabinetLayoutDrawing, 'Cabinet Layout Drawing');
    }
    
    if (formData.scannedRoomLayout) {
      addImageToSection(section, formData.scannedRoomLayout, 'Scanned Room Layout');
    }
    
    if (formData.additionalDrawings && formData.additionalDrawings.length > 0) {
      formData.additionalDrawings.forEach((drawing: string, index: number) => {
        if (drawing && drawing.trim() !== '') {
          addImageToSection(section, drawing, `Additional Drawing ${index + 1}`);
        }
      });
    }
    
    container.appendChild(section);
  };
  
  const addSignatureSection = (container: HTMLElement) => {
    const section = document.createElement('div');
    section.className = 'pdf-section signature-section';
    section.style.marginBottom = '30px';
    section.style.marginTop = '50px';
    section.style.pageBreakBefore = 'always';
    
    const title = document.createElement('h2');
    title.textContent = 'Survey Approval';
    title.style.borderBottom = '2px solid #eee';
    title.style.paddingBottom = '10px';
    title.style.marginBottom = '20px';
    title.style.color = '#444';
    
    section.appendChild(title);
    
    const signaturesTable = document.createElement('table');
    signaturesTable.style.width = '100%';
    signaturesTable.style.borderCollapse = 'collapse';
    signaturesTable.style.marginTop = '20px';
    
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    ['Role', 'Name', 'Date', 'Status', 'Comments'].forEach(headerText => {
      const th = document.createElement('th');
      th.textContent = headerText;
      th.style.padding = '10px';
      th.style.borderBottom = '2px solid #eee';
      th.style.textAlign = 'left';
      headerRow.appendChild(th);
    });
    
    thead.appendChild(headerRow);
    signaturesTable.appendChild(thead);
    
    const tbody = document.createElement('tbody');
    
    const contractorRow = document.createElement('tr');
    addTableCell(contractorRow, 'OEM Contractor');
    addTableCell(contractorRow, formData.oemContractor.name || '');
    addTableCell(contractorRow, formData.oemContractor.date || '');
    addTableCell(contractorRow, formData.oemContractor.accepted ? 'Accepted' : 'Not Accepted');
    addTableCell(contractorRow, formData.oemContractor.comments || '');
    tbody.appendChild(contractorRow);
    
    const engineerRow = document.createElement('tr');
    addTableCell(engineerRow, 'OEM Engineer');
    addTableCell(engineerRow, formData.oemEngineer.name || '');
    addTableCell(engineerRow, formData.oemEngineer.date || '');
    addTableCell(engineerRow, formData.oemEngineer.accepted ? 'Accepted' : 'Not Accepted');
    addTableCell(engineerRow, formData.oemEngineer.comments || '');
    tbody.appendChild(engineerRow);
    
    const eskomRow = document.createElement('tr');
    addTableCell(eskomRow, 'Eskom Representative');
    addTableCell(eskomRow, formData.eskomRepresentative.name || '');
    addTableCell(eskomRow, formData.eskomRepresentative.date || '');
    addTableCell(eskomRow, formData.eskomRepresentative.accepted ? 'Accepted' : 'Not Accepted');
    addTableCell(eskomRow, formData.eskomRepresentative.comments || '');
    tbody.appendChild(eskomRow);
    
    signaturesTable.appendChild(tbody);
    section.appendChild(signaturesTable);
    
    const signatureSection = document.createElement('div');
    signatureSection.className = 'signatures';
    signatureSection.style.marginTop = '30px';
    signatureSection.style.display = 'flex';
    signatureSection.style.justifyContent = 'space-around';
    
    if (formData.oemContractor.signature) {
      addSignatureImage(signatureSection, formData.oemContractor.signature, 'OEM Contractor');
    }
    
    if (formData.oemEngineer.signature) {
      addSignatureImage(signatureSection, formData.oemEngineer.signature, 'OEM Engineer');
    }
    
    if (formData.eskomRepresentative.signature) {
      addSignatureImage(signatureSection, formData.eskomRepresentative.signature, 'Eskom Representative');
    }
    
    section.appendChild(signatureSection);
    container.appendChild(section);
  };
  
  const addTableCell = (row: HTMLTableRowElement, content: string) => {
    const cell = document.createElement('td');
    cell.textContent = content;
    cell.style.padding = '10px';
    cell.style.borderBottom = '1px solid #eee';
    row.appendChild(cell);
  };
  
  const addSignatureImage = (container: HTMLElement, imageUrl: string, title: string) => {
    const signatureDiv = document.createElement('div');
    signatureDiv.className = 'signature';
    signatureDiv.style.textAlign = 'center';
    
    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = `${title} Signature`;
    img.style.maxWidth = '200px';
    img.style.maxHeight = '100px';
    img.style.border = '1px solid #ddd';
    img.style.borderRadius = '4px';
    img.style.padding = '5px';
    
    const caption = document.createElement('p');
    caption.textContent = title;
    caption.style.marginTop = '5px';
    
    signatureDiv.appendChild(img);
    signatureDiv.appendChild(caption);
    container.appendChild(signatureDiv);
  };
  
  const generatePDF = () => {
    setIsGeneratingPDF(true);
    toast.info("Generating PDF with all images and drawings, please wait...");
    
    const fullContent = prepareFullPDFContent();
    
    document.body.appendChild(fullContent);
    
    const logoContainer = fullContent.querySelector('#bcx-logo-container');
    if (logoContainer) {
      const logoSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      logoSvg.setAttribute("width", "120");
      logoSvg.setAttribute("height", "60");
      logoSvg.setAttribute("viewBox", "0 0 120 60");
      logoSvg.setAttribute("fill", "none");
      
      const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path1.setAttribute("d", "M43.5 15H64C69.5 15 74 19.5 74 25C74 30.5 69.5 35 64 35H43.5V15Z");
      path1.setAttribute("fill", "#747474");
      
      const path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path2.setAttribute("d", "M43.5 40H69C74.5 40 79 44.5 79 50C79 55.5 74.5 60 69 60H43.5V40Z");
      path2.setAttribute("fill", "#747474");
      
      const path3 = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path3.setAttribute("d", "M84 15H104.5C110 15 114.5 19.5 114.5 25C114.5 30.5 110 35 104.5 35H84V15Z");
      path3.setAttribute("fill", "#747474");
      
      const path4 = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path4.setAttribute("d", "M99 40H104.5L114.5 60H104.5L99 40Z");
      path4.setAttribute("fill", "#d33a37");
      
      logoSvg.appendChild(path1);
      logoSvg.appendChild(path2);
      logoSvg.appendChild(path3);
      logoSvg.appendChild(path4);
      
      logoContainer.appendChild(logoSvg);
    }
    
    const opt = {
      margin: 10,
      filename: `Eskom_Site_Survey_${formData.siteName || 'Report'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true,
        logging: false,
        letterRendering: true,
        allowTaint: true
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait',
        compress: true
      }
    };
    
    html2pdf().from(fullContent).set(opt).save()
      .then(() => {
        toast.success("PDF generated successfully with all images and drawings!");
        document.body.removeChild(fullContent);
        setIsGeneratingPDF(false);
      })
      .catch((error) => {
        console.error("PDF generation failed:", error);
        toast.error("Failed to generate PDF: " + (error.message || "Unknown error"));
        document.body.removeChild(fullContent);
        setIsGeneratingPDF(false);
      });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="w-full overflow-x-auto pb-2 md:pb-0">
            <TabsList className="h-auto p-1 bg-gray-100 rounded-lg">
              {tabs.map(tab => (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id} 
                  className={`
                    text-xs sm:text-sm py-2 px-3 rounded-md transition-all
                    data-[state=active]:bg-white data-[state=active]:text-akhanya data-[state=active]:shadow-sm
                    data-[state=active]:font-medium
                  `}
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          
          <Button 
            onClick={generatePDF}
            className="flex items-center gap-2 bg-akhanya hover:bg-akhanya-dark shrink-0"
            type="button"
            disabled={isGeneratingPDF}
          >
            <FileDown className="h-4 w-4" />
            {isGeneratingPDF ? "Generating PDF..." : "Export PDF"}
          </Button>
        </div>
        
        <div id="survey-content" className="mt-6 bg-white rounded-lg p-6 shadow-md">
          <TabsContent value="site-info" className="mt-0">
            <SiteInformation 
              formData={formData}
              onInputChange={onInputChange}
              showAIRecommendations={showAIRecommendations}
            />
          </TabsContent>
          
          <TabsContent value="attendees" className="mt-0">
            <AttendeeInformation 
              formData={formData}
              onInputChange={onInputChange}
              showAIRecommendations={showAIRecommendations}
            />
          </TabsContent>
          
          <TabsContent value="equipment-room" className="mt-0">
            <EquipmentRoomGeneral 
              formData={formData}
              onInputChange={onInputChange}
              showAIRecommendations={showAIRecommendations}
            />
          </TabsContent>
          
          <TabsContent value="cabinet-planning" className="mt-0">
            <CabinetSpacePlanning 
              formData={formData}
              onInputChange={onInputChange}
              showAIRecommendations={showAIRecommendations}
            />
          </TabsContent>
          
          <TabsContent value="transport" className="mt-0">
            <TransportPlatforms 
              formData={formData}
              onInputChange={onInputChange}
              showAIRecommendations={showAIRecommendations}
            />
          </TabsContent>
          
          <TabsContent value="power" className="mt-0">
            <PowerDistribution 
              formData={formData}
              onInputChange={onInputChange}
              showAIRecommendations={showAIRecommendations}
            />
          </TabsContent>
          
          <TabsContent value="photos" className="mt-0">
            <EquipmentPhotos 
              formData={formData}
              onInputChange={onInputChange}
              showAIRecommendations={showAIRecommendations}
            />
          </TabsContent>
          
          <TabsContent value="odf" className="mt-0">
            <OpticalFrame 
              formData={formData}
              onInputChange={onInputChange}
              showAIRecommendations={showAIRecommendations}
            />
          </TabsContent>
          
          <TabsContent value="requirements" className="mt-0">
            <RequirementsRemarks 
              formData={formData}
              onInputChange={onInputChange}
              showAIRecommendations={showAIRecommendations}
            />
          </TabsContent>
          
          <TabsContent value="survey-outcome" className="mt-0">
            <SurveyOutcome 
              formData={formData}
              onInputChange={onInputChange}
              showAIRecommendations={showAIRecommendations}
            />
          </TabsContent>
          
          <TabsContent value="room-layout" className="mt-0">
            <RoomLayoutDrawing 
              formData={formData}
              onInputChange={onInputChange}
              showAIRecommendations={showAIRecommendations}
            />
          </TabsContent>
          
          <TabsContent value="final-checklist" className="mt-0">
            <FinalChecklist 
              formData={formData}
              onInputChange={onInputChange}
              showAIRecommendations={showAIRecommendations}
            />
          </TabsContent>
        </div>
      </Tabs>
      
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={handlePrevTab}
          disabled={currentTabIndex === 0}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Previous
        </Button>
        
        <Button
          onClick={handleNextTab}
          disabled={currentTabIndex === tabs.length - 1}
          className="flex items-center gap-2 bg-akhanya hover:bg-akhanya-dark"
        >
          Next <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default EskomSurveyTabs;
