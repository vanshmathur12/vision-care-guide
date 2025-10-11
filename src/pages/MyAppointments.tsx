import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMyAppointments, useCancelAppointment } from '@/hooks/useAppointments';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { Calendar, MapPin, Clock, User } from 'lucide-react';

export default function MyAppointments() {
  const { data: appointments, isLoading } = useMyAppointments();
  const cancelMutation = useCancelAppointment();

  const handleCancel = (id: string) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      cancelMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">My Appointments</h1>
        <p className="text-muted-foreground">View and manage your appointments</p>
      </div>

      {!appointments || appointments.length === 0 ? (
        <EmptyState title="No appointments" description="Book your first appointment!" />
      ) : (
        <div className="grid gap-4">
          {appointments.map((appointment) => (
            <Card key={appointment._id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      {appointment.doctorName}
                    </CardTitle>
                    <CardDescription>{appointment.doctorSpecialization}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={appointment.status === 'cancelled' ? 'destructive' : 'default'}>
                      {appointment.status}
                    </Badge>
                    <Badge variant={appointment.confirmationStatus === 'confirmed' ? 'default' : 'secondary'}>
                      {appointment.confirmationStatus}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{appointment.hospitalName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{appointment.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{appointment.time}</span>
                  </div>
                </div>

                {appointment.reason && (
                  <div className="pt-2 border-t">
                    <p className="text-sm text-muted-foreground">Reason</p>
                    <p className="text-sm">{appointment.reason}</p>
                  </div>
                )}

                {appointment.numericCode && (
                  <div className="pt-2 border-t">
                    <p className="text-sm text-muted-foreground">Appointment Code</p>
                    <p className="text-lg font-mono font-bold">{appointment.numericCode}</p>
                  </div>
                )}

                {appointment.status !== 'cancelled' && (
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleCancel(appointment._id!)}
                      disabled={cancelMutation.isPending}
                    >
                      {cancelMutation.isPending ? 'Cancelling...' : 'Cancel Appointment'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
