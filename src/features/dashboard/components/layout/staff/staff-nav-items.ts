import {
  LayoutDashboard,
  Car,
  Users,
  Clock,
  CalendarCheck,
  Settings,
} from "lucide-react";

export interface StaffNavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  mobile?: boolean;
}

export interface StaffNavSection {
  id: string;
  items: StaffNavItem[];
}

export const staffNavSections: StaffNavSection[] = [
  {
    id: "main",
    items: [
      {
        href: "/staff/dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        mobile: true,
      },
      {
        href: "/staff/stock",
        label: "Inventory",
        icon: Car,
        mobile: true,
      },
    ],
  },
  {
    id: "crm",
    items: [
      {
        href: "/staff/leads",
        label: "Leads",
        icon: Users,
        mobile: true,
      },
      {
        href: "/staff/follow-ups",
        label: "Follow-ups",
        icon: Clock,
        mobile: true,
      },
      {
        href: "/staff/booking",
        label: "Booking",
        icon: CalendarCheck,
        mobile: true,
      },
    ],
  },
  {
    id: "settings",
    items: [
      {
        href: "/staff/setting",
        label: "Setting",
        icon: Settings,
        mobile: true,
      },
    ],
  },
];

export const staffNavItems: StaffNavItem[] = staffNavSections.flatMap(
  (section) => section.items
);
