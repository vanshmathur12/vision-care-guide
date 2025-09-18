import { 
  Calendar, 
  Users, 
  FileText, 
  BarChart3, 
  Heart, 
  Stethoscope,
  Pill,
  UserCheck,
  Clock,
  TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

const sidebarItems = [
  {
    title: "Dashboard",
    icon: BarChart3,
    href: "/dashboard",
    active: true,
  },
  {
    title: "Patients",
    icon: Users,
    href: "/patients",
  },
  {
    title: "Appointments",
    icon: Calendar,
    href: "/appointments",
  },
  {
    title: "Medical Records",
    icon: FileText,
    href: "/records",
  },
  {
    title: "Diagnostics",
    icon: Stethoscope,
    href: "/diagnostics",
  },
  {
    title: "Medications",
    icon: Pill,
    href: "/medications",
  },
  {
    title: "Vitals",
    icon: Heart,
    href: "/vitals",
  },
  {
    title: "Analytics",
    icon: TrendingUp,
    href: "/analytics",
  },
];

export function Sidebar({ className }: SidebarProps) {
  const [activeItem, setActiveItem] = useState("Dashboard");

  return (
    <div className={cn("pb-12 w-64", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-primary">
            Medical Center
          </h2>
          <div className="space-y-1">
            {sidebarItems.map((item) => (
              <Button
                key={item.title}
                variant={activeItem === item.title ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start transition-all duration-200",
                  activeItem === item.title && "bg-primary shadow-medical"
                )}
                onClick={() => setActiveItem(item.title)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.title}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-secondary">
            Quick Actions
          </h2>
          <div className="space-y-1">
            <Button variant="outline" className="w-full justify-start border-secondary/20 text-secondary hover:bg-secondary/10">
              <UserCheck className="mr-2 h-4 w-4" />
              New Patient
            </Button>
            <Button variant="outline" className="w-full justify-start border-accent/20 text-accent hover:bg-accent/10">
              <Clock className="mr-2 h-4 w-4" />
              Schedule Appointment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}