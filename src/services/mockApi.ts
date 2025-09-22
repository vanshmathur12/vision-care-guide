// Mock API Service for EMR System
// This simulates backend API calls with realistic data and delays

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  email: string;
  phone: string;
  photo?: string;
  bio: string;
  consultHours: string;
  availability: 'available' | 'busy' | 'unavailable' | 'on-call';
  lastUpdated: string;
}

export interface Patient {
  id: string;
  uhid: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  photo?: string;
  lastVisit: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  address: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface HereditaryData {
  patientId: string;
  familyHistory: {
    parents: { condition: string; onsetAge?: number }[];
    siblings: { condition: string; onsetAge?: number }[];
    grandparents: { condition: string; onsetAge?: number }[];
  };
  geneticRiskFlags: string[];
  lastUpdated: string;
  updatedBy: string;
  version: number;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'doctor' | 'nurse' | 'hr' | 'receptionist';
  department: string;
  employmentStatus: 'active' | 'inactive' | 'on-leave';
  hireDate: string;
  permissions: string[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  timestamp: string;
  read: boolean;
  userId: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'in-progress';
  reason: string;
}

// Mock data
const mockDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    specialization: 'Cardiology',
    email: 'dr.johnson@hospital.com',
    phone: '+1-555-0101',
    photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face',
    bio: 'Experienced cardiologist with 15+ years in interventional cardiology.',
    consultHours: '9:00 AM - 5:00 PM',
    availability: 'available',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    specialization: 'Neurology',
    email: 'dr.chen@hospital.com',
    phone: '+1-555-0102',
    photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face',
    bio: 'Neurologist specializing in brain imaging and stroke care.',
    consultHours: '8:00 AM - 4:00 PM',
    availability: 'busy',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    specialization: 'Pediatrics',
    email: 'dr.rodriguez@hospital.com',
    phone: '+1-555-0103',
    bio: 'Pediatric specialist with expertise in childhood development.',
    consultHours: '10:00 AM - 6:00 PM',
    availability: 'unavailable',
    lastUpdated: new Date().toISOString(),
  },
];

const mockPatients: Patient[] = [
  {
    id: '1',
    uhid: 'ELG2024001',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1-555-1001',
    dateOfBirth: '1985-03-15',
    lastVisit: '2024-01-15',
    age: 39,
    gender: 'male',
    address: '123 Main St, City, State 12345',
    emergencyContact: {
      name: 'Jane Smith',
      phone: '+1-555-1002',
      relationship: 'Spouse',
    },
  },
  {
    id: '2',
    uhid: 'ELG2024002',
    name: 'Maria Garcia',
    email: 'maria.garcia@email.com',
    phone: '+1-555-1003',
    dateOfBirth: '1992-07-22',
    lastVisit: '2024-01-20',
    age: 31,
    gender: 'female',
    address: '456 Oak Ave, City, State 12345',
    emergencyContact: {
      name: 'Carlos Garcia',
      phone: '+1-555-1004',
      relationship: 'Father',
    },
  },
  {
    id: '3',
    uhid: 'ELG2024003',
    name: 'Robert Johnson',
    email: 'robert.johnson@email.com',
    phone: '+1-555-1005',
    dateOfBirth: '1978-11-03',
    lastVisit: '2024-01-18',
    age: 45,
    gender: 'male',
    address: '789 Pine Rd, City, State 12345',
    emergencyContact: {
      name: 'Lisa Johnson',
      phone: '+1-555-1006',
      relationship: 'Spouse',
    },
  },
];

const mockStaff: Staff[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@hospital.com',
    phone: '+1-555-2001',
    role: 'admin',
    department: 'Administration',
    employmentStatus: 'active',
    hireDate: '2020-01-15',
    permissions: ['all'],
  },
  {
    id: '2',
    name: 'Dr. Sarah Johnson',
    email: 'dr.johnson@hospital.com',
    phone: '+1-555-0101',
    role: 'doctor',
    department: 'Cardiology',
    employmentStatus: 'active',
    hireDate: '2018-03-20',
    permissions: ['patient_read', 'patient_write', 'prescription_write'],
  },
  {
    id: '3',
    name: 'Nurse Betty Wilson',
    email: 'nurse.wilson@hospital.com',
    phone: '+1-555-2002',
    role: 'nurse',
    department: 'General Medicine',
    employmentStatus: 'active',
    hireDate: '2019-08-10',
    permissions: ['patient_read', 'appointment_manage'],
  },
];

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'New Patient Registered',
    message: 'Maria Garcia has been registered with UHID: ELG2024002',
    type: 'info',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: false,
    userId: '1',
  },
  {
    id: '2',
    title: 'Doctor Status Updated',
    message: 'Dr. Michael Chen is now unavailable',
    type: 'warning',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    read: false,
    userId: '1',
  },
];

const mockAppointments: Appointment[] = [
  {
    id: '1',
    patientId: '1',
    doctorId: '1',
    patientName: 'John Smith',
    doctorName: 'Dr. Sarah Johnson',
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM',
    status: 'scheduled',
    reason: 'Regular checkup',
  },
  {
    id: '2',
    patientId: '2',
    doctorId: '2',
    patientName: 'Maria Garcia',
    doctorName: 'Dr. Michael Chen',
    date: new Date().toISOString().split('T')[0],
    time: '2:00 PM',
    status: 'in-progress',
    reason: 'Neurological consultation',
  },
];

// Utility to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API Service
export const mockApiService = {
  // Authentication
  async login(email: string, password: string): Promise<{ user: any; token: string }> {
    await delay(1000);
    
    // Mock authentication logic
    let role = 'patient';
    if (email.includes('dr.')) role = 'doctor';
    else if (email.includes('admin')) role = 'admin';
    else if (email.includes('nurse')) role = 'nurse';
    else if (email.includes('hr')) role = 'hr';
    else if (email.includes('reception')) role = 'receptionist';

    const user = {
      id: '1',
      name: email.includes('dr.') ? 'Dr. Sarah Johnson' : 'John Doe',
      email,
      role,
      permissions: role === 'admin' ? ['all'] : ['patient_read'],
    };

    return { user, token: 'mock-jwt-token-' + Date.now() };
  },

  // Doctor APIs
  async getDoctors(): Promise<Doctor[]> {
    await delay(500);
    return mockDoctors;
  },

  async getDoctorById(id: string): Promise<Doctor | null> {
    await delay(300);
    return mockDoctors.find(d => d.id === id) || null;
  },

  async updateDoctorAvailability(id: string, availability: Doctor['availability']): Promise<Doctor> {
    await delay(300);
    const doctor = mockDoctors.find(d => d.id === id);
    if (doctor) {
      doctor.availability = availability;
      doctor.lastUpdated = new Date().toISOString();
    }
    return doctor!;
  },

  async updateDoctorProfile(id: string, updates: Partial<Doctor>): Promise<Doctor> {
    await delay(500);
    const doctor = mockDoctors.find(d => d.id === id);
    if (doctor) {
      Object.assign(doctor, updates);
      doctor.lastUpdated = new Date().toISOString();
    }
    return doctor!;
  },

  // Patient APIs
  async searchPatients(query: string): Promise<Patient[]> {
    await delay(400);
    const searchTerm = query.toLowerCase();
    return mockPatients.filter(p => 
      p.name.toLowerCase().includes(searchTerm) ||
      p.phone.includes(searchTerm) ||
      p.uhid.toLowerCase().includes(searchTerm) ||
      p.email.toLowerCase().includes(searchTerm)
    );
  },

  async getPatientById(id: string): Promise<Patient | null> {
    await delay(300);
    return mockPatients.find(p => p.id === id) || null;
  },

  async getPatientByUhid(uhid: string): Promise<Patient | null> {
    await delay(300);
    return mockPatients.find(p => p.uhid === uhid) || null;
  },

  async updatePatient(id: string, updates: Partial<Patient>): Promise<Patient> {
    await delay(500);
    const patient = mockPatients.find(p => p.id === id);
    if (patient) {
      Object.assign(patient, updates);
    }
    return patient!;
  },

  // Hereditary Data APIs
  async getHereditaryData(patientId: string): Promise<HereditaryData | null> {
    await delay(400);
    // Mock hereditary data
    return {
      patientId,
      familyHistory: {
        parents: [
          { condition: 'Hypertension', onsetAge: 45 },
          { condition: 'Diabetes Type 2', onsetAge: 52 },
        ],
        siblings: [
          { condition: 'Allergies' },
        ],
        grandparents: [
          { condition: 'Heart Disease', onsetAge: 68 },
        ],
      },
      geneticRiskFlags: ['Cardiovascular Disease', 'Diabetes'],
      lastUpdated: new Date().toISOString(),
      updatedBy: 'Dr. Sarah Johnson',
      version: 1,
    };
  },

  async updateHereditaryData(patientId: string, data: Partial<HereditaryData>): Promise<HereditaryData> {
    await delay(600);
    return {
      patientId,
      ...data,
      lastUpdated: new Date().toISOString(),
      updatedBy: 'Current User',
      version: (data.version || 0) + 1,
    } as HereditaryData;
  },

  // Staff/HRM APIs
  async getStaff(): Promise<Staff[]> {
    await delay(500);
    return mockStaff;
  },

  async getStaffById(id: string): Promise<Staff | null> {
    await delay(300);
    return mockStaff.find(s => s.id === id) || null;
  },

  async createStaff(staff: Omit<Staff, 'id'>): Promise<Staff> {
    await delay(600);
    const newStaff = { ...staff, id: Date.now().toString() };
    mockStaff.push(newStaff);
    return newStaff;
  },

  async updateStaff(id: string, updates: Partial<Staff>): Promise<Staff> {
    await delay(500);
    const staff = mockStaff.find(s => s.id === id);
    if (staff) {
      Object.assign(staff, updates);
    }
    return staff!;
  },

  // Notification APIs
  async getNotifications(userId: string): Promise<Notification[]> {
    await delay(300);
    return mockNotifications.filter(n => n.userId === userId);
  },

  async markNotificationRead(id: string): Promise<void> {
    await delay(200);
    const notification = mockNotifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
    }
  },

  // Appointment APIs
  async getTodaysAppointments(): Promise<Appointment[]> {
    await delay(400);
    const today = new Date().toISOString().split('T')[0];
    return mockAppointments.filter(a => a.date === today);
  },

  async getAppointmentsByDoctor(doctorId: string): Promise<Appointment[]> {
    await delay(400);
    return mockAppointments.filter(a => a.doctorId === doctorId);
  },

  // Dashboard APIs
  async getDashboardStats(): Promise<any> {
    await delay(500);
    return {
      todayAppointments: mockAppointments.filter(a => a.date === new Date().toISOString().split('T')[0]).length,
      onDutyDoctors: mockDoctors.filter(d => d.availability !== 'unavailable').length,
      totalPatients: mockPatients.length,
      unreadNotifications: mockNotifications.filter(n => !n.read).length,
    };
  },

  // File Upload Mock
  async uploadFile(file: File): Promise<{ url: string; id: string }> {
    await delay(2000); // Simulate upload time
    const url = URL.createObjectURL(file);
    return { url, id: Date.now().toString() };
  },
};

// Mock WebSocket for real-time updates
export class MockWebSocket {
  private listeners: { [event: string]: Function[] } = {};
  
  on(event: string, callback: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  emit(event: string, data: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }

  // Simulate real-time events
  simulateAvailabilityChange() {
    const doctor = mockDoctors[Math.floor(Math.random() * mockDoctors.length)];
    const statuses: Doctor['availability'][] = ['available', 'busy', 'unavailable', 'on-call'];
    doctor.availability = statuses[Math.floor(Math.random() * statuses.length)];
    doctor.lastUpdated = new Date().toISOString();
    
    this.emit('doctor_availability_changed', doctor);
  }

  simulateNotification() {
    const newNotification: Notification = {
      id: Date.now().toString(),
      title: 'New Event',
      message: 'This is a simulated real-time notification',
      type: 'info',
      timestamp: new Date().toISOString(),
      read: false,
      userId: '1',
    };
    
    mockNotifications.unshift(newNotification);
    this.emit('new_notification', newNotification);
  }
}

export const mockWebSocket = new MockWebSocket();