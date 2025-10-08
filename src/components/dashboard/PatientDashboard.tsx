import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  FileText,
  Upload,
  Brain,
  Plus,
  QrCode
} from 'lucide-react';

const upcomingAppointments = [
  { id: 1, doctor: 'Dr. Sarah Johnson', date: '2024-01-20', time: '10:00 AM', type: 'Follow-up' },
  { id: 2, doctor: 'Dr. Mike Brown', date: '2024-01-25', time: '02:30 PM', type: 'Consultation' },
];

export function PatientDashboard() {
  const navigate = useNavigate();

  const handleRiskAssessment = () => {
    alert('Risk assessment feature would connect to AI API for health predictions');
  };

  const showQRCode = (appointmentId: number) => {
    alert(`QR Code for appointment ${appointmentId} would be displayed here`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Patient Dashboard</h1>
        <p className="text-muted-foreground">Monitor your health and manage appointments</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/book-appointment')}>
          <CardContent className="p-6 text-center">
            <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
            <h3 className="font-medium">Book Appointment</h3>
            <p className="text-sm text-muted-foreground">Schedule with doctors</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/upload-documents')}>
          <CardContent className="p-6 text-center">
            <Upload className="h-8 w-8 text-primary mx-auto mb-2" />
            <h3 className="font-medium">Upload Documents</h3>
            <p className="text-sm text-muted-foreground">Medical records & images</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/view-records')}>
          <CardContent className="p-6 text-center">
            <FileText className="h-8 w-8 text-primary mx-auto mb-2" />
            <h3 className="font-medium">View Records</h3>
            <p className="text-sm text-muted-foreground">Medical history</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow bg-accent" onClick={handleRiskAssessment}>
          <CardContent className="p-6 text-center">
            <Brain className="h-8 w-8 text-accent-foreground mx-auto mb-2" />
            <h3 className="font-medium text-accent-foreground">Check My Risk</h3>
            <p className="text-sm text-accent-foreground/80">AI Health Assessment</p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Appointments */}
      <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Upcoming Appointments</CardTitle>
                <CardDescription>Your scheduled medical appointments</CardDescription>
              </div>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Book New
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-3 sm:p-4 border rounded-lg">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium truncate">{appointment.doctor}</p>
                      <p className="text-sm text-muted-foreground">{appointment.type}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {appointment.date} at {appointment.time}
                      </p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-shrink-0 ml-2"
                    onClick={() => showQRCode(appointment.id)}
                  >
                    <QrCode className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
    </div>
  );
}