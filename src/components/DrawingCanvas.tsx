
import React, { useRef, useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Pencil, Eraser, Square, Circle, Save, RotateCcw } from "lucide-react";

interface DrawingCanvasProps {
  onSave: (dataUrl: string) => void;
  initialValue?: string;
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ onSave, initialValue }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'pencil' | 'eraser' | 'square' | 'circle'>('pencil');
  const [color, setColor] = useState('#000000');
  const [size, setSize] = useState(2);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = 400;

    // Initialize canvas with white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    setContext(ctx);

    // Load initial drawing if provided
    if (initialValue) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
      };
      img.src = initialValue;
    }
  }, [initialValue]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas || !context) return;

      // Get the current drawing
      const imageData = canvas.toDataURL('image/png');
      
      // Resize canvas
      canvas.width = canvas.offsetWidth;
      
      // Redraw
      const img = new Image();
      img.onload = () => {
        context.drawImage(img, 0, 0);
      };
      img.src = imageData;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [context]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!context) return;
    
    setIsDrawing(true);
    
    // Get position
    let clientX, clientY;
    
    if ('touches' in e) {
      // Touch event
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      // Mouse event
      clientX = e.nativeEvent.offsetX;
      clientY = e.nativeEvent.offsetY;
    }
    
    if (tool === 'pencil' || tool === 'eraser') {
      context.beginPath();
      context.moveTo(clientX, clientY);
    } else {
      // For shapes, store start position
      setStartX(clientX);
      setStartY(clientY);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !context) return;
    
    // Get position
    let clientX, clientY;
    
    if ('touches' in e) {
      // Touch event
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
      
      // Prevent scrolling when drawing
      e.preventDefault();
    } else {
      // Mouse event
      clientX = e.nativeEvent.offsetX;
      clientY = e.nativeEvent.offsetY;
    }
    
    if (tool === 'pencil') {
      context.strokeStyle = color;
      context.lineWidth = size;
      context.lineCap = 'round';
      context.lineJoin = 'round';
      
      context.lineTo(clientX, clientY);
      context.stroke();
    } else if (tool === 'eraser') {
      context.strokeStyle = '#ffffff';
      context.lineWidth = size * 2;
      
      context.lineTo(clientX, clientY);
      context.stroke();
    }
  };

  const stopDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !context || !canvasRef.current) return;
    
    if (tool === 'square' || tool === 'circle') {
      let clientX, clientY;
      
      if ('changedTouches' in e) {
        // Touch event
        clientX = e.changedTouches[0].clientX;
        clientY = e.changedTouches[0].clientY;
      } else {
        // Mouse event
        clientX = e.nativeEvent.offsetX;
        clientY = e.nativeEvent.offsetY;
      }
      
      context.strokeStyle = color;
      context.lineWidth = size;
      context.fillStyle = 'transparent';
      
      if (tool === 'square') {
        const width = clientX - startX;
        const height = clientY - startY;
        context.strokeRect(startX, startY, width, height);
      } else if (tool === 'circle') {
        const radius = Math.sqrt(
          Math.pow(clientX - startX, 2) + Math.pow(clientY - startY, 2)
        );
        context.beginPath();
        context.arc(startX, startY, radius, 0, 2 * Math.PI);
        context.stroke();
      }
    }
    
    setIsDrawing(false);
  };

  const handleSave = () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL('image/png');
    onSave(dataUrl);
  };

  const clearCanvas = () => {
    if (!context || !canvasRef.current) return;
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2 items-center">
        <Button 
          type="button" 
          variant={tool === 'pencil' ? 'default' : 'outline'} 
          onClick={() => setTool('pencil')}
          size="sm"
        >
          <Pencil className="h-4 w-4 mr-1" /> Draw
        </Button>
        <Button 
          type="button" 
          variant={tool === 'eraser' ? 'default' : 'outline'} 
          onClick={() => setTool('eraser')}
          size="sm"
        >
          <Eraser className="h-4 w-4 mr-1" /> Erase
        </Button>
        <Button 
          type="button" 
          variant={tool === 'square' ? 'default' : 'outline'} 
          onClick={() => setTool('square')}
          size="sm"
        >
          <Square className="h-4 w-4 mr-1" /> Square
        </Button>
        <Button 
          type="button" 
          variant={tool === 'circle' ? 'default' : 'outline'} 
          onClick={() => setTool('circle')}
          size="sm"
        >
          <Circle className="h-4 w-4 mr-1" /> Circle
        </Button>
        <div className="flex items-center ml-2">
          <label htmlFor="color-picker" className="mr-1 text-sm">Color:</label>
          <input 
            id="color-picker"
            type="color" 
            value={color} 
            onChange={(e) => setColor(e.target.value)} 
            className="w-8 h-8 rounded cursor-pointer"
          />
        </div>
        <div className="flex items-center ml-2">
          <label htmlFor="size-picker" className="mr-1 text-sm">Size:</label>
          <input 
            id="size-picker"
            type="range" 
            min="1" 
            max="20" 
            value={size} 
            onChange={(e) => setSize(parseInt(e.target.value))} 
            className="w-24"
          />
        </div>
      </div>
      
      <div className="border border-gray-300 rounded-md overflow-hidden bg-white">
        <canvas
          ref={canvasRef}
          className="w-full touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>
      
      <div className="flex gap-2 justify-end">
        <Button 
          type="button" 
          variant="outline" 
          onClick={clearCanvas}
          size="sm"
        >
          <RotateCcw className="h-4 w-4 mr-1" /> Clear
        </Button>
        <Button 
          type="button" 
          onClick={handleSave}
          size="sm"
          className="bg-akhanya hover:bg-akhanya-dark"
        >
          <Save className="h-4 w-4 mr-1" /> Save Drawing
        </Button>
      </div>
    </div>
  );
};

export default DrawingCanvas;
