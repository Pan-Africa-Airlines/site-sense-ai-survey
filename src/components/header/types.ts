
import { ReactNode } from "react";

export interface NavigationItem {
  title: string;
  href: string;
  description: string;
  icon: ReactNode;
}

export interface NavigationItemsProps {
  items: NavigationItem[];
  isActive: (path: string) => boolean;
}

export interface MobileNavigationProps {
  navigationItems: NavigationItem[];
  theme: string;
  toggleTheme: () => void;
}

export interface DesktopNavigationProps {
  navigationItems: NavigationItem[];
  theme: string;
  toggleTheme: () => void;
}

export interface MobileHeaderProps {
  navigationItems: NavigationItem[];
  theme: string;
  toggleTheme: () => void;
}

export interface ThemeToggleProps {
  theme: string;
  toggleTheme: () => void;
  isMobile?: boolean;
}
