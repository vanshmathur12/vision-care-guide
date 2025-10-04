import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Heart, Users, Calendar, FileText, Settings, LogOut, Stethoscope, UserCheck, Shield, Activity, Upload, MessageSquare, BarChart3, Menu } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const navigationConfig = {
  doctor: [{
    name: 'Dashboard',
    path: '/dashboard',
    icon: Activity
  }, {
    name: 'Profile',
    path: '/doctor-profile',
    icon: UserCheck
  }, {
    name: 'Patient Search',
    path: '/patient-search',
    icon: Users
  }, {
    name: 'Appointments',
    path: '/appointments',
    icon: Calendar
  }, {
    name: 'Prescriptions',
    path: '/prescriptions',
    icon: Stethoscope
  }],
  patient: [{
    name: 'Dashboard',
    path: '/dashboard',
    icon: Activity
  }, {
    name: 'My Records',
    path: '/my-records',
    icon: FileText
  }, {
    name: 'Appointments',
    path: '/appointments',
    icon: Calendar
  }, {
    name: 'Documents',
    path: '/documents',
    icon: Upload
  }, {
    name: 'Risk Assessment',
    path: '/risk-assessment',
    icon: UserCheck
  }],
  admin: [{
    name: 'Dashboard',
    path: '/dashboard',
    icon: BarChart3
  }, {
    name: 'HRM',
    path: '/hrm',
    icon: Users
  }, {
    name: 'Patient Search',
    path: '/patient-search',
    icon: FileText
  }, {
    name: 'Analytics',
    path: '/analytics',
    icon: Activity
  }, {
    name: 'Settings',
    path: '/settings',
    icon: Settings
  }],
  hr: [{
    name: 'Dashboard',
    path: '/dashboard',
    icon: BarChart3
  }, {
    name: 'HRM',
    path: '/hrm',
    icon: Users
  }, {
    name: 'Staff Reports',
    path: '/reports',
    icon: FileText
  }],
  nurse: [{
    name: 'Dashboard',
    path: '/dashboard',
    icon: Activity
  }, {
    name: 'Patient Search',
    path: '/patient-search',
    icon: Users
  }, {
    name: 'Appointments',
    path: '/appointments',
    icon: Calendar
  }],
  receptionist: [{
    name: 'Dashboard',
    path: '/dashboard',
    icon: Activity
  }, {
    name: 'Patient Search',
    path: '/patient-search',
    icon: Users
  }, {
    name: 'Appointments',
    path: '/appointments',
    icon: Calendar
  }, {
    name: 'Check-in',
    path: '/checkin',
    icon: UserCheck
  }]
};

function SidebarContent({ user, navigation, logout }: { user: any; navigation: any[]; logout: () => void }) {
  return (
    <>
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <Heart className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-bold text-primary">Valuekare EMR</h1>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarFallback>
              {user.name.split(' ').map((n: string) => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navigation.map(item => (
          <NavLink 
            key={item.path} 
            to={item.path} 
            className={({ isActive }) => 
              `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <Button 
          onClick={logout} 
          variant="ghost" 
          className="w-full justify-start text-muted-foreground hover:text-foreground"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </>
  );
}

export function Sidebar() {
  const { user, logout } = useAuth();
  const isMobile = useIsMobile();
  
  if (!user) return null;
  
  const navigation = navigationConfig[user.role] || [];

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50 md:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex flex-col h-full bg-card">
            <SidebarContent user={user} navigation={navigation} logout={logout} />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className="w-64 bg-card border-r border-border h-screen flex flex-col">
      <SidebarContent user={user} navigation={navigation} logout={logout} />
    </div>
  );
}