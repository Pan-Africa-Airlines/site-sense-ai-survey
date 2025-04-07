
import React from 'react';
import { 
  Gauge, 
  Tractor, 
  Wrench, 
  LightbulbIcon, 
  Fuel, 
  ShieldCheck 
} from "lucide-react";

export type CheckItemId = 'tires' | 'oil' | 'brakes' | 'lights' | 'fuel' | 'safety';

export interface CheckItem {
  id: CheckItemId;
  title: string;
  description: string;
  icon: React.ReactNode;
  voicePrompt: string;
}

export const checkItems: CheckItem[] = [
  {
    id: "tires",
    title: "Tire Pressure & Condition",
    description: "Inspect all tires for proper inflation and adequate tread depth. Look for any cuts, bulges, or uneven wear patterns.",
    icon: <Gauge className="h-10 w-10 text-blue-500" />,
    voicePrompt: "Please check all tires for proper inflation and good tread depth. Look for any cuts, bulges, or uneven wear patterns. Press confirm when complete."
  },
  {
    id: "oil",
    title: "Engine Oil Level",
    description: "Check the oil level using the dipstick. Ensure it's between the minimum and maximum markings and has a clean amber color.",
    icon: <Tractor className="h-10 w-10 text-yellow-600" />,
    voicePrompt: "Please check the engine oil level using the dipstick. Make sure it's between the minimum and maximum markings and has a clean amber color. Press confirm when complete."
  },
  {
    id: "brakes",
    title: "Brake Function",
    description: "Verify brake pedal responsiveness and check brake fluid level. The fluid should be clear and at the proper level.",
    icon: <Wrench className="h-10 w-10 text-red-500" />,
    voicePrompt: "Please verify brake pedal responsiveness and check the brake fluid level. The fluid should be clear and at the proper level. Press confirm when complete."
  },
  {
    id: "lights",
    title: "Lights & Signals",
    description: "Test all exterior lights including headlights, brake lights, turn signals, and hazard lights to ensure they function properly.",
    icon: <LightbulbIcon className="h-10 w-10 text-amber-400" />,
    voicePrompt: "Please test all exterior lights including headlights, brake lights, turn signals, and hazard lights to ensure they function properly. Press confirm when complete."
  },
  {
    id: "fuel",
    title: "Fuel Level",
    description: "Confirm you have sufficient fuel for your planned journey. Fill up if the tank is less than one-quarter full.",
    icon: <Fuel className="h-10 w-10 text-green-500" />,
    voicePrompt: "Please confirm you have sufficient fuel for your planned journey. Fill up if the tank is less than one-quarter full. Press confirm when complete."
  },
  {
    id: "safety",
    title: "Safety Equipment",
    description: "Verify presence of required safety equipment: warning triangle, first aid kit, reflective vest, and fire extinguisher.",
    icon: <ShieldCheck className="h-10 w-10 text-purple-500" />,
    voicePrompt: "Please verify the presence of all required safety equipment: warning triangle, first aid kit, reflective vest, and fire extinguisher. Press confirm when complete."
  }
];
