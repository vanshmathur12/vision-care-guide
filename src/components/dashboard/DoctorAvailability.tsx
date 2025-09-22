import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { Doctor, mockApiService, mockWebSocket } from '@/services/mockApi';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { usePermissions } from '@/components/auth/RoleGuard';

const availabilityColors = {
  available: 'bg-success text-white',
  busy: 'bg-warning text-black',
  unavailable: 'bg-destructive text-white',
  'on-call': 'bg-accent text-white',
};

const availabilityLabels = {
  available: 'Available',
  busy: 'Busy',
  unavailable: 'Unavailable',
  'on-call': 'On Call',
};

export function DoctorAvailability() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const { hasPermission } = usePermissions();

  const canManageAvailability = hasPermission('doctor_availability_manage') || hasPermission('all');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await mockApiService.getDoctors();
        setDoctors(data);
      } catch (error) {
        console.error('Failed to fetch doctors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();

    // Set up real-time updates
    const handleAvailabilityChange = (updatedDoc: Doctor) => {
      setDoctors(prev => prev.map(doc => 
        doc.id === updatedDoc.id ? updatedDoc : doc
      ));
      setLastUpdated(new Date());
    };

    mockWebSocket.on('doctor_availability_changed', handleAvailabilityChange);

    return () => {
      // In a real app, you'd unsubscribe here
    };
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const data = await mockApiService.getDoctors();
      setDoctors(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to refresh doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const simulateStatusChange = () => {
    mockWebSocket.simulateAvailabilityChange();
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Doctor Availability</CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingSpinner />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Doctor Availability</CardTitle>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
          {process.env.NODE_ENV === 'development' && (
            <Button
              variant="outline"
              size="sm"
              onClick={simulateStatusChange}
            >
              Simulate Change
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
          
          <div className="space-y-3">
            {doctors.map((doctor) => (
              <div
                key={doctor.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-card/50 transition-all hover:bg-card"
              >
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={doctor.photo} />
                    <AvatarFallback>
                      {doctor.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{doctor.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {doctor.specialization}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge 
                    className={availabilityColors[doctor.availability]}
                    variant="secondary"
                  >
                    {availabilityLabels[doctor.availability]}
                  </Badge>
                  <div className="text-xs text-muted-foreground">
                    {doctor.consultHours}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}