import React from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Sidebar } from '@/components/navigation/Sidebar';
import { LoginForm } from '@/components/auth/LoginForm';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user } = useAuth();

  if (!user) {
    return <LoginForm />;
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-4 md:p-6 pt-20 md:pt-6">
          {children}
        </div>
      </main>
    </div>
  );
}