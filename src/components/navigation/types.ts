
import { ReactNode } from "react";

export interface NavigationItem {
  title: string;
  path: string;
  icon: ReactNode;
}

export interface BreadcrumbProps {
  currentPageTitle: string;
}

export interface NavigationBarProps {
  isCompact?: boolean;
}

export interface UserMenuProps {
  isCompact?: boolean;
  onLogout: () => void;
}

export interface MainNavigationProps {
  isCompact?: boolean;
  iconSize: string;
  activePaths: Record<string, boolean>;
  onNavigate: (path: string) => void;
}

export interface LogoSectionProps {
  isCompact?: boolean;
}
