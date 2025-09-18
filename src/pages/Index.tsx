import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { StatsOverview } from "@/components/dashboard/stats-overview";
import { RecentPatients } from "@/components/dashboard/recent-patients";
import { AppointmentsToday } from "@/components/dashboard/appointments-today";
import { Activity, Heart, TrendingUp } from "lucide-react";
import { MedicalCard } from "@/components/ui/medical-card";
import heroImage from "@/assets/health-vision-hero.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-dashboard">
      <Header />
      
      <div className="flex">
        <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] bg-sidebar border-r border-sidebar-border overflow-y-auto">
          <Sidebar />
        </aside>
        
        <main className="ml-64 flex-1 p-6 space-y-6">
          {/* Hero Section */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-primary p-8 text-primary-foreground shadow-floating">
            <div className="relative z-10 flex items-center justify-between">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold">Welcome back, Dr. Smith</h1>
                <p className="text-primary-foreground/90">
                  Your healthcare dashboard is ready. 32 appointments scheduled for today.
                </p>
                <div className="flex items-center space-x-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <Activity className="h-5 w-5" />
                    <span className="text-sm">System Status: Optimal</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Heart className="h-5 w-5 text-secondary" />
                    <span className="text-sm">Patient Care: Active</span>
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <img 
                  src={heroImage} 
                  alt="Health Vision Dashboard"
                  className="w-48 h-32 object-cover rounded-lg opacity-90 shadow-card"
                />
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent pointer-events-none" />
          </div>

          {/* Stats Overview */}
          <StatsOverview />

          {/* Main Dashboard Grid */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Recent Patients - Takes 2 columns */}
            <RecentPatients />
            
            {/* Today's Appointments - Takes 1 column */}
            <AppointmentsToday />
          </div>

          {/* Additional Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <MedicalCard
              variant="wellness"
              title="Health Metrics"
              value="All Systems"
              description="Hospital operations running smoothly"
              icon={<TrendingUp className="h-5 w-5" />}
              trend="stable"
              trendValue="Optimal"
            />
            
            <MedicalCard
              variant="healing" 
              title="Emergency Status"
              value="2 Active"
              description="Emergency room capacity available"
              icon={<Heart className="h-5 w-5" />}
              trend="up"
              trendValue="Normal"
            />

            <MedicalCard
              variant="primary"
              title="Staff On Duty"
              value="47 Active"
              description="Medical staff currently available"
              icon={<Activity className="h-5 w-5" />}
              trend="stable"
              trendValue="Full Staffed"
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
