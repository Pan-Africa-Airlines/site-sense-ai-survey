
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash, MoveUp, MoveDown, Save } from "lucide-react";
import { toast } from "sonner";
import FieldConfigCard from "@/components/FieldConfigCard";
import { useLocalStorage } from "@/hooks/useLocalStorage";

// Define types for form configuration
export interface FormField {
  id: string;
  type: "text" | "number" | "select" | "textarea" | "checkbox" | "date";
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[]; // For select fields
  section?: string;
  order: number;
  active?: boolean; // New field to control visibility
}

export interface FormConfig {
  assessment: {
    sections: string[];
    fields: FormField[];
  };
  installation: {
    sections: string[];
    fields: FormField[];
  };
  eskomSurvey: {
    sections: string[];
    fields: FormField[];
  };
}

// Initial configuration with some example fields and our new Eskom survey fields
const defaultConfig: FormConfig = {
  assessment: {
    sections: ["Basic Information", "Site Details", "Requirements", "Technical Details"],
    fields: [
      {
        id: "siteName",
        type: "text",
        label: "Site Name",
        placeholder: "Enter site name",
        required: true,
        section: "Basic Information",
        order: 0,
        active: true
      },
      {
        id: "siteLocation",
        type: "text",
        label: "Site Location",
        placeholder: "Enter site location",
        required: true,
        section: "Basic Information",
        order: 1,
        active: true
      }
    ]
  },
  installation: {
    sections: ["Basic Information", "Equipment", "Installation Details", "Verification"],
    fields: [
      {
        id: "installationDate",
        type: "date",
        label: "Installation Date",
        required: true,
        section: "Basic Information",
        order: 0,
        active: true
      },
      {
        id: "equipmentType",
        type: "select",
        label: "Equipment Type",
        required: true,
        options: ["Router", "Switch", "Firewall", "Other"],
        section: "Equipment",
        order: 0,
        active: true
      }
    ]
  },
  eskomSurvey: {
    sections: [
      "Site Information", 
      "Site Visit Attendees", 
      "Site Survey Outcome",
      "Site Identification",
      "Equipment Location",
      "Access Procedure",
      "Equipment Room General",
      "Cabinet Space Planning",
      "Transport Platforms",
      "DC Power Distribution",
      "Installation Requirements",
      "Optical Distribution Frame",
      "Annexures"
    ],
    fields: [
      // Site Information section
      {
        id: "siteName",
        type: "text",
        label: "Site Name",
        placeholder: "Enter site name",
        required: true,
        section: "Site Information",
        order: 0,
        active: true
      },
      {
        id: "region",
        type: "select",
        label: "Region",
        required: true,
        options: ["Gauteng", "Western Cape", "KwaZulu-Natal", "Eastern Cape", "Limpopo", "Mpumalanga", "North West", "Free State", "Northern Cape"],
        section: "Site Information",
        order: 1,
        active: true
      },
      {
        id: "date",
        type: "date",
        label: "Date",
        required: true,
        section: "Site Information",
        order: 2,
        active: true
      },
      {
        id: "buildingPhoto",
        type: "text",
        label: "Building Photo",
        placeholder: "Full front view photo of building where IP/MPLS equipment will be situated",
        required: true,
        section: "Site Information",
        order: 3,
        active: true
      },

      // Site Visit Attendees section
      {
        id: "attendeeName1",
        type: "text",
        label: "Attendee 1 Name",
        placeholder: "Enter name",
        required: true,
        section: "Site Visit Attendees",
        order: 0,
        active: true
      },
      {
        id: "attendeeCompany1",
        type: "text",
        label: "Attendee 1 Company",
        placeholder: "Enter company",
        required: true,
        section: "Site Visit Attendees",
        order: 1,
        active: true
      },
      {
        id: "attendeeDepartment1",
        type: "text",
        label: "Attendee 1 Department",
        placeholder: "Enter department",
        required: true,
        section: "Site Visit Attendees",
        order: 2,
        active: true
      },
      {
        id: "attendeeCellphone1",
        type: "text",
        label: "Attendee 1 Cellphone",
        placeholder: "Enter cellphone",
        required: true,
        section: "Site Visit Attendees",
        order: 3,
        active: true
      },

      // Site Survey Outcome section
      {
        id: "oemContractorName",
        type: "text",
        label: "OEM Contractor Name",
        placeholder: "Enter name",
        required: true,
        section: "Site Survey Outcome",
        order: 0,
        active: true
      },
      {
        id: "oemContractorSignature",
        type: "text",
        label: "OEM Contractor Signature",
        placeholder: "Enter signature",
        required: true,
        section: "Site Survey Outcome",
        order: 1,
        active: true
      },
      {
        id: "oemContractorDate",
        type: "date",
        label: "OEM Contractor Date",
        required: true,
        section: "Site Survey Outcome",
        order: 2,
        active: true
      },
      {
        id: "oemContractorStatus",
        type: "select",
        label: "OEM Contractor Status",
        required: true,
        options: ["Accepted", "Rejected"],
        section: "Site Survey Outcome",
        order: 3,
        active: true
      },
      {
        id: "oemContractorComments",
        type: "textarea",
        label: "OEM Contractor Comments",
        placeholder: "Enter comments",
        required: false,
        section: "Site Survey Outcome",
        order: 4,
        active: true
      },
      {
        id: "oemEngineerName",
        type: "text",
        label: "OEM Engineer Name",
        placeholder: "Enter name",
        required: true,
        section: "Site Survey Outcome",
        order: 5,
        active: true
      },
      {
        id: "oemEngineerSignature",
        type: "text",
        label: "OEM Engineer Signature",
        placeholder: "Enter signature",
        required: true,
        section: "Site Survey Outcome",
        order: 6,
        active: true
      },
      {
        id: "oemEngineerDate",
        type: "date",
        label: "OEM Engineer Date",
        required: true,
        section: "Site Survey Outcome",
        order: 7,
        active: true
      },
      {
        id: "oemEngineerStatus",
        type: "select",
        label: "OEM Engineer Status",
        required: true,
        options: ["Accepted", "Rejected"],
        section: "Site Survey Outcome",
        order: 8,
        active: true
      },
      {
        id: "oemEngineerComments",
        type: "textarea",
        label: "OEM Engineer Comments",
        placeholder: "Enter comments",
        required: false,
        section: "Site Survey Outcome",
        order: 9,
        active: true
      },
      {
        id: "eskomRepresentativeName",
        type: "text",
        label: "Eskom Representative Name",
        placeholder: "Enter name",
        required: true,
        section: "Site Survey Outcome",
        order: 10,
        active: true
      },
      {
        id: "eskomRepresentativeSignature",
        type: "text",
        label: "Eskom Representative Signature",
        placeholder: "Enter signature",
        required: true,
        section: "Site Survey Outcome",
        order: 11,
        active: true
      },
      {
        id: "eskomRepresentativeDate",
        type: "date",
        label: "Eskom Representative Date",
        required: true,
        section: "Site Survey Outcome",
        order: 12,
        active: true
      },
      {
        id: "eskomRepresentativeStatus",
        type: "select",
        label: "Eskom Representative Status",
        required: true,
        options: ["Accepted", "Rejected"],
        section: "Site Survey Outcome",
        order: 13,
        active: true
      },
      {
        id: "eskomRepresentativeComments",
        type: "textarea",
        label: "Eskom Representative Comments",
        placeholder: "Enter comments",
        required: false,
        section: "Site Survey Outcome",
        order: 14,
        active: true
      },

      // Site Identification section
      {
        id: "siteID",
        type: "text",
        label: "Site ID (WorkPlace ID)",
        placeholder: "Enter site ID",
        required: true,
        section: "Site Identification",
        order: 0,
        active: true
      },
      {
        id: "siteType",
        type: "text",
        label: "Site Type",
        placeholder: "Sub-TX, RS, PS-Coal",
        required: true,
        section: "Site Identification",
        order: 1,
        active: true
      },
      {
        id: "addressLocation",
        type: "textarea",
        label: "Address/Location Description",
        placeholder: "Enter address/location description",
        required: true,
        section: "Site Identification",
        order: 2,
        active: true
      },
      {
        id: "gpsCoordinates",
        type: "text",
        label: "GPS coordinates WGS84 (Lat/Long)",
        placeholder: "Enter GPS coordinates",
        required: true,
        section: "Site Identification",
        order: 3,
        active: true
      },
      {
        id: "siteLocationMap",
        type: "text",
        label: "Site Location Map",
        placeholder: "Please provide a Google Map view of the site location with coordinates",
        required: true,
        section: "Site Identification",
        order: 4,
        active: true
      },

      // Equipment Location section
      {
        id: "buildingName",
        type: "text",
        label: "Building name",
        placeholder: "Enter building name",
        required: true,
        section: "Equipment Location",
        order: 0,
        active: true
      },
      {
        id: "buildingType",
        type: "text",
        label: "Building type",
        placeholder: "e.g. Container, Brick",
        required: true,
        section: "Equipment Location",
        order: 1,
        active: true
      },
      {
        id: "floorLevel",
        type: "text",
        label: "Floor level",
        placeholder: "Enter floor level",
        required: true,
        section: "Equipment Location",
        order: 2,
        active: true
      },
      {
        id: "equipmentRoomNumber",
        type: "text",
        label: "Equipment Room number / name",
        placeholder: "Enter equipment room number/name",
        required: true,
        section: "Equipment Location",
        order: 3,
        active: true
      },

      // Access Procedure section
      {
        id: "siteAccessRequirements",
        type: "textarea",
        label: "Requirements for site access",
        placeholder: "Enter requirements for site access",
        required: true,
        section: "Access Procedure",
        order: 0,
        active: true
      },
      {
        id: "siteSecurityRequirements",
        type: "textarea",
        label: "Site security requirements",
        placeholder: "Enter site security requirements",
        required: true,
        section: "Access Procedure",
        order: 1,
        active: true
      },
      {
        id: "vehicleTypeToReachSite",
        type: "text",
        label: "Vehicle type to reach site",
        placeholder: "Enter vehicle type to reach site",
        required: true,
        section: "Access Procedure",
        order: 2,
        active: true
      },
      {
        id: "contactName1",
        type: "text",
        label: "Contact name 1",
        placeholder: "Enter contact name",
        required: true,
        section: "Access Procedure",
        order: 3,
        active: true
      },
      {
        id: "contactCellphone1",
        type: "text",
        label: "Contact cellphone 1",
        placeholder: "Enter contact cellphone",
        required: true,
        section: "Access Procedure",
        order: 4,
        active: true
      },
      {
        id: "contactEmail1",
        type: "text",
        label: "Contact email 1",
        placeholder: "Enter contact email",
        required: true,
        section: "Access Procedure",
        order: 5,
        active: true
      },

      // Equipment Room General section
      {
        id: "cableAccess",
        type: "text",
        label: "Cable access to the cabinet",
        placeholder: "Underfloor, Overhead",
        required: true,
        section: "Equipment Room General",
        order: 0,
        active: true
      },
      {
        id: "roomLighting",
        type: "text",
        label: "Room lighting",
        placeholder: "Indicate if any lights are faulty",
        required: true,
        section: "Equipment Room General",
        order: 1,
        active: true
      },
      {
        id: "fireProtection",
        type: "text",
        label: "Fire Protection",
        placeholder: "Enter fire protection details",
        required: true,
        section: "Equipment Room General",
        order: 2,
        active: true
      },
      {
        id: "coolingMethod",
        type: "text",
        label: "Cooling Method",
        placeholder: "Air-conditioning, Fans etc",
        required: true,
        section: "Equipment Room General",
        order: 3,
        active: true
      },
      {
        id: "coolingRating",
        type: "text",
        label: "Cooling Rating",
        placeholder: "BTU or Central Controlled",
        required: true,
        section: "Equipment Room General",
        order: 4,
        active: true
      },
      {
        id: "roomTemperature",
        type: "text",
        label: "Measured room temperature (Deg C)",
        placeholder: "Enter room temperature",
        required: true,
        section: "Equipment Room General",
        order: 5,
        active: true
      },
      {
        id: "equipmentRoomCondition",
        type: "textarea",
        label: "General condition of equipment room",
        placeholder: "Enter general condition of equipment room",
        required: true,
        section: "Equipment Room General",
        order: 6,
        active: true
      },

      // Cabinet Space Planning section
      {
        id: "roomLayoutDrawing",
        type: "textarea",
        label: "Room Layout Drawing",
        placeholder: "Description of room layout drawing",
        required: true,
        section: "Cabinet Space Planning",
        order: 0,
        active: true
      },
      {
        id: "numberOfRouters",
        type: "number",
        label: "Number of new routers required",
        placeholder: "Enter number of routers",
        required: true,
        section: "Cabinet Space Planning",
        order: 1,
        active: true
      },
      {
        id: "roomLayoutMarkup",
        type: "textarea",
        label: "Room Layout Markup",
        placeholder: "Please red-line Room Layout Drawing to indicate locations of equipment",
        required: true,
        section: "Cabinet Space Planning",
        order: 2,
        active: true
      },

      // Transport Platforms section
      {
        id: "link1",
        type: "text",
        label: "Link 1 – Link Type, Direction, Capacity",
        placeholder: "Enter link details",
        required: true,
        section: "Transport Platforms",
        order: 0,
        active: true
      },
      {
        id: "link2",
        type: "text",
        label: "Link 2 – Link Type, Direction, Capacity",
        placeholder: "Enter link details",
        required: false,
        section: "Transport Platforms",
        order: 1,
        active: true
      },
      {
        id: "link3",
        type: "text",
        label: "Link 3 – Link Type, Direction, Capacity",
        placeholder: "Enter link details",
        required: false,
        section: "Transport Platforms",
        order: 2,
        active: true
      },
      {
        id: "link4",
        type: "text",
        label: "Link 4 – Link Type, Direction, Capacity",
        placeholder: "Enter link details",
        required: false,
        section: "Transport Platforms",
        order: 3,
        active: true
      },

      // DC Power Distribution section
      {
        id: "chargerALoadCurrent",
        type: "text",
        label: "50V Charger A: DC Load Current (Total Amps)",
        placeholder: "Enter load current",
        required: true,
        section: "DC Power Distribution",
        order: 0,
        active: true
      },
      {
        id: "chargerBLoadCurrent",
        type: "text",
        label: "50V Charger B: DC Load Current (Total Amps)",
        placeholder: "Enter load current",
        required: true,
        section: "DC Power Distribution",
        order: 1,
        active: true
      },
      {
        id: "cabinetsSupplyMethod",
        type: "text",
        label: "Cabinets supply method",
        placeholder: "Are cabinets supplied by the 50V DC Charger direct or via End of Aisle (EOA) DB boards?",
        required: true,
        section: "DC Power Distribution",
        order: 2,
        active: true
      },
      {
        id: "dcCableLength",
        type: "text",
        label: "DC Cable length required to OTN cabinet",
        placeholder: "Enter cable length",
        required: true,
        section: "DC Power Distribution",
        order: 3,
        active: true
      },

      // Installation Requirements section
      {
        id: "accessSecurity",
        type: "textarea",
        label: "Access & Security",
        placeholder: "Enter access and security requirements",
        required: true,
        section: "Installation Requirements",
        order: 0,
        active: true
      },
      {
        id: "coolingVentilation",
        type: "textarea",
        label: "Cooling & Ventilation",
        placeholder: "Enter cooling and ventilation details",
        required: true,
        section: "Installation Requirements",
        order: 1,
        active: true
      },
      {
        id: "flooringType",
        type: "text",
        label: "Flooring Type",
        placeholder: "Enter flooring type",
        required: true,
        section: "Installation Requirements",
        order: 2,
        active: true
      },
      {
        id: "installFireProtection",
        type: "text",
        label: "Fire Protection",
        placeholder: "Enter fire protection details",
        required: true,
        section: "Installation Requirements",
        order: 3,
        active: true
      },
      {
        id: "installRoomLighting",
        type: "text",
        label: "Room Lighting",
        placeholder: "Enter room lighting details",
        required: true,
        section: "Installation Requirements",
        order: 4,
        active: true
      },
      {
        id: "roofType",
        type: "text",
        label: "Roof type",
        placeholder: "Enter roof type",
        required: true,
        section: "Installation Requirements",
        order: 5,
        active: true
      },
      {
        id: "powerCables",
        type: "textarea",
        label: "Power cable(s)",
        placeholder: "Enter power cable details",
        required: true,
        section: "Installation Requirements",
        order: 6,
        active: true
      },
      {
        id: "generalRemarks",
        type: "textarea",
        label: "General Remarks",
        placeholder: "Enter any general remarks",
        required: false,
        section: "Installation Requirements",
        order: 7,
        active: true
      },

      // Optical Distribution Frame section 
      {
        id: "odfCabinetName1",
        type: "text",
        label: "ODF Cabinet Name 1",
        placeholder: "Enter cabinet name",
        required: true,
        section: "Optical Distribution Frame",
        order: 0,
        active: true
      },
      {
        id: "odfDirection1",
        type: "text",
        label: "ODF Direction 1",
        placeholder: "Enter direction",
        required: true,
        section: "Optical Distribution Frame",
        order: 1,
        active: true
      },
      {
        id: "odfConnectionType1",
        type: "text",
        label: "ODF Connection Type 1",
        placeholder: "Enter connection type",
        required: true,
        section: "Optical Distribution Frame",
        order: 2,
        active: true
      },
      {
        id: "odfNumberOfCores1",
        type: "text",
        label: "ODF Number of Cores 1",
        placeholder: "Enter number of cores",
        required: true,
        section: "Optical Distribution Frame",
        order: 3,
        active: true
      },

      // Annexures section
      {
        id: "annexureBCabinetLayout",
        type: "textarea",
        label: "Annexure B – Cabinet Layout",
        placeholder: "Enter cabinet layout details",
        required: false,
        section: "Annexures",
        order: 0,
        active: true
      },
      {
        id: "annexureCChargerLabel",
        type: "text",
        label: "Charger Label/Name",
        placeholder: "Enter charger label/name",
        required: false,
        section: "Annexures",
        order: 1,
        active: true
      },
      {
        id: "annexureCChargerType",
        type: "select",
        label: "Single or Dual Charger",
        options: ["Single", "Dual"],
        required: false,
        section: "Annexures",
        order: 2,
        active: true
      },
      {
        id: "annexureFRoomLayout",
        type: "textarea",
        label: "Annexure F: Room Layout Drawing",
        placeholder: "Enter room layout details",
        required: false,
        section: "Annexures",
        order: 3,
        active: true
      }
    ]
  }
};

const FormFieldsConfiguration = () => {
  const [activeTab, setActiveTab] = useState<"assessment" | "installation" | "eskomSurvey">("assessment");
  const [activeSection, setActiveSection] = useState<string>("");
  const [formConfig, setFormConfig] = useLocalStorage<FormConfig>("formConfig", defaultConfig);
  const [newFieldName, setNewFieldName] = useState("");
  const [newFieldType, setNewFieldType] = useState<FormField["type"]>("text");
  const [newFieldRequired, setNewFieldRequired] = useState(true);
  const [newSectionName, setNewSectionName] = useState("");
  const [editingField, setEditingField] = useState<FormField | null>(null);

  // Set active section when tab changes
  useEffect(() => {
    if (formConfig[activeTab].sections.length > 0) {
      setActiveSection(formConfig[activeTab].sections[0]);
    } else {
      setActiveSection("");
    }
  }, [activeTab, formConfig]);

  // Filter fields by active section
  const sectionFields = formConfig[activeTab].fields.filter(
    field => field.section === activeSection
  ).sort((a, b) => a.order - b.order);

  // Add a new field
  const handleAddField = () => {
    if (!newFieldName.trim()) {
      toast.error("Field name cannot be empty");
      return;
    }

    if (!activeSection) {
      toast.error("Please select or create a section first");
      return;
    }

    const newField: FormField = {
      id: `${newFieldName.toLowerCase().replace(/\s+/g, "_")}_${Date.now()}`,
      type: newFieldType,
      label: newFieldName,
      placeholder: `Enter ${newFieldName.toLowerCase()}`,
      required: newFieldRequired,
      section: activeSection,
      order: sectionFields.length,
      active: true // Default to active
    };

    setFormConfig({
      ...formConfig,
      [activeTab]: {
        ...formConfig[activeTab],
        fields: [...formConfig[activeTab].fields, newField]
      }
    });

    setNewFieldName("");
    toast.success("Field added successfully");
  };

  // Add a new section
  const handleAddSection = () => {
    if (!newSectionName.trim()) {
      toast.error("Section name cannot be empty");
      return;
    }

    if (formConfig[activeTab].sections.includes(newSectionName)) {
      toast.error("Section with this name already exists");
      return;
    }

    setFormConfig({
      ...formConfig,
      [activeTab]: {
        ...formConfig[activeTab],
        sections: [...formConfig[activeTab].sections, newSectionName]
      }
    });

    setActiveSection(newSectionName);
    setNewSectionName("");
    toast.success("Section added successfully");
  };

  // Delete a field
  const handleDeleteField = (fieldId: string) => {
    setFormConfig({
      ...formConfig,
      [activeTab]: {
        ...formConfig[activeTab],
        fields: formConfig[activeTab].fields.filter(field => field.id !== fieldId)
      }
    });
    toast.success("Field deleted successfully");
  };

  // Delete a section
  const handleDeleteSection = (sectionName: string) => {
    // Check if there are fields in this section
    const fieldsInSection = formConfig[activeTab].fields.filter(
      field => field.section === sectionName
    );

    if (fieldsInSection.length > 0) {
      toast.error("Cannot delete section with fields. Please delete all fields first.");
      return;
    }

    const updatedSections = formConfig[activeTab].sections.filter(
      section => section !== sectionName
    );

    setFormConfig({
      ...formConfig,
      [activeTab]: {
        ...formConfig[activeTab],
        sections: updatedSections
      }
    });

    if (updatedSections.length > 0) {
      setActiveSection(updatedSections[0]);
    } else {
      setActiveSection("");
    }

    toast.success("Section deleted successfully");
  };

  // Update a field
  const handleUpdateField = (updatedField: FormField) => {
    setFormConfig({
      ...formConfig,
      [activeTab]: {
        ...formConfig[activeTab],
        fields: formConfig[activeTab].fields.map(field => 
          field.id === updatedField.id ? updatedField : field
        )
      }
    });
    setEditingField(null);
    toast.success("Field updated successfully");
  };

  // Toggle field active status
  const handleToggleActive = (fieldId: string, active: boolean) => {
    setFormConfig({
      ...formConfig,
      [activeTab]: {
        ...formConfig[activeTab],
        fields: formConfig[activeTab].fields.map(field => 
          field.id === fieldId ? { ...field, active } : field
        )
      }
    });
    toast.success(`Field ${active ? 'activated' : 'deactivated'} successfully`);
  };

  // Move field up in order
  const handleMoveFieldUp = (fieldId: string) => {
    const fieldIndex = sectionFields.findIndex(field => field.id === fieldId);
    if (fieldIndex <= 0) return;

    const updatedFields = [...formConfig[activeTab].fields];
    const currentField = updatedFields.find(field => field.id === fieldId);
    const aboveField = sectionFields[fieldIndex - 1];

    if (currentField && aboveField) {
      const currentOrder = currentField.order;
      const aboveOrder = aboveField.order;

      // Swap orders
      updatedFields.forEach(field => {
        if (field.id === fieldId) {
          field.order = aboveOrder;
        } else if (field.id === aboveField.id) {
          field.order = currentOrder;
        }
      });

      setFormConfig({
        ...formConfig,
        [activeTab]: {
          ...formConfig[activeTab],
          fields: updatedFields
        }
      });
    }
  };

  // Move field down in order
  const handleMoveFieldDown = (fieldId: string) => {
    const fieldIndex = sectionFields.findIndex(field => field.id === fieldId);
    if (fieldIndex === -1 || fieldIndex >= sectionFields.length - 1) return;

    const updatedFields = [...formConfig[activeTab].fields];
    const currentField = updatedFields.find(field => field.id === fieldId);
    const belowField = sectionFields[fieldIndex + 1];

    if (currentField && belowField) {
      const currentOrder = currentField.order;
      const belowOrder = belowField.order;

      // Swap orders
      updatedFields.forEach(field => {
        if (field.id === fieldId) {
          field.order = belowOrder;
        } else if (field.id === belowField.id) {
          field.order = currentOrder;
        }
      });

      setFormConfig({
        ...formConfig,
        [activeTab]: {
          ...formConfig[activeTab],
          fields: updatedFields
        }
      });
    }
  };

  // Save configuration to localStorage
  const handleSaveConfig = () => {
    // We already save to localStorage automatically via the hook
    toast.success("Configuration saved successfully");
  };

  // Export configuration as JSON
  const handleExportConfig = () => {
    const dataStr = JSON.stringify(formConfig, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `form-config-${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value as "assessment" | "installation" | "eskomSurvey")}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="assessment">Assessment Form</TabsTrigger>
          <TabsTrigger value="installation">Installation Form</TabsTrigger>
          <TabsTrigger value="eskomSurvey">Eskom Survey Form</TabsTrigger>
        </TabsList>

        <TabsContent value="assessment">
          <SectionAndFieldsEditor
            formType="assessment"
            sections={formConfig.assessment.sections}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            sectionFields={sectionFields}
            onDeleteSection={handleDeleteSection}
            onDeleteField={handleDeleteField}
            onMoveFieldUp={handleMoveFieldUp}
            onMoveFieldDown={handleMoveFieldDown}
            onEditField={(field) => setEditingField(field)}
            onToggleActive={handleToggleActive}
          />
        </TabsContent>

        <TabsContent value="installation">
          <SectionAndFieldsEditor
            formType="installation"
            sections={formConfig.installation.sections}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            sectionFields={sectionFields}
            onDeleteSection={handleDeleteSection}
            onDeleteField={handleDeleteField}
            onMoveFieldUp={handleMoveFieldUp}
            onMoveFieldDown={handleMoveFieldDown}
            onEditField={(field) => setEditingField(field)}
            onToggleActive={handleToggleActive}
          />
        </TabsContent>

        <TabsContent value="eskomSurvey">
          <SectionAndFieldsEditor
            formType="eskomSurvey"
            sections={formConfig.eskomSurvey.sections}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            sectionFields={sectionFields}
            onDeleteSection={handleDeleteSection}
            onDeleteField={handleDeleteField}
            onMoveFieldUp={handleMoveFieldUp}
            onMoveFieldDown={handleMoveFieldDown}
            onEditField={(field) => setEditingField(field)}
            onToggleActive={handleToggleActive}
          />
        </TabsContent>
      </Tabs>

      {/* Add new section */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Add New Section</h3>
          <div className="flex gap-2">
            <div className="flex-grow">
              <Input
                placeholder="Section Name"
                value={newSectionName}
                onChange={(e) => setNewSectionName(e.target.value)}
              />
            </div>
            <Button onClick={handleAddSection} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Section
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Add new field */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Add New Field</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="fieldName">Field Name</Label>
              <Input
                id="fieldName"
                placeholder="Field Name"
                value={newFieldName}
                onChange={(e) => setNewFieldName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="fieldType">Field Type</Label>
              <Select value={newFieldType} onValueChange={(value) => setNewFieldType(value as FormField["type"])}>
                <SelectTrigger>
                  <SelectValue placeholder="Select field type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="select">Select</SelectItem>
                  <SelectItem value="textarea">Text Area</SelectItem>
                  <SelectItem value="checkbox">Checkbox</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <div className="flex items-center gap-2 h-10">
                <Label htmlFor="required">Required</Label>
                <input
                  id="required"
                  type="checkbox"
                  checked={newFieldRequired}
                  onChange={(e) => setNewFieldRequired(e.target.checked)}
                  className="h-4 w-4"
                />
              </div>
            </div>
            <div className="flex items-end">
              <Button onClick={handleAddField} className="w-full flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Field
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action buttons */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={handleExportConfig} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Export Config
        </Button>
        <Button onClick={handleSaveConfig} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>

      {/* Edit field modal */}
      {editingField && (
        <FieldEditModal
          field={editingField}
          onSave={handleUpdateField}
          onCancel={() => setEditingField(null)}
          formSections={formConfig[activeTab].sections}
        />
      )}
    </div>
  );
};

// Helper component for sections and fields editor
interface SectionAndFieldsEditorProps {
  formType: "assessment" | "installation" | "eskomSurvey";
  sections: string[];
  activeSection: string;
  setActiveSection: (section: string) => void;
  sectionFields: FormField[];
  onDeleteSection: (section: string) => void;
  onDeleteField: (fieldId: string) => void;
  onMoveFieldUp: (fieldId: string) => void;
  onMoveFieldDown: (fieldId: string) => void;
  onEditField: (field: FormField) => void;
  onToggleActive: (fieldId: string, active: boolean) => void;
}

const SectionAndFieldsEditor: React.FC<SectionAndFieldsEditorProps> = ({
  formType,
  sections,
  activeSection,
  setActiveSection,
  sectionFields,
  onDeleteSection,
  onDeleteField,
  onMoveFieldUp,
  onMoveFieldDown,
  onEditField,
  onToggleActive
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Sections list */}
      <Card className="md:col-span-1">
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Sections</h3>
          <div className="space-y-2">
            {sections.map((section) => (
              <div 
                key={section}
                className={`flex justify-between items-center p-2 rounded cursor-pointer ${
                  section === activeSection ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                }`}
                onClick={() => setActiveSection(section)}
              >
                <span>{section}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSection(section);
                  }}
                  className={`${
                    section === activeSection ? "hover:bg-primary-foreground/20" : "hover:bg-muted-foreground/20"
                  }`}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Fields list */}
      <Card className="md:col-span-3">
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">
            {activeSection ? `Fields in ${activeSection}` : "Select a section"}
          </h3>
          
          {activeSection ? (
            sectionFields.length > 0 ? (
              <div className="space-y-4">
                {sectionFields.map((field) => (
                  <FieldConfigCard
                    key={field.id}
                    field={field}
                    onDelete={() => onDeleteField(field.id)}
                    onMoveUp={() => onMoveFieldUp(field.id)}
                    onMoveDown={() => onMoveFieldDown(field.id)}
                    onEdit={() => onEditField(field)}
                    onToggleActive={(active) => onToggleActive(field.id, active)}
                    isFirst={field.order === 0}
                    isLast={field.order === sectionFields.length - 1}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No fields in this section. Add a new field below.
              </div>
            )
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Please select a section from the left or create a new one.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Edit field modal component
interface FieldEditModalProps {
  field: FormField;
  onSave: (field: FormField) => void;
  onCancel: () => void;
  formSections: string[];
}

const FieldEditModal: React.FC<FieldEditModalProps> = ({
  field,
  onSave,
  onCancel,
  formSections
}) => {
  const [editedField, setEditedField] = useState<FormField>({...field});
  const [options, setOptions] = useState<string[]>(field.options || []);
  const [newOption, setNewOption] = useState<string>("");

  const handleAddOption = () => {
    if (newOption && !options.includes(newOption)) {
      const updatedOptions = [...options, newOption];
      setOptions(updatedOptions);
      setEditedField({...editedField, options: updatedOptions});
      setNewOption("");
    }
  };

  const handleRemoveOption = (option: string) => {
    const updatedOptions = options.filter(opt => opt !== option);
    setOptions(updatedOptions);
    setEditedField({...editedField, options: updatedOptions});
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <CardContent className="pt-6">
          <h3 className="text-xl font-semibold mb-4">Edit Field</h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-label">Field Label</Label>
              <Input
                id="edit-label"
                value={editedField.label}
                onChange={(e) => setEditedField({...editedField, label: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="edit-type">Field Type</Label>
              <Select 
                value={editedField.type} 
                onValueChange={(value) => setEditedField({...editedField, type: value as FormField["type"]})}
              >
                <SelectTrigger id="edit-type">
                  <SelectValue placeholder="Select field type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="select">Select</SelectItem>
                  <SelectItem value="textarea">Text Area</SelectItem>
                  <SelectItem value="checkbox">Checkbox</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="edit-placeholder">Placeholder</Label>
              <Input
                id="edit-placeholder"
                value={editedField.placeholder || ""}
                onChange={(e) => setEditedField({...editedField, placeholder: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="edit-section">Section</Label>
              <Select 
                value={editedField.section || ""} 
                onValueChange={(value) => setEditedField({...editedField, section: value})}
              >
                <SelectTrigger id="edit-section">
                  <SelectValue placeholder="Select section" />
                </SelectTrigger>
                <SelectContent>
                  {formSections.map(section => (
                    <SelectItem key={section} value={section}>{section}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <input
                id="edit-required"
                type="checkbox"
                checked={editedField.required}
                onChange={(e) => setEditedField({...editedField, required: e.target.checked})}
                className="h-4 w-4"
              />
              <Label htmlFor="edit-required">Required Field</Label>
            </div>
            
            {editedField.type === "select" && (
              <div>
                <Label>Options</Label>
                <div className="mt-2 space-y-2">
                  {options.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input value={option} disabled />
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleRemoveOption(option)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  
                  <div className="flex gap-2 mt-2">
                    <Input
                      placeholder="Add new option"
                      value={newOption}
                      onChange={(e) => setNewOption(e.target.value)}
                    />
                    <Button onClick={handleAddOption}>Add</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={() => onSave(editedField)}>
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FormFieldsConfiguration;
