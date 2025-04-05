import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useAI } from "@/contexts/AIContext";
import { ImageIcon } from "lucide-react";

const formSchema = z.object({
  siteName: z.string().min(2, {
    message: "Site name must be at least 2 characters.",
  }),
  siteAddress: z.string().min(10, {
    message: "Site address must be at least 10 characters.",
  }),
  siteType: z.string().min(3, {
    message: "Site type must be at least 3 characters.",
  }),
  customerName: z.string().min(2, {
    message: "Customer name must be at least 2 characters.",
  }),
  region: z.string().min(2, {
    message: "Region must be at least 2 characters.",
  }),
  accessRequirements: z.string().min(10, {
    message: "Access requirements must be at least 10 characters.",
  }),
  coolingMethod: z.string().min(5, {
    message: "Cooling method must be at least 5 characters.",
  }),
  powerSupplyAdequacy: z.string().min(5, {
    message: "Power supply adequacy must be at least 5 characters.",
  }),
  networkConnectivity: z.string().min(5, {
    message: "Network connectivity must be at least 5 characters.",
  }),
  environmentalConditions: z.string().min(5, {
    message: "Environmental conditions must be at least 5 characters.",
  }),
  securityMeasures: z.string().min(5, {
    message: "Security measures must be at least 5 characters.",
  }),
  expansionPotential: z.string().min(5, {
    message: "Expansion potential must be at least 5 characters.",
  }),
  regulatoryCompliance: z.string().min(5, {
    message: "Regulatory compliance must be at least 5 characters.",
  }),
  riskAssessment: z.string().min(5, {
    message: "Risk assessment must be at least 5 characters.",
  }),
  notes: z.string().optional(),
  imageUpload: z.string().optional(),
  terms: z.boolean({
    required_error: "You must accept the terms and conditions.",
  }),
});

import { Sparkles } from "lucide-react";

interface SiteAssessmentFormProps {
  showAIRecommendations?: boolean;
  initialData?: Record<string, any>;
}

const SiteAssessmentForm: React.FC<SiteAssessmentFormProps> = ({ 
  showAIRecommendations = false,
  initialData = {}
}) => {
  const { toast } = useToast();
  const { getSuggestion, enhanceNotes, analyzeImage } = useAI();
  const [formData, setFormData] = useState({
    siteName: initialData.siteName || "",
    siteAddress: initialData.siteAddress || "",
    siteType: initialData.siteType || "",
    customerName: initialData.customerName || "",
    region: initialData.region || "",
    accessRequirements: "",
    coolingMethod: "",
    powerSupplyAdequacy: "",
    networkConnectivity: "",
    environmentalConditions: "",
    securityMeasures: "",
    expansionPotential: "",
    regulatoryCompliance: "",
    riskAssessment: "",
    notes: "",
    imageUpload: "",
    terms: false,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      siteName: initialData.siteName || "",
      siteAddress: initialData.siteAddress || "",
      siteType: initialData.siteType || "",
      customerName: initialData.customerName || "",
      region: initialData.region || "",
      accessRequirements: "",
      coolingMethod: "",
      powerSupplyAdequacy: "",
      networkConnectivity: "",
      environmentalConditions: "",
      securityMeasures: "",
      expansionPotential: "",
      regulatoryCompliance: "",
      riskAssessment: "",
      notes: "",
      imageUpload: "",
      terms: false,
    },
  });

  React.useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData(prevData => ({
        ...prevData,
        ...initialData
      }));
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setFormData(prevData => ({
        ...prevData,
        imageUpload: base64String
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSuggestion = async (fieldName: string) => {
    const suggestion = await getSuggestion(fieldName, formData[fieldName as keyof typeof formData] as string);
    setFormData(prevData => ({
      ...prevData,
      [fieldName]: suggestion
    }));
  };

  const handleAIEnhancement = async () => {
    if (!formData.notes) return;
    
    const enhancedNotes = await enhanceNotes(formData.notes);
    
    setFormData({
      ...formData,
      notes: enhancedNotes
    });
  };

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Site Information</CardTitle>
            <CardDescription>Basic details about the installation site</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="siteName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Eskom Megawatt Park" {...field} value={formData.siteName} onChange={handleChange} />
                    </FormControl>
                    <FormDescription>
                      This is the official name of the site.
                    </FormDescription>
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
                      <Input placeholder="123 Main Street, Sunninghill" {...field} value={formData.siteAddress} onChange={handleChange} />
                    </FormControl>
                    <FormDescription>
                      The physical address of the site.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="siteType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site Type</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Substation">Substation</SelectItem>
                          <SelectItem value="Power Plant">Power Plant</SelectItem>
                          <SelectItem value="Transmission Station">Transmission Station</SelectItem>
                          <SelectItem value="Distribution Center">Distribution Center</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>
                      Choose the type of site being assessed.
                    </FormDescription>
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
                      <Input placeholder="Eskom Holdings" {...field} value={formData.customerName} onChange={handleChange} />
                    </FormControl>
                    <FormDescription>
                      The name of the customer or client.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Region</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a region" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Gauteng">Gauteng</SelectItem>
                        <SelectItem value="Western Cape">Western Cape</SelectItem>
                        <SelectItem value="KwaZulu-Natal">KwaZulu-Natal</SelectItem>
                        <SelectItem value="Eastern Cape">Eastern Cape</SelectItem>
                        <SelectItem value="Limpopo">Limpopo</SelectItem>
                        <SelectItem value="Mpumalanga">Mpumalanga</SelectItem>
                        <SelectItem value="North West">North West</SelectItem>
                        <SelectItem value="Free State">Free State</SelectItem>
                        <SelectItem value="Northern Cape">Northern Cape</SelectItem>
                      </SelectContent>
                    </FormControl>
                  <FormDescription>
                    Select the geographical region of the site.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Assessment Details</CardTitle>
            <CardDescription>Detailed evaluation of site requirements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="accessRequirements"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center">
                    <FormLabel>Access Requirements</FormLabel>
                    {showAIRecommendations && (
                      <Button type="button" variant="secondary" size="xs" onClick={() => handleSuggestion("accessRequirements")}>
                        Suggest
                      </Button>
                    )}
                  </div>
                  <FormControl>
                    <Textarea
                      placeholder="Detail any specific access requirements for the site"
                      className="resize-none"
                      {...field}
                      value={formData.accessRequirements}
                      onChange={handleChange}
                    />
                  </FormControl>
                  <FormDescription>
                    Specify any special access needs or restrictions.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="coolingMethod"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center">
                    <FormLabel>Cooling Method</FormLabel>
                    {showAIRecommendations && (
                      <Button type="button" variant="secondary" size="xs" onClick={() => handleSuggestion("coolingMethod")}>
                        Suggest
                      </Button>
                    )}
                  </div>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the cooling method used at the site"
                      className="resize-none"
                      {...field}
                      value={formData.coolingMethod}
                      onChange={handleChange}
                    />
                  </FormControl>
                  <FormDescription>
                    Describe how the site's equipment is cooled.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="powerSupplyAdequacy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Power Supply Adequacy</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Assess the adequacy of the power supply"
                      className="resize-none"
                      {...field}
                      value={formData.powerSupplyAdequacy}
                      onChange={handleChange}
                    />
                  </FormControl>
                  <FormDescription>
                    Evaluate if the power supply meets the site's needs.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="networkConnectivity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Network Connectivity</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the available network connectivity"
                      className="resize-none"
                      {...field}
                      value={formData.networkConnectivity}
                      onChange={handleChange}
                    />
                  </FormControl>
                  <FormDescription>
                    Detail the type and quality of network connections.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="environmentalConditions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Environmental Conditions</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the environmental conditions of the site"
                      className="resize-none"
                      {...field}
                      value={formData.environmentalConditions}
                      onChange={handleChange}
                    />
                  </FormControl>
                  <FormDescription>
                    Note any relevant environmental factors.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="securityMeasures"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Security Measures</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Outline the security measures in place"
                      className="resize-none"
                      {...field}
                      value={formData.securityMeasures}
                      onChange={handleChange}
                    />
                  </FormControl>
                  <FormDescription>
                    Describe the security protocols and systems.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expansionPotential"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expansion Potential</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Assess the potential for future expansion"
                      className="resize-none"
                      {...field}
                      value={formData.expansionPotential}
                      onChange={handleChange}
                    />
                  </FormControl>
                  <FormDescription>
                    Evaluate the site's capacity for growth.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="regulatoryCompliance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Regulatory Compliance</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detail any regulatory compliance requirements"
                      className="resize-none"
                      {...field}
                      value={formData.regulatoryCompliance}
                      onChange={handleChange}
                    />
                  </FormControl>
                  <FormDescription>
                    List any regulatory standards the site must meet.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="riskAssessment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Risk Assessment</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Summarize the risk assessment for the site"
                      className="resize-none"
                      {...field}
                      value={formData.riskAssessment}
                      onChange={handleChange}
                    />
                  </FormControl>
                  <FormDescription>
                    Outline potential risks and mitigation strategies.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
            <CardDescription>Any extra details or notes about the site</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center">
                    <FormLabel>Notes</FormLabel>
                    {showAIRecommendations && (
                      <Button type="button" variant="secondary" size="xs" onClick={handleAIEnhancement}>
                        Enhance
                      </Button>
                    )}
                  </div>
                  <FormControl>
                    <Textarea
                      placeholder="Enter any additional notes about the site"
                      className="resize-none"
                      {...field}
                      value={formData.notes}
                      onChange={handleChange}
                    />
                  </FormControl>
                  <FormDescription>
                    Include any relevant observations or details.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageUpload"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image Upload</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageCapture}
                    />
                  </FormControl>
                  <FormDescription>
                    Upload an image of the site for reference.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {formData.imageUpload && (
              <div className="relative w-32 h-32">
                <img
                  src={formData.imageUpload}
                  alt="Uploaded Site"
                  className="object-cover rounded-md"
                />
              </div>
            )}
          </CardContent>
        </Card>

        <FormField
          control={form.control}
          name="terms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Accept terms and conditions
                </FormLabel>
                <FormDescription>
                  Please read and accept our terms to proceed.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default SiteAssessmentForm;
