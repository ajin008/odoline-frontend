import {
  LayoutDashboard,
  Car,
  Users,
  CalendarCheck,
  Settings,
} from "lucide-react";

export interface StaffNavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  mobile?: boolean;
}

export const staffNavItems: StaffNavItem[] = [
  {
    href: "/staff/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    mobile: true,
  },
  {
    href: "/staff/stock",
    label: "Stock",
    icon: Car,
    mobile: true,
  },
  {
    href: "/staff/leads",
    label: "Leads",
    icon: Users,
    mobile: true,
  },
  {
    href: "/staff/booking",
    label: "Booking",
    icon: CalendarCheck,
    mobile: true,
  },
  {
    href: "/staff/setting",
    label: "Setting",
    icon: Settings,
    mobile: true,
  },
];
