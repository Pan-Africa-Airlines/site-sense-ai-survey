
import React from "react";
import { useTheme } from "@/components/hooks/use-theme";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

interface ThemeSwitcherProps {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ 
  variant = "outline", 
  size = "default" 
}) => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Button 
      variant={variant} 
      size={size} 
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className={size === "icon" ? "h-[1.2rem] w-[1.2rem]" : "h-[1.2rem] w-[1.2rem] mr-2"} />
      ) : (
        <Moon className={size === "icon" ? "h-[1.2rem] w-[1.2rem]" : "h-[1.2rem] w-[1.2rem] mr-2"} />
      )}
      {size !== "icon" && (theme === "dark" ? "Light mode" : "Dark mode")}
    </Button>
  );
};

export default ThemeSwitcher;
