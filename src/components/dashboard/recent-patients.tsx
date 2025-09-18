import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MedicalCard } from "@/components/ui/medical-card";
import { Eye, Calendar } from "lucide-react";

const recentPatients = [
  {
    id: 1,
    name: "Emma Johnson",
    age: 28,
    condition: "Routine Checkup",
    status: "completed",
    time: "2 hours ago",
    avatar: "/avatars/patient-1.png",
    initials: "EJ",
  },
  {
    id: 2,
    name: "Michael Chen",
    age: 45,
    condition: "Hypertension Follow-up",
    status: "in-progress",
    time: "30 min ago",
    avatar: "/avatars/patient-2.png",
    initials: "MC",
  },
  {
    id: 3,
    name: "Sarah Williams",
    age: 62,
    condition: "Diabetes Management",
    status: "scheduled",
    time: "Next: 2:30 PM",
    avatar: "/avatars/patient-3.png",
    initials: "SW",
  },
  {
    id: 4,
    name: "David Brown",
    age: 33,
    condition: "Annual Physical",
    status: "completed",
    time: "1 day ago",
    avatar: "/avatars/patient-4.png",
    initials: "DB",
  },
];

function getStatusBadge(status: string) {
  switch (status) {
    case "completed":
      return <Badge variant="outline" className="bg-success/10 text-success border-success/20">Completed</Badge>;
    case "in-progress":
      return <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">In Progress</Badge>;
    case "scheduled":
      return <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">Scheduled</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
}

export function RecentPatients() {
  return (
    <MedicalCard variant="elevated" className="col-span-2">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Recent Patients</h3>
          <p className="text-sm text-muted-foreground">Latest patient interactions and appointments</p>
        </div>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </div>
      
      <div className="space-y-4">
        {recentPatients.map((patient) => (
          <div
            key={patient.id}
            className="flex items-center justify-between p-4 rounded-lg border bg-card/50 hover:bg-card/80 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={patient.avatar} alt={patient.name} />
                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                  {patient.initials}
                </AvatarFallback>
              </Avatar>
              
              <div className="space-y-1">
                <p className="font-medium">{patient.name}</p>
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-muted-foreground">Age {patient.age}</p>
                  <span className="text-muted-foreground">•</span>
                  <p className="text-sm text-muted-foreground">{patient.condition}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">{patient.time}</p>
                {getStatusBadge(patient.status)}
              </div>
              
              <div className="flex space-x-1">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Calendar className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </MedicalCard>
  );
}