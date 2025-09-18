import { Clock, MapPin, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MedicalCard } from "@/components/ui/medical-card";

const todaysAppointments = [
  {
    id: 1,
    time: "09:00",
    patient: "Alice Cooper",
    type: "Consultation",
    room: "Room 101",
    status: "confirmed",
    duration: "30 min",
  },
  {
    id: 2,
    time: "09:30",
    patient: "John Davis",
    type: "Follow-up",
    room: "Room 102",
    status: "in-progress",
    duration: "20 min",
  },
  {
    id: 3,
    time: "10:00",
    patient: "Maria Garcia",
    type: "Check-up",
    room: "Room 101", 
    status: "waiting",
    duration: "45 min",
  },
  {
    id: 4,
    time: "11:00",
    patient: "Robert Kim",
    type: "Consultation",
    room: "Room 103",
    status: "confirmed",
    duration: "30 min",
  },
  {
    id: 5,
    time: "14:30",
    patient: "Lisa Zhang",
    type: "Annual Physical",
    room: "Room 102",
    status: "confirmed",
    duration: "60 min",
  },
];

function getStatusColor(status: string) {
  switch (status) {
    case "confirmed":
      return "bg-primary/10 text-primary border-primary/20";
    case "in-progress":
      return "bg-secondary/10 text-secondary border-secondary/20";
    case "waiting":
      return "bg-warning/10 text-warning border-warning/20";
    case "completed":
      return "bg-success/10 text-success border-success/20";
    default:
      return "bg-muted/10 text-muted-foreground border-muted/20";
  }
}

export function AppointmentsToday() {
  return (
    <MedicalCard variant="default" className="h-fit">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Today's Appointments</h3>
          <p className="text-sm text-muted-foreground">5 appointments scheduled</p>
        </div>
        <Button variant="outline" size="sm">
          <Clock className="w-4 h-4 mr-1" />
          Manage
        </Button>
      </div>

      <div className="space-y-3">
        {todaysAppointments.map((appointment) => (
          <div
            key={appointment.id}
            className="flex items-center justify-between p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="text-center min-w-[60px]">
                <p className="text-sm font-medium">{appointment.time}</p>
                <p className="text-xs text-muted-foreground">{appointment.duration}</p>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <User className="h-3 w-3 text-muted-foreground" />
                  <p className="font-medium text-sm">{appointment.patient}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <p className="text-xs text-muted-foreground">{appointment.type}</p>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">{appointment.room}</p>
                  </div>
                </div>
              </div>
            </div>

            <Badge
              variant="outline"
              className={getStatusColor(appointment.status)}
            >
              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
            </Badge>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t">
        <Button variant="ghost" className="w-full text-primary hover:text-primary">
          View Full Schedule
        </Button>
      </div>
    </MedicalCard>
  );
}