import React, { createContext, useContext, useState } from 'react';

export type UserRole = 'doctor' | 'patient' | 'admin' | 'hr' | 'nurse' | 'receptionist';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  permissions?: string[];
  department?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, phone?: string) => Promise<void>; // ✅ phone optional
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Mock users for demo
const mockUsers: Record<UserRole, User> = {
  doctor: {
    id: '1',
    name: 'Dr. Sarah Johnson',
    email: 'dr.johnson@hospital.com',
    role: 'doctor',
    permissions: ['patient_read', 'patient_write', 'prescription_write'],
    department: 'Cardiology'
  },
  patient: {
    id: '2',
    name: 'John Smith',
    email: 'john.smith@email.com',
    role: 'patient',
    permissions: ['own_records_read'],
  },
  admin: {
    id: '3',
    name: 'Admin User',
    email: 'admin@hospital.com',
    role: 'admin',
    permissions: ['all'],
    department: 'Administration'
  },
  hr: {
    id: '4',
    name: 'HR Manager',
    email: 'hr@hospital.com',
    role: 'hr',
    permissions: ['staff_read', 'staff_write', 'role_manage'],
    department: 'Human Resources'
  },
  nurse: {
    id: '5',
    name: 'Nurse Betty Wilson',
    email: 'nurse.wilson@hospital.com',
    role: 'nurse',
    permissions: ['patient_read', 'appointment_manage'],
    department: 'General Medicine'
  },
  receptionist: {
    id: '6',
    name: 'Reception Desk',
    email: 'reception@hospital.com',
    role: 'receptionist',
    permissions: ['patient_read', 'appointment_manage', 'patient_search'],
    department: 'Front Desk'
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string, phone?: string) => {
    // Mock login - in a real app this would be an API call
    const role: UserRole = email.includes('dr.')
      ? 'doctor'
      : email.includes('admin')
      ? 'admin'
      : 'patient';

    // Attach phone if provided
    setUser({
      ...mockUsers[role],
      email,
      phone: phone || undefined,
    });
  };

  const logout = () => setUser(null);

  const switchRole = (role: UserRole) => {
    setUser(mockUsers[role]);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}