
import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { 
  Breadcrumb as UiBreadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import { BreadcrumbProps } from "./types";

const NavigationBreadcrumb: React.FC<BreadcrumbProps> = ({ currentPageTitle }) => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-gray-900 border-t border-gray-700 border-b border-gray-700 h-12 !transition-none !duration-0">
      <div className="container mx-auto px-4 h-full flex items-center">
        <UiBreadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink 
                onClick={() => navigate("/")} 
                className="!transition-none !duration-0 text-gray-300 hover:text-white"
              >
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4 text-gray-500" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage className="text-white">{currentPageTitle}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </UiBreadcrumb>
      </div>
    </div>
  );
};

export default NavigationBreadcrumb;
