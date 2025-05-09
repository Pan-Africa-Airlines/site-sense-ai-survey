import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { 
  Home, MapPin, FileSpreadsheet, Network, ListChecks, Car, Moon, Sun, Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

const DynamicHeader: React.FC = () => {
  const [theme, setTheme] = useState<string>("light");
  const [isMounted, setIsMounted] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    setIsMounted(true);
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const navigationItems = [
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
      title: "Eskom Survey",
      href: "/eskom-survey/new",
      description: "Create a new Eskom site survey",
      icon: <FileSpreadsheet className="h-4 w-4" />,
    },
    {
      title: "Installation",
      href: "/installation",
      description: "Submit network installation details",
      icon: <Network className="h-4 w-4" />,
    },
    {
      title: "Survey History",
      href: "/eskom-surveys",
      description: "View completed Eskom surveys",
      icon: <ListChecks className="h-4 w-4" />,
    },
    {
      title: "Vehicle Check",
      href: "/car-checkup",
      description: "Complete a vehicle safety check",
      icon: <Car className="h-4 w-4" />,
    }
  ];

  const headerHeight = "h-14";
  
  const MobileNavigation = () => (
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
            <img 
              src="/lovable-uploads/d67b70d4-e9cc-436f-a32c-4063e2443190.png" 
              alt="Logo" 
              className="h-6 w-auto mr-2" 
            />
            <span className="font-bold">SiteSense</span>
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

  return (
    <header className={`sticky top-0 z-50 w-full border-b bg-background/95 !duration-0 !transition-none`}>
      <div className={`${headerHeight} container flex items-center !duration-0 !transition-none`}>
        {isMobile ? (
          <>
            <MobileNavigation />
            <div className="mx-auto">
              <NavLink to="/" className="flex items-center space-x-2 dark:text-white !duration-0 !transition-none">
                <img 
                  src="/lovable-uploads/d67b70d4-e9cc-436f-a32c-4063e2443190.png" 
                  alt="Logo" 
                  className="h-6 w-auto" 
                />
                <span className="font-bold">SiteSense</span>
              </NavLink>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="!duration-0 !transition-none"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </>
        ) : (
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
                      to="/eskom-survey" 
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
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTheme}
                className="min-w-[70px] !transition-none !duration-0"
              >
                {theme === "dark" ? "Light" : "Dark"}
              </Button>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default DynamicHeader;
