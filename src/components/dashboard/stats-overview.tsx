import { Users, Calendar, Clock, TrendingUp } from "lucide-react";
import { MedicalCard } from "@/components/ui/medical-card";

export function StatsOverview() {
  const stats = [
    {
      title: "Total Patients",
      value: "2,847",
      icon: <Users className="h-5 w-5" />,
      trend: "up" as const,
      trendValue: "+12%",
      description: "from last month",
      variant: "primary" as const,
    },
    {
      title: "Appointments Today",
      value: "32",
      icon: <Calendar className="h-5 w-5" />,
      trend: "up" as const,
      trendValue: "+4",
      description: "4 pending confirmations",
      variant: "healing" as const,
    },
    {
      title: "Average Wait Time",
      value: "18 min",
      icon: <Clock className="h-5 w-5" />,
      trend: "down" as const,
      trendValue: "-5 min",
      description: "improved efficiency",
      variant: "wellness" as const,
    },
    {
      title: "Patient Satisfaction",
      value: "96.8%",
      icon: <TrendingUp className="h-5 w-5" />,
      trend: "up" as const,
      trendValue: "+2.1%",
      description: "excellent rating",
      variant: "glass" as const,
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 fade-in">
      {stats.map((stat, index) => (
        <MedicalCard
          key={stat.title}
          variant={stat.variant}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          trend={stat.trend}
          trendValue={stat.trendValue}
          description={stat.description}
          className="hover:scale-105 transition-transform duration-200"
          style={{ animationDelay: `${index * 0.1}s` }}
        />
      ))}
    </div>
  );
}