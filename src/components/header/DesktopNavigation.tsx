
import React from "react";
import { NavLink } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { NavigationItem } from "./types";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";

interface DesktopNavigationProps {
  navigationItems: NavigationItem[];
  theme: string;
  toggleTheme: () => void;
}

const DesktopNavigation: React.FC<DesktopNavigationProps> = ({ 
  navigationItems,
  theme,
  toggleTheme
}) => {
  return (
    <>
      <div className="mr-4 hidden md:flex">
        <NavLink 
          to="/" 
          className="mr-6 flex items-center space-x-2 dark:text-white !duration-0 !transition-none"
        >
          <img 
            src="/lovable-uploads/d67b70d4-e9cc-436f-a32c-4063e2443190.png" 
            alt="Logo" 
            className="h-6 w-auto" 
          />
          <span className="font-bold">SiteSense</span>
        </NavLink>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  {navigationItems.map((item) => (
                    <NavLink
                      key={item.title}
                      to={item.href}
                      className={({ isActive }) => 
                        `block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none !transition-none !duration-0 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ${
                          isActive ? 'bg-accent text-accent-foreground' : ''
                        }`
                      }
                    >
                      <div className="flex items-center text-sm font-medium leading-none">
                        <div className="mr-2 text-akhanya">{item.icon}</div>
                        <div>{item.title}</div>
                      </div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {item.description}
                      </p>
                    </NavLink>
                  ))}
                </ul>
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
