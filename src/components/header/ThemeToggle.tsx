
import React from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggleProps } from "./types";

const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  theme, 
  toggleTheme, 
  isMobile = false 
}) => {
  return (
    <Button
      variant="outline"
      size={isMobile ? "icon" : "sm"}
      onClick={toggleTheme}
      className="!duration-0 !transition-none"
    >
      {theme === "dark" ? (
        isMobile ? (
          <Sun className="h-4 w-4" />
        ) : (
          <>Light</>
        )
      ) : (
        isMobile ? (
          <Moon className="h-4 w-4" />
        ) : (
          <>Dark</>
        )
      )}
    </Button>
  );
};

export default ThemeToggle;
