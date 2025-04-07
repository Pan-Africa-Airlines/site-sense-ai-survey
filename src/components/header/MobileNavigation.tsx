
import React from "react";
import { NavLink } from "react-router-dom";
import { Menu, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";
import { MobileNavigationProps } from "./types";
import Logo from "./Logo";

const MobileNavigation: React.FC<MobileNavigationProps> = ({ 
  navigationItems,
  theme,
  toggleTheme
}) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden !duration-0 !transition-none">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] !duration-0 !transition-none">
        <div className="flex flex-col h-full">
          <div className="flex items-center mb-6">
            <Logo />
          </div>
          <nav className="space-y-1 flex-1">
            {navigationItems.map((item) => (
              <SheetClose asChild key={item.title}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) => 
                    `flex items-center gap-3 px-3 py-2 rounded-md text-sm ${
                      isActive 
                        ? 'bg-accent text-accent-foreground' 
                        : 'hover:bg-accent hover:text-accent-foreground'
                    } !duration-0 !transition-none`
                  }
                >
                  {item.icon}
                  {item.title}
                </NavLink>
              </SheetClose>
            ))}
          </nav>
          <div className="mt-auto pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              className="w-full justify-start !duration-0 !transition-none"
            >
              {theme === "dark" ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavigation;
