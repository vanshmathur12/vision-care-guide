import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, User, Phone, Calendar, FileText } from 'lucide-react';
import { Patient, mockApiService } from '@/services/mockApi';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { usePermissions } from '@/components/auth/RoleGuard';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '@/hooks/useDebounce';

interface PatientSearchProps {
  onPatientSelect?: (patient: Patient) => void;
  placeholder?: string;
  autoFocus?: boolean;
  showResults?: boolean;
}

export function PatientSearch({ 
  onPatientSelect, 
  placeholder = "Search patients by name, phone, or UHID...",
  autoFocus = false,
  showResults = true 
}: PatientSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();
  
  const debouncedQuery = useDebounce(query, 300);

  const canSearchPatients = hasPermission('patient_search') || hasPermission('patient_read') || hasPermission('all');

  const searchPatients = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim() || !canSearchPatients) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    setLoading(true);
    try {
      const patients = await mockApiService.searchPatients(searchQuery);
      setResults(patients);
      setShowDropdown(true);
    } catch (error) {
      console.error('Failed to search patients:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [canSearchPatients]);

  useEffect(() => {
    searchPatients(debouncedQuery);
  }, [debouncedQuery, searchPatients]);

  const handlePatientClick = (patient: Patient) => {
    if (onPatientSelect) {
      onPatientSelect(patient);
    } else {
      navigate(`/patients/${patient.id}`);
    }
    setShowDropdown(false);
    setQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowDropdown(false);
      setQuery('');
    }
    if (e.key === 'Enter' && results.length === 1) {
      handlePatientClick(results[0]);
    }
  };

  if (!canSearchPatients) {
    return (
      <div className="text-center p-4">
        <p className="text-sm text-muted-foreground">
          You don't have permission to search patients.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (results.length > 0) setShowDropdown(true);
          }}
          onBlur={() => {
            // Delay hiding to allow for click events
            setTimeout(() => setShowDropdown(false), 200);
          }}
          className="pl-10 pr-4"
          autoFocus={autoFocus}
        />
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <LoadingSpinner size="sm" />
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showDropdown && showResults && query.length > 0 && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-96 overflow-hidden shadow-floating">
          <CardContent className="p-0">
            {loading ? (
              <div className="p-4 text-center">
                <LoadingSpinner size="sm" text="Searching..." />
              </div>
            ) : results.length === 0 ? (
              <EmptyState
                icon={<User className="h-6 w-6" />}
                title="No patients found"
                description={`No patients match "${query}"`}
                className="py-8"
              />
            ) : (
              <div className="max-h-80 overflow-y-auto">
                {results.map((patient) => (
                  <div
                    key={patient.id}
                    onClick={() => handlePatientClick(patient)}
                    className="flex items-center space-x-3 p-4 hover:bg-accent/50 cursor-pointer border-b last:border-b-0 transition-colors"
                  >
                    <Avatar>
                      <AvatarImage src={patient.photo} />
                      <AvatarFallback>
                        {patient.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{patient.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {patient.uhid}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span>{patient.age} years, {patient.gender}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Phone className="h-3 w-3" />
                          <span>{patient.phone}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>Last visit: {new Date(patient.lastVisit).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/patients/${patient.id}`);
                        }}
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Hook for debouncing search queries
export function useDebounceSearch() {
  return useDebounce;
}