// components/layout/owner/nav-items.ts
import { LayoutDashboard, TrendingUp, Car, Users, Settings, type LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  mobile: boolean; // show in the mobile bottom bar?
}

/** The ONE list every nav surface reads from. Add a tab here -> it appears everywhere. */
export const ownerNavItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/owner/dashboard",
    icon: LayoutDashboard,
    mobile: true,
  },
  { label: "Sales", href: "/owner/sales", icon: TrendingUp, mobile: true },
  { label: "Inventory", href: "/owner/inventory", icon: Car, mobile: true },
  { label: "Team", href: "/owner/team", icon: Users, mobile: true },
  { label: "Settings", href: "/owner/settings", icon: Settings, mobile: true },
];
