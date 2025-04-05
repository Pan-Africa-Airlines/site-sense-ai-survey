import React, { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { useAI } from "@/contexts/AIContext";
import { ImageIcon, Loader, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  siteName: z.string().min(2, {
    message: "Site name must be at least 2 characters.",
  }),
  siteAddress: z.string().min(10, {
    message: "Site address must be at least 10 characters.",
  }),
  installationType: z.string().min(2, {
    message: "Installation type must be at least 2 characters.",
  }),
  customerName: z.string().min(2, {
    message: "Customer name must be at least 2 characters.",
  }),
  region: z.string().min(2, {
    message: "Region must be at least 2 characters.",
  }),
  contactPerson: z.string().min(2, {
    message: "Contact person must be at least 2 characters.",
  }),
  contactNumber: z.string().regex(/^0\d{9}$/, {
    message: "Contact number must be a valid South African number.",
  }),
  accessRequirements: z.string().min(10, {
    message: "Access requirements must be at least 10 characters.",
  }),
  coolingMethod: z.string().min(5, {
    message: "Cooling method must be at least 5 characters.",
  }),
  powerRequirements: z.string().min(5, {
    message: "Power requirements must be at least 5 characters.",
  }),
  installationDate: z.date(),
  isBackupPowerRequired: z.boolean().default(false),
  notes: z.string().optional(),
  imageData: z.string().optional(),
});

interface SiteInstallationFormProps {
  showAIRecommendations?: boolean;
}

const SiteInstallationForm: React.FC<SiteInstallationFormProps> = ({ showAIRecommendations = false }) => {
  const [formData, setFormData] = useState({
    siteName: "",
    siteAddress: "",
    installationType: "",
    customerName: "",
    region: "",
    contactPerson: "",
    contactNumber: "",
    accessRequirements: "",
    coolingMethod: "",
    powerRequirements: "",
    installationDate: new Date(),
    isBackupPowerRequired: false,
    notes: "",
    imageData: "",
  });
  const { toast } = useToast();
  const { enhanceNotes, isProcessing } = useAI();
  const [showAIAssistance, setShowAIAssistance] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      siteName: "",
      siteAddress: "",
      installationType: "",
      customerName: "",
      region: "",
      contactPerson: "",
      contactNumber: "",
      accessRequirements: "",
      coolingMethod: "",
      powerRequirements: "",
      installationDate: new Date(),
      isBackupPowerRequired: false,
      notes: "",
      imageData: "",
    },
  });

  const handleAIEnhancement = async () => {
    if (!formData.notes) return;
    
    const enhancedNotes = await enhanceNotes(formData.notes, "installation");
    
    setFormData({
      ...formData,
      notes: enhancedNotes
    });
  };

  const handleImageCapture = (imageData: string) => {
    setFormData({
      ...formData,
      imageData: imageData,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const checked = (e.target as HTMLInputElement).type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prevData => ({
      ...prevData,
      [name]: checked !== undefined ? checked : value
    }));
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData(prevData => ({
        ...prevData,
        installationDate: date
      }));
    }
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    toast({
      title: "Installation Form Submitted",
      description: "Your installation details have been submitted.",
    });
  };

  const handleNotesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const enhancedNotes = showAIAssistance 
      ? await enhanceNotes(formData.notes || "", "installation") 
      : formData.notes;
    
    setFormData({
      ...formData,
      notes: enhancedNotes || ""
    });
    
    toast({
      title: "Notes Saved",
      description: "Your installation notes have been saved.",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Installation Details</CardTitle>
        <CardDescription>Enter the details for the new site installation</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="siteName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Eskom Main Substation" {...field} onChange={handleChange} />
                    </FormControl>
                    <FormDescription>This is the official name of the site.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="siteAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Substation Road, Sandton" {...field} onChange={handleChange} />
                    </FormControl>
                    <FormDescription>The full street address of the site.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="installationType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Installation Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select installation type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="New Installation">New Installation</SelectItem>
                        <SelectItem value="Upgrade">Upgrade</SelectItem>
                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Type of installation being performed.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Eskom Holdings" {...field} onChange={handleChange} />
                    </FormControl>
                    <FormDescription>The name of the customer for this site.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Region</FormLabel>
                    <FormControl>
                      <Input placeholder="Gauteng" {...field} onChange={handleChange} />
                    </FormControl>
                    <FormDescription>The region where the site is located.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactPerson"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Person</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} onChange={handleChange} />
                    </FormControl>
                    <FormDescription>The contact person for this site.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contactNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Number</FormLabel>
                    <FormControl>
                      <Input placeholder="0821234567" {...field} onChange={handleChange} />
                    </FormControl>
                    <FormDescription>The contact number for this site.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="accessRequirements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Access Requirements</FormLabel>
                    <FormControl>
                      <Input placeholder="Security clearance, safety boots" {...field} onChange={handleChange} />
                    </FormControl>
                    <FormDescription>Any special access requirements for the site.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="coolingMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cooling Method</FormLabel>
                    <FormControl>
                      <Input placeholder="Air conditioning, water cooling" {...field} onChange={handleChange} />
                    </FormControl>
                    <FormDescription>The cooling method used at the site.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="powerRequirements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Power Requirements</FormLabel>
                    <FormControl>
                      <Input placeholder="220V, 3-phase" {...field} onChange={handleChange} />
                    </FormControl>
                    <FormDescription>The power requirements for the site.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="installationDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Installation Date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      onChange={(e) => {
                        const date = e.target.valueAsDate;
                        handleDateChange(date);
                        field.onChange(date);
                      }}
                    />
                  </FormControl>
                  <FormDescription>The date the installation is scheduled for.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isBackupPowerRequired"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>Backup Power Required</FormLabel>
                  <FormDescription>Check if backup power is required for this installation.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Additional notes about the installation"
                      className="resize-none"
                      {...field}
                      onChange={handleChange}
                    />
                  </FormControl>
                  <FormDescription>Any additional notes about the installation.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between items-center">
              <Button
                type="submit"
                className="bg-akhanya hover:bg-akhanya-dark"
              >
                Submit Installation
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleNotesSubmit}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Enhancing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Enhance Notes
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SiteInstallationForm;
