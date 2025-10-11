import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useDoctors, useCities, useSpecializations, useHospitals } from '@/hooks/useCatalog';
import { useBookAppointment } from '@/hooks/useAppointments';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { Search, Calendar, QrCode } from 'lucide-react';
import { Appointment } from '@/lib/api/types';

const bookingSchema = z.object({
  doctorId: z.string().min(1, 'Doctor is required'),
  hospitalId: z.string().min(1, 'Hospital is required'),
  cityId: z.string().min(1, 'City is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  reason: z.string().optional(),
});

type BookingForm = z.infer<typeof bookingSchema>;

export default function FindAndBook() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [confirmation, setConfirmation] = useState<Appointment | null>(null);

  const cityFilter = searchParams.get('city') || '';
  const specializationFilter = searchParams.get('specialization') || '';
  const hospitalFilter = searchParams.get('hospital') || '';
  const nameFilter = searchParams.get('name') || '';

  const { data: cities, isLoading: citiesLoading } = useCities();
  const { data: specializations, isLoading: specializationsLoading } = useSpecializations();
  const { data: hospitals, isLoading: hospitalsLoading } = useHospitals();
  
  const doctorParams = {
    ...(cityFilter && { city: cityFilter }),
    ...(specializationFilter && { specialization: specializationFilter }),
    ...(hospitalFilter && { hospital: hospitalFilter }),
    ...(nameFilter && { name: nameFilter }),
  };
  
  const { data: doctors, isLoading: doctorsLoading } = useDoctors(Object.keys(doctorParams).length > 0 ? doctorParams : undefined);
  
  const bookAppointmentMutation = useBookAppointment();

  const form = useForm<BookingForm>({
    resolver: zodResolver(bookingSchema),
  });

  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const handleBookAppointment = (doctorId: string) => {
    setSelectedDoctor(doctorId);
    form.setValue('doctorId', doctorId);
    setBookingModalOpen(true);
  };

  const onSubmitBooking = (data: BookingForm) => {
    bookAppointmentMutation.mutate(
      {
        doctorId: data.doctorId,
        hospitalId: data.hospitalId,
        cityId: data.cityId,
        date: data.date,
        time: data.time,
        reason: data.reason,
      },
      {
        onSuccess: (response) => {
          setBookingModalOpen(false);
          setConfirmation(response.appointment);
          form.reset();
        },
      }
    );
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Find & Book Appointment</h1>
        <p className="text-muted-foreground">Search for doctors and book appointments</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Filters
          </CardTitle>
          <CardDescription>Filter doctors by city, specialization, or hospital</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>City</Label>
              <Select value={cityFilter} onValueChange={(v) => updateFilter('city', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="All cities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All cities</SelectItem>
                  {cities?.map((city) => (
                    <SelectItem key={city._id} value={city._id}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Specialization</Label>
              <Select value={specializationFilter} onValueChange={(v) => updateFilter('specialization', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="All specializations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All specializations</SelectItem>
                  {specializations?.map((spec) => (
                    <SelectItem key={spec._id} value={spec._id}>
                      {spec.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Hospital</Label>
              <Select value={hospitalFilter} onValueChange={(v) => updateFilter('hospital', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="All hospitals" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All hospitals</SelectItem>
                  {hospitals?.map((hospital) => (
                    <SelectItem key={hospital._id} value={hospital._id}>
                      {hospital.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Doctor Name</Label>
              <Input
                placeholder="Search by name..."
                value={nameFilter}
                onChange={(e) => updateFilter('name', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {doctorsLoading ? (
        <LoadingSpinner />
      ) : !doctors || doctors.length === 0 ? (
        <EmptyState title="No doctors found" description="Try adjusting your filters." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {doctors.map((doctor) => (
            <Card key={doctor._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{doctor.name}</CardTitle>
                <CardDescription>{doctor.specialization}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {doctor.email && <p className="text-sm text-muted-foreground">{doctor.email}</p>}
                {doctor.phone && <p className="text-sm text-muted-foreground">{doctor.phone}</p>}
                <Button onClick={() => handleBookAppointment(doctor._id)} className="w-full mt-4">
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Appointment
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={bookingModalOpen} onOpenChange={setBookingModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Book Appointment</DialogTitle>
            <DialogDescription>Fill in the details to book your appointment</DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmitBooking)} className="space-y-4">
            <div className="space-y-2">
              <Label>Hospital</Label>
              <Select onValueChange={(v) => form.setValue('hospitalId', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select hospital" />
                </SelectTrigger>
                <SelectContent>
                  {hospitals?.map((hospital) => (
                    <SelectItem key={hospital._id} value={hospital._id}>
                      {hospital.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.hospitalId && (
                <p className="text-sm text-destructive">{form.formState.errors.hospitalId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>City</Label>
              <Select onValueChange={(v) => form.setValue('cityId', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {cities?.map((city) => (
                    <SelectItem key={city._id} value={city._id}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.cityId && (
                <p className="text-sm text-destructive">{form.formState.errors.cityId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" {...form.register('date')} />
              {form.formState.errors.date && (
                <p className="text-sm text-destructive">{form.formState.errors.date.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Time</Label>
              <Input type="time" {...form.register('time')} />
              {form.formState.errors.time && (
                <p className="text-sm text-destructive">{form.formState.errors.time.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Reason (Optional)</Label>
              <Textarea {...form.register('reason')} placeholder="Describe your symptoms..." rows={3} />
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1" disabled={bookAppointmentMutation.isPending}>
                {bookAppointmentMutation.isPending ? 'Booking...' : 'Confirm Booking'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setBookingModalOpen(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!confirmation} onOpenChange={() => setConfirmation(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Appointment Confirmed!</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-center">
            {confirmation?.qrImage && (
              <div className="flex justify-center">
                <img src={confirmation.qrImage} alt="QR Code" className="w-48 h-48" />
              </div>
            )}
            {confirmation?.numericCode && (
              <div>
                <p className="text-sm text-muted-foreground">Numeric Code</p>
                <p className="text-2xl font-bold">{confirmation.numericCode}</p>
              </div>
            )}
            <div className="space-y-1">
              <p className="font-semibold">{confirmation?.doctorName}</p>
              <p className="text-sm text-muted-foreground">{confirmation?.doctorSpecialization}</p>
              <p className="text-sm text-muted-foreground">{confirmation?.hospitalName}</p>
              <p className="text-sm">{confirmation?.date} at {confirmation?.time}</p>
            </div>
            <Button onClick={() => setConfirmation(null)} className="w-full">
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
