
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Import, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface ImageCaptureProps {
  onImageCaptured: (imageUrl: string) => void;
}

const ImageCapture: React.FC<ImageCaptureProps> = ({ onImageCaptured }) => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      
      // Upload to Supabase
      const { data, error } = await supabase.storage
        .from('lovable-uploads')
        .upload(`${crypto.randomUUID()}-${file.name}`, file);
      
      if (error) {
        throw error;
      }
      
      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('lovable-uploads')
        .getPublicUrl(data.path);
      
      setCapturedImage(publicUrlData.publicUrl);
      onImageCaptured(publicUrlData.publicUrl);
      
      toast({
        title: "Image uploaded",
        description: "Your image has been successfully uploaded.",
      });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const clearImage = () => {
    setCapturedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex space-x-2 mb-2">
        <Button
          type="button"
          variant="outline"
          onClick={triggerFileInput}
          disabled={uploading}
          className="flex items-center"
        >
          {uploading ? (
            "Uploading..."
          ) : (
            <>
              <Camera className="h-4 w-4 mr-2" /> Capture Photo
            </>
          )}
        </Button>
        
        <Button
          type="button"
          variant="outline"
          onClick={triggerFileInput}
          disabled={uploading}
          className="flex items-center"
        >
          <Import className="h-4 w-4 mr-2" /> Upload Image
        </Button>
        
        {capturedImage && (
          <Button
            type="button"
            variant="outline"
            className="flex items-center text-red-500 hover:text-red-700"
            onClick={clearImage}
          >
            <X className="h-4 w-4 mr-1" /> Clear
          </Button>
        )}
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        capture="environment"
      />
      
      {capturedImage && (
        <div className="mt-2">
          <img 
            src={capturedImage} 
            alt="Captured" 
            className="max-h-64 rounded-md object-contain"
          />
        </div>
      )}
    </div>
  );
};

export default ImageCapture;
