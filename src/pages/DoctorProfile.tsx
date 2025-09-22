import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Camera, Edit, Save, X, Upload, User, Mail, Phone, Clock, FileText } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { usePermissions } from '@/components/auth/RoleGuard';
import { Doctor, mockApiService } from '@/services/mockApi';
import { toast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

const availabilityOptions = [
  { value: 'available', label: 'Available', color: 'bg-success' },
  { value: 'busy', label: 'Busy', color: 'bg-warning' },
  { value: 'unavailable', label: 'Unavailable', color: 'bg-destructive' },
  { value: 'on-call', label: 'On Call', color: 'bg-accent' },
];

export default function DoctorProfile() {
  const { user } = useAuth();
  const { hasPermission } = usePermissions();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock doctor data - in real app, this would be fetched based on route params or current user
  const [doctorData, setDoctorData] = useState<Doctor>({
    id: '1',
    name: 'Dr. Sarah Johnson',
    specialization: 'Cardiology',
    email: 'dr.johnson@hospital.com',
    phone: '+1-555-0101',
    photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face',
    bio: 'Experienced cardiologist with 15+ years in interventional cardiology. Specializes in heart disease prevention, diagnosis, and treatment. Board-certified in Internal Medicine and Cardiovascular Disease.',
    consultHours: '9:00 AM - 5:00 PM',
    availability: 'available',
    lastUpdated: new Date().toISOString(),
  });

  const [editForm, setEditForm] = useState<Partial<Doctor>>(doctorData);

  const canEdit = hasPermission('doctor_profile_edit') || hasPermission('all') || user?.id === doctorData.id;

  const handlePhotoUpload = async (file: File) => {
    if (!file) return;

    // Validate file
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a JPEG, PNG, or WebP image.',
        variant: 'destructive',
      });
      return;
    }

    if (file.size > maxSize) {
      toast({
        title: 'File too large',
        description: 'Please upload an image smaller than 5MB.',
        variant: 'destructive',
      });
      return;
    }

    setUploadingPhoto(true);
    try {
      const result = await mockApiService.uploadFile(file);
      const updatedDoctor = { ...doctorData, photo: result.url };
      setDoctorData(updatedDoctor);
      setEditForm(updatedDoctor);
      
      toast({
        title: 'Photo uploaded',
        description: 'Your profile photo has been updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: 'Failed to upload photo. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const updatedDoctor = await mockApiService.updateDoctorProfile(doctorData.id, editForm);
      setDoctorData(updatedDoctor);
      setIsEditing(false);
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been saved successfully.',
      });
    } catch (error) {
      toast({
        title: 'Save failed',
        description: 'Failed to save profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAvailabilityChange = async (availability: Doctor['availability']) => {
    try {
      const updatedDoctor = await mockApiService.updateDoctorAvailability(doctorData.id, availability);
      setDoctorData(updatedDoctor);
      
      toast({
        title: 'Availability updated',
        description: `Your status has been changed to ${availability}.`,
      });
    } catch (error) {
      toast({
        title: 'Update failed',
        description: 'Failed to update availability. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Doctor Profile</h1>
        {canEdit && (
          <div className="flex items-center space-x-2">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setEditForm(doctorData);
                  }}
                  disabled={loading}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={loading}>
                  {loading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <Card className="md:col-span-1">
          <CardHeader className="text-center">
            <div className="relative mx-auto w-32 h-32">
              <Avatar className="w-32 h-32">
                <AvatarImage src={doctorData.photo} />
                <AvatarFallback className="text-2xl">
                  {doctorData.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              {canEdit && (
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute bottom-0 right-0 rounded-full p-2"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingPhoto}
                >
                  {uploadingPhoto ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <Camera className="h-4 w-4" />
                  )}
                </Button>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handlePhotoUpload(file);
                }}
              />
            </div>
            
            <div className="space-y-2">
              <CardTitle className="text-xl">{doctorData.name}</CardTitle>
              <p className="text-muted-foreground">{doctorData.specialization}</p>
              
              {/* Availability Status */}
              <div className="flex items-center justify-center space-x-2">
                <Badge 
                  className={`${availabilityOptions.find(opt => opt.value === doctorData.availability)?.color} text-white`}
                >
                  {availabilityOptions.find(opt => opt.value === doctorData.availability)?.label}
                </Badge>
                
                {canEdit && (
                  <Select
                    value={doctorData.availability}
                    onValueChange={(value: Doctor['availability']) => handleAvailabilityChange(value)}
                  >
                    <SelectTrigger className="w-auto">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availabilityOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${option.color}`} />
                            <span>{option.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{doctorData.email}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{doctorData.phone}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{doctorData.consultHours}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Details Tabs */}
        <div className="md:col-span-2">
          <Tabs defaultValue="details" className="space-y-4">
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle>Professional Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={editForm.name || ''}
                            onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="specialization">Specialization</Label>
                          <Input
                            id="specialization"
                            value={editForm.specialization || ''}
                            onChange={(e) => setEditForm(prev => ({ ...prev, specialization: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={editForm.email || ''}
                            onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            value={editForm.phone || ''}
                            onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label htmlFor="consultHours">Consultation Hours</Label>
                          <Input
                            id="consultHours"
                            value={editForm.consultHours || ''}
                            onChange={(e) => setEditForm(prev => ({ ...prev, consultHours: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="bio">Professional Bio</Label>
                        <Textarea
                          id="bio"
                          value={editForm.bio || ''}
                          onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                          rows={4}
                          placeholder="Enter your professional background, expertise, and qualifications..."
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Full Name</Label>
                          <p className="mt-1">{doctorData.name}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Specialization</Label>
                          <p className="mt-1">{doctorData.specialization}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                          <p className="mt-1">{doctorData.email}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
                          <p className="mt-1">{doctorData.phone}</p>
                        </div>
                        <div className="md:col-span-2">
                          <Label className="text-sm font-medium text-muted-foreground">Consultation Hours</Label>
                          <p className="mt-1">{doctorData.consultHours}</p>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Professional Bio</Label>
                        <p className="mt-1 text-sm leading-relaxed">{doctorData.bio}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="schedule">
              <Card>
                <CardHeader>
                  <CardTitle>Schedule & Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Schedule management features would go here.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Analytics and performance metrics would go here.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}