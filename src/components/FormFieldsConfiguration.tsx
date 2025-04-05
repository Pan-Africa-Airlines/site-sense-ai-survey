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

// Initial configuration with some example fields
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
    sections: ["Site Information", "Site Visit Attendees", "Equipment Details", "Power & Transport", "Annexures"],
    fields: [
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
        type: "text",
        label: "Region",
        placeholder: "Enter region",
        required: true,
        section: "Site Information",
        order: 1,
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
