import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Edit, Save, X, User, Mail, Phone, Calendar, MapPin, UserCheck, FileText, History, Plus, Trash2 } from 'lucide-react';
import { Patient, HereditaryData, mockApiService } from '@/services/mockApi';
import { usePermissions } from '@/components/auth/RoleGuard';
import { toast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';

export default function PatientDetails() {
  const { id } = useParams<{ id: string }>();
  const { hasPermission } = usePermissions();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [hereditaryData, setHereditaryData] = useState<HereditaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingHereditary, setEditingHereditary] = useState(false);
  const [saving, setSaving] = useState(false);

  const canEdit = hasPermission('patient_write') || hasPermission('all');
  const canViewHereditary = hasPermission('patient_hereditary_read') || hasPermission('all');
  const canEditHereditary = hasPermission('patient_hereditary_write') || hasPermission('all');

  useEffect(() => {
    const fetchPatientData = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const [patientData, hereditaryInfo] = await Promise.all([
          mockApiService.getPatientById(id),
          canViewHereditary ? mockApiService.getHereditaryData(id) : null,
        ]);
        
        setPatient(patientData);
        setHereditaryData(hereditaryInfo);
      } catch (error) {
        console.error('Failed to fetch patient data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load patient data.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [id, canViewHereditary]);

  const handleSaveBasicInfo = async () => {
    if (!patient) return;
    
    setSaving(true);
    try {
      const updatedPatient = await mockApiService.updatePatient(patient.id, patient);
      setPatient(updatedPatient);
      setIsEditing(false);
      
      toast({
        title: 'Success',
        description: 'Patient information updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update patient information.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveHereditary = async () => {
    if (!hereditaryData || !patient) return;
    
    setSaving(true);
    try {
      const updatedData = await mockApiService.updateHereditaryData(patient.id, hereditaryData);
      setHereditaryData(updatedData);
      setEditingHereditary(false);
      
      toast({
        title: 'Success',
        description: 'Hereditary data updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update hereditary data.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const addFamilyCondition = (category: keyof HereditaryData['familyHistory']) => {
    if (!hereditaryData) return;
    
    const newCondition = { condition: '', onsetAge: undefined };
    setHereditaryData(prev => ({
      ...prev!,
      familyHistory: {
        ...prev!.familyHistory,
        [category]: [...prev!.familyHistory[category], newCondition],
      },
    }));
  };

  const removeFamilyCondition = (category: keyof HereditaryData['familyHistory'], index: number) => {
    if (!hereditaryData) return;
    
    setHereditaryData(prev => ({
      ...prev!,
      familyHistory: {
        ...prev!.familyHistory,
        [category]: prev!.familyHistory[category].filter((_, i) => i !== index),
      },
    }));
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <LoadingSpinner className="py-12" text="Loading patient data..." />
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="container mx-auto p-6">
        <EmptyState
          icon={<User className="h-12 w-12" />}
          title="Patient not found"
          description="The requested patient could not be found."
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Patient Details</h1>
          <p className="text-muted-foreground">UHID: {patient.uhid}</p>
        </div>
        {canEdit && (
          <div className="flex items-center space-x-2">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  disabled={saving}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSaveBasicInfo} disabled={saving}>
                  {saving ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </>
                  )}
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Patient
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {/* Patient Summary Card */}
        <Card className="md:col-span-1">
          <CardHeader className="text-center">
            <Avatar className="w-24 h-24 mx-auto">
              <AvatarImage src={patient.photo} />
              <AvatarFallback className="text-xl">
                {patient.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{patient.name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {patient.age} years • {patient.gender}
              </p>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="truncate">{patient.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{patient.phone}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{new Date(patient.dateOfBirth).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs">{patient.address}</span>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-medium text-sm mb-2">Emergency Contact</h4>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>{patient.emergencyContact.name}</p>
                <p>{patient.emergencyContact.phone}</p>
                <p className="capitalize">{patient.emergencyContact.relationship}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Patient Details Tabs */}
        <div className="md:col-span-3">
          <Tabs defaultValue="summary" className="space-y-4">
            <TabsList>
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="history">Medical History</TabsTrigger>
              <TabsTrigger value="hereditary">Hereditary Data</TabsTrigger>
              <TabsTrigger value="visits">Visits</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
            </TabsList>

            <TabsContent value="summary">
              <Card>
                <CardHeader>
                  <CardTitle>Patient Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={patient.name}
                            onChange={(e) => setPatient(prev => prev ? { ...prev, name: e.target.value } : null)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={patient.email}
                            onChange={(e) => setPatient(prev => prev ? { ...prev, email: e.target.value } : null)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            value={patient.phone}
                            onChange={(e) => setPatient(prev => prev ? { ...prev, phone: e.target.value } : null)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="dateOfBirth">Date of Birth</Label>
                          <Input
                            id="dateOfBirth"
                            type="date"
                            value={patient.dateOfBirth}
                            onChange={(e) => setPatient(prev => prev ? { ...prev, dateOfBirth: e.target.value } : null)}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label htmlFor="address">Address</Label>
                          <Textarea
                            id="address"
                            value={patient.address}
                            onChange={(e) => setPatient(prev => prev ? { ...prev, address: e.target.value } : null)}
                            rows={2}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Last Visit</Label>
                        <p className="mt-1">{new Date(patient.lastVisit).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">UHID</Label>
                        <p className="mt-1 font-mono">{patient.uhid}</p>
                      </div>
                      <div className="md:col-span-2">
                        <Label className="text-sm font-medium text-muted-foreground">Address</Label>
                        <p className="mt-1 text-sm">{patient.address}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="hereditary">
              {canViewHereditary ? (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <CardTitle>Hereditary Medical Data</CardTitle>
                    {canEditHereditary && (
                      <div className="flex items-center space-x-2">
                        {editingHereditary ? (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingHereditary(false)}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Cancel
                            </Button>
                            <Button size="sm" onClick={handleSaveHereditary} disabled={saving}>
                              {saving ? <LoadingSpinner size="sm" /> : <Save className="h-4 w-4 mr-1" />}
                              Save
                            </Button>
                          </>
                        ) : (
                          <Button size="sm" onClick={() => setEditingHereditary(true)}>
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        )}
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    {hereditaryData ? (
                      <div className="space-y-6">
                        {/* Family History */}
                        <div>
                          <h4 className="font-medium mb-4">Family History</h4>
                          
                          {Object.entries(hereditaryData.familyHistory).map(([category, conditions]) => (
                            <div key={category} className="mb-6">
                              <div className="flex items-center justify-between mb-3">
                                <Label className="font-medium capitalize">{category}</Label>
                                {editingHereditary && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => addFamilyCondition(category as keyof HereditaryData['familyHistory'])}
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                              
                              <div className="space-y-2">
                                {conditions.map((condition, index) => (
                                  <div key={index} className="flex items-center space-x-2 p-2 border rounded">
                                    {editingHereditary ? (
                                      <>
                                        <Input
                                          placeholder="Condition"
                                          value={condition.condition}
                                          onChange={(e) => {
                                            const newConditions = [...conditions];
                                            newConditions[index] = { ...condition, condition: e.target.value };
                                            setHereditaryData(prev => ({
                                              ...prev!,
                                              familyHistory: {
                                                ...prev!.familyHistory,
                                                [category]: newConditions,
                                              },
                                            }));
                                          }}
                                          className="flex-1"
                                        />
                                        <Input
                                          type="number"
                                          placeholder="Age"
                                          value={condition.onsetAge || ''}
                                          onChange={(e) => {
                                            const newConditions = [...conditions];
                                            newConditions[index] = { 
                                              ...condition, 
                                              onsetAge: e.target.value ? parseInt(e.target.value) : undefined 
                                            };
                                            setHereditaryData(prev => ({
                                              ...prev!,
                                              familyHistory: {
                                                ...prev!.familyHistory,
                                                [category]: newConditions,
                                              },
                                            }));
                                          }}
                                          className="w-20"
                                        />
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => removeFamilyCondition(category as keyof HereditaryData['familyHistory'], index)}
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </>
                                    ) : (
                                      <div className="flex-1">
                                        <span>{condition.condition}</span>
                                        {condition.onsetAge && (
                                          <span className="text-muted-foreground ml-2">
                                            (Age: {condition.onsetAge})
                                          </span>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                ))}
                                
                                {conditions.length === 0 && (
                                  <p className="text-sm text-muted-foreground italic">
                                    No {category} conditions recorded
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Genetic Risk Flags */}
                        <div>
                          <h4 className="font-medium mb-3">Genetic Risk Flags</h4>
                          <div className="flex flex-wrap gap-2">
                            {hereditaryData.geneticRiskFlags.map((flag, index) => (
                              <Badge key={index} variant="outline" className="bg-warning/10">
                                {flag}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Audit Info */}
                        <div className="text-xs text-muted-foreground pt-4 border-t">
                          <p>Last updated: {new Date(hereditaryData.lastUpdated).toLocaleString()}</p>
                          <p>Updated by: {hereditaryData.updatedBy}</p>
                          <p>Version: {hereditaryData.version}</p>
                        </div>
                      </div>
                    ) : (
                      <EmptyState
                        icon={<UserCheck className="h-8 w-8" />}
                        title="No hereditary data"
                        description="No family medical history has been recorded for this patient."
                      />
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="py-8">
                    <EmptyState
                      icon={<UserCheck className="h-8 w-8" />}
                      title="Access Restricted"
                      description="You don't have permission to view hereditary medical data."
                    />
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle>Medical History</CardTitle>
                </CardHeader>
                <CardContent>
                  <EmptyState
                    icon={<FileText className="h-8 w-8" />}
                    title="No medical history"
                    description="Medical history features will be implemented here."
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="visits">
              <Card>
                <CardHeader>
                  <CardTitle>Visit History</CardTitle>
                </CardHeader>
                <CardContent>
                  <EmptyState
                    icon={<Calendar className="h-8 w-8" />}
                    title="No visits recorded"
                    description="Patient visit history will be displayed here."
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="files">
              <Card>
                <CardHeader>
                  <CardTitle>Medical Files</CardTitle>
                </CardHeader>
                <CardContent>
                  <EmptyState
                    icon={<FileText className="h-8 w-8" />}
                    title="No files uploaded"
                    description="Medical documents and files will be shown here."
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}