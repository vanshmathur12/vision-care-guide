import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Plus, Filter } from 'lucide-react';
import { PatientSearch as PatientSearchComponent } from '@/components/search/PatientSearch';
import { usePermissions } from '@/components/auth/RoleGuard';
import { EmptyState } from '@/components/common/EmptyState';

export default function PatientSearchPage() {
  const { hasPermission } = usePermissions();
  const canSearchPatients = hasPermission('patient_search') || hasPermission('patient_read') || hasPermission('all');

  if (!canSearchPatients) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <EmptyState
            icon={<Search className="h-12 w-12" />}
            title="Access Restricted"
            description="You don't have permission to search for patients."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-4 md:space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Patient Search</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Search for patients by name, phone number, or UHID
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="md:size-default">
            <Filter className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Advanced Filter</span>
          </Button>
          <Button size="sm" className="md:size-default">
            <Plus className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Add Patient</span>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Search Patients</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <PatientSearchComponent 
              placeholder="Search by patient name, phone number, or UHID..."
              autoFocus
            />
            
            <div className="text-sm text-muted-foreground">
              <h4 className="font-medium mb-2">Search Tips:</h4>
              <ul className="space-y-1 text-xs">
                <li>• Use partial names or phone numbers for broader results</li>
                <li>• UHID searches are exact match</li>
                <li>• Search is case-insensitive</li>
                <li>• Results appear as you type (debounced)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
            <Button variant="outline" className="h-16 md:h-20 flex-col">
              <Search className="h-5 w-5 md:h-6 md:w-6 mb-1 md:mb-2" />
              <span className="text-xs md:text-sm">Advanced Search</span>
            </Button>
            <Button variant="outline" className="h-16 md:h-20 flex-col">
              <Plus className="h-5 w-5 md:h-6 md:w-6 mb-1 md:mb-2" />
              <span className="text-xs md:text-sm">Register New Patient</span>
            </Button>
            <Button variant="outline" className="h-16 md:h-20 flex-col">
              <Filter className="h-5 w-5 md:h-6 md:w-6 mb-1 md:mb-2" />
              <span className="text-xs md:text-sm">Bulk Operations</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}