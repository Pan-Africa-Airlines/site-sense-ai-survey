
import React, { useState, useRef } from "react";
import { Camera, Image, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ImageCaptureProps {
  onCapture: (imageData: string) => void;
  label: string;
  description?: string;
  capturedImage?: string;
}

const ImageCapture: React.FC<ImageCaptureProps> = ({
  onCapture,
  label,
  description,
  capturedImage
}) => {
  const [image, setImage] = useState<string | null>(capturedImage || null);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setShowCamera(true);
      }
    } catch (err) {
      toast.error("Unable to access camera. Please check permissions.");
      console.error("Error accessing camera:", err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setShowCamera(false);
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL('image/jpeg');
      setImage(imageData);
      onCapture(imageData);
      stopCamera();
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setImage(imageData);
        onCapture(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    onCapture("");
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">{label}</label>
        {description && <p className="text-xs text-gray-500 mb-2">{description}</p>}
      </div>

      {image ? (
        <div className="relative rounded-md overflow-hidden">
          <img 
            src={image} 
            alt="Captured" 
            className="w-full h-auto max-h-60 object-contain bg-gray-100" 
          />
          <button 
            onClick={removeImage} 
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
            aria-label="Remove image"
          >
            <X size={20} />
          </button>
        </div>
      ) : showCamera ? (
        <div className="relative">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="w-full h-auto rounded-md border border-gray-300" 
          />
          <div className="flex justify-center mt-2 gap-2">
            <Button onClick={captureImage} variant="outline" size="sm">
              Take Photo
            </Button>
            <Button onClick={stopCamera} variant="outline" size="sm">
              Cancel
            </Button>
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-6 bg-gray-50">
          <div className="flex gap-2">
            <Button onClick={startCamera} variant="outline" size="sm">
              <Camera className="mr-2 h-4 w-4" />
              Use Camera
            </Button>
            <Button onClick={() => fileInputRef.current?.click()} variant="outline" size="sm">
              <Image className="mr-2 h-4 w-4" />
              Upload Image
            </Button>
          </div>
          <input 
            ref={fileInputRef}
            type="file" 
            accept="image/*" 
            onChange={handleFileUpload} 
            className="hidden" 
          />
        </div>
      )}
    </div>
  );
};

export default ImageCapture;
