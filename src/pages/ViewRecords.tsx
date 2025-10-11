import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Search, Calendar, Pill, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const medicalRecords = [
  { id: 1, name: 'Blood Test Report', date: '2024-01-15', type: 'Lab Report', category: 'lab' },
  { id: 2, name: 'X-Ray Chest', date: '2024-01-10', type: 'Imaging', category: 'imaging' },
  { id: 3, name: 'Prescription - Jan 2024', date: '2024-01-08', type: 'Medication', category: 'prescription' },
  { id: 4, name: 'ECG Report', date: '2024-01-05', type: 'Diagnostic', category: 'diagnostic' },
  { id: 5, name: 'MRI Brain', date: '2023-12-20', type: 'Imaging', category: 'imaging' },
  { id: 6, name: 'Blood Sugar Report', date: '2023-12-15', type: 'Lab Report', category: 'lab' },
];

const appointments = [
  { id: 1, doctor: 'Dr. Sarah Johnson', date: '2024-01-20', type: 'Follow-up', status: 'upcoming' },
  { id: 2, doctor: 'Dr. Mike Brown', date: '2024-01-15', type: 'Consultation', status: 'completed' },
  { id: 3, doctor: 'Dr. Lisa Chen', date: '2024-01-08', type: 'Check-up', status: 'completed' },
];

export default function ViewRecords() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filteredRecords = medicalRecords.filter((record) => {
    const matchesSearch = record.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || record.category === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Medical Records</h1>
        <p className="text-muted-foreground">View and manage your health records</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 sm:grid-cols-5 w-full">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="lab">Lab Reports</TabsTrigger>
          <TabsTrigger value="imaging">Imaging</TabsTrigger>
          <TabsTrigger value="prescription">Prescriptions</TabsTrigger>
          <TabsTrigger value="diagnostic">Diagnostic</TabsTrigger>
        </TabsList>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={() => navigate('/upload-documents')}>
            <FileText className="h-4 w-4 mr-2" />
            Upload New
          </Button>
        </div>

        <TabsContent value={activeTab} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
              <CardDescription>Your medical documents and reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredRecords.map((record) => (
                  <div
                    key={record.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">{record.name}</p>
                        <div className="flex flex-wrap gap-2 items-center mt-1">
                          <Badge variant="outline" className="text-xs">
                            {record.type}
                          </Badge>
                          <p className="text-xs text-muted-foreground">{record.date}</p>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" className="flex-shrink-0">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Appointment History
              </CardTitle>
              <CardDescription>Your past and upcoming appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {appointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <p className="font-medium">{appointment.doctor}</p>
                        <p className="text-sm text-muted-foreground">{appointment.type}</p>
                        <p className="text-xs text-muted-foreground">{appointment.date}</p>
                      </div>
                    </div>
                    <Badge variant={appointment.status === 'upcoming' ? 'default' : 'secondary'}>
                      {appointment.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6">
        <Button variant="outline" className="w-full sm:w-auto" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}
