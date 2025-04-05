import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Home, MapPin, Clipboard, Network, FileSpreadsheet, ListChecks, Car } from "lucide-react";
import { useTheme } from "@/components/ui/use-theme";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const DynamicHeader: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <NavLink 
            to="/" 
            className="mr-6 flex items-center space-x-2 dark:text-white"
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
                    {[
                      {
                        title: "Dashboard",
                        href: "/",
                        description: "View system overview and metrics",
                        icon: <Home className="h-4 w-4" />,
                      },
                      {
                        title: "My Allocations",
                        href: "/my-allocations",
                        description: "View and manage your allocated sites",
                        icon: <MapPin className="h-4 w-4" />,
                      },
                      {
                        title: "Site Assessment",
                        href: "/assessment",
                        description: "Complete a new site assessment form",
                        icon: <Clipboard className="h-4 w-4" />,
                      },
                      {
                        title: "Installation",
                        href: "/installation",
                        description: "Submit network installation details",
                        icon: <Network className="h-4 w-4" />,
                      },
                      {
                        title: "Eskom Survey",
                        href: "/eskom-survey",
                        description: "Complete Eskom site survey",
                        icon: <FileSpreadsheet className="h-4 w-4" />,
                      },
                      {
                        title: "Survey History",
                        href: "/eskom-surveys",
                        description: "View completed Eskom surveys",
                        icon: <ListChecks className="h-4 w-4" />,
                      },
                      {
                        title: "Vehicle Check",
                        href: "/car-check",
                        description: "Complete a vehicle safety check",
                        icon: <Car className="h-4 w-4" />,
                      }
                    ].map((item) => (
                      <NavLink
                        key={item.title}
                        to={item.href}
                        className={({ isActive }) => 
                          `block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ${
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
                <NavigationMenuTrigger className="hidden h-auto w-auto bg-transparent p-0 font-normal md:flex text-base hover:bg-transparent">
                  Navigation
                </NavigationMenuTrigger>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavLink 
                  to="/my-allocations" 
                  className={({ isActive }) => 
                    `group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ${
                      isActive ? 'bg-accent text-accent-foreground' : ''
                    }`
                  }
                >
                  My Allocations
                </NavLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavLink 
                  to="/assessment" 
                  className={({ isActive }) => 
                    `group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ${
                      isActive ? 'bg-accent text-accent-foreground' : ''
                    }`
                  }
                >
                  Assessment
                </NavLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavLink 
                  to="/installation" 
                  className={({ isActive }) => 
                    `group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ${
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
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? "Light" : "Dark"}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default DynamicHeader;
