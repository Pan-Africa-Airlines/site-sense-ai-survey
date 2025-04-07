
import React from "react";
import { NavLink } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { DesktopNavigationProps } from "./types";
import NavigationMenuContentComponent from "./NavigationMenuContent";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";

const DesktopNavigation: React.FC<DesktopNavigationProps> = ({ 
  navigationItems,
  theme,
  toggleTheme
}) => {
  // Function to check if a path is active
  const isActive = (path: string) => {
    if (typeof window !== 'undefined') {
      return window.location.pathname === path;
    }
    return false;
  };

  return (
    <>
      <div className="mr-4 hidden md:flex">
        <NavLink 
          to="/" 
          className="mr-6 flex items-center space-x-2 dark:text-white !duration-0 !transition-none"
        >
          <Logo />
        </NavLink>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuContent>
                <NavigationMenuContentComponent items={navigationItems} isActive={isActive} />
              </NavigationMenuContent>
              <NavigationMenuTrigger className="hidden h-auto w-auto bg-transparent p-0 font-normal md:flex text-base hover:bg-transparent !transition-none !duration-0">
                Navigation
              </NavigationMenuTrigger>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavLink 
                to="/my-allocations" 
                className={({ isActive }) => 
                  `group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium !transition-none !duration-0 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ${
                    isActive ? 'bg-accent text-accent-foreground' : ''
                  }`
                }
              >
                My Allocations
              </NavLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavLink 
                to="/eskom-survey/new" 
                className={({ isActive }) => 
                  `group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium !transition-none !duration-0 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ${
                    isActive ? 'bg-accent text-accent-foreground' : ''
                  }`
                }
              >
                Eskom Site Survey
              </NavLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavLink 
                to="/installation" 
                className={({ isActive }) => 
                  `group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium !transition-none !duration-0 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ${
                    isActive ? 'bg-accent text-accent-foreground' : ''
                  }`
                }
              >
                Installation
              </NavLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <div className="ml-auto flex items-center space-x-2">
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      </div>
    </>
  );
};

export default DesktopNavigation;
