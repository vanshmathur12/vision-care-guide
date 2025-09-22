import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, Bell, Stethoscope } from 'lucide-react';
import { mockApiService } from '@/services/mockApi';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

interface DashboardStatsData {
  todayAppointments: number;
  onDutyDoctors: number;
  totalPatients: number;
  unreadNotifications: number;
}

export function DashboardStats() {
  const [stats, setStats] = useState<DashboardStatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await mockApiService.getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <LoadingSpinner className="py-8" />;
  }

  if (!stats) {
    return null;
  }

  const statCards = [
    {
      title: "Today's Appointments",
      value: stats.todayAppointments,
      icon: Calendar,
      description: 'Scheduled for today',
      color: 'text-primary',
    },
    {
      title: 'On-Duty Doctors',
      value: stats.onDutyDoctors,
      icon: Stethoscope,
      description: 'Currently available',
      color: 'text-success',
    },
    {
      title: 'Total Patients',
      value: stats.totalPatients,
      icon: Users,
      description: 'Registered in system',
      color: 'text-accent',
    },
    {
      title: 'Notifications',
      value: stats.unreadNotifications,
      icon: Bell,
      description: 'Unread messages',
      color: 'text-warning',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="transition-all hover:shadow-medical">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}