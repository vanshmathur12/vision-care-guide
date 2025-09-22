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
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Patient Search</h1>
          <p className="text-muted-foreground">
            Search for patients by name, phone number, or UHID
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Advanced Filter
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Patient
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
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button variant="outline" className="h-20 flex-col">
              <Search className="h-6 w-6 mb-2" />
              <span className="text-sm">Advanced Search</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Plus className="h-6 w-6 mb-2" />
              <span className="text-sm">Register New Patient</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Filter className="h-6 w-6 mb-2" />
              <span className="text-sm">Bulk Operations</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}