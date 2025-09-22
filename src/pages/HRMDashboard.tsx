import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Users, Plus, Edit, Trash2, Search, Filter, Download, UserPlus, Shield, Building } from 'lucide-react';
import { Staff, mockApiService } from '@/services/mockApi';
import { usePermissions } from '@/components/auth/RoleGuard';
import { toast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';

const roleColors = {
  admin: 'bg-destructive text-destructive-foreground',
  doctor: 'bg-primary text-primary-foreground',
  nurse: 'bg-accent text-accent-foreground',
  hr: 'bg-secondary text-secondary-foreground',
  receptionist: 'bg-muted text-muted-foreground',
};

const statusColors = {
  active: 'bg-success text-white',
  inactive: 'bg-destructive text-destructive-foreground',
  'on-leave': 'bg-warning text-black',
};

const availablePermissions = [
  'patient_read', 'patient_write', 'patient_search',
  'doctor_read', 'doctor_write', 'doctor_availability_manage',
  'staff_read', 'staff_write', 'role_manage',
  'appointment_read', 'appointment_write', 'appointment_manage',
  'prescription_write', 'patient_hereditary_read', 'patient_hereditary_write',
  'all'
];

export default function HRMDashboard() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [filteredStaff, setFilteredStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [newStaff, setNewStaff] = useState<Omit<Staff, 'id'>>({
    name: '',
    email: '',
    phone: '',
    role: 'receptionist',
    department: '',
    employmentStatus: 'active',
    hireDate: new Date().toISOString().split('T')[0],
    permissions: [],
  });

  const { hasPermission } = usePermissions();
  const canManageStaff = hasPermission('staff_write') || hasPermission('all');
  const canManageRoles = hasPermission('role_manage') || hasPermission('all');

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const data = await mockApiService.getStaff();
        setStaff(data);
        setFilteredStaff(data);
      } catch (error) {
        console.error('Failed to fetch staff:', error);
        toast({
          title: 'Error',
          description: 'Failed to load staff data.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  // Filter staff based on search and filters
  useEffect(() => {
    let filtered = staff;

    if (searchQuery) {
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.department.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter(s => s.role === roleFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(s => s.employmentStatus === statusFilter);
    }

    setFilteredStaff(filtered);
  }, [staff, searchQuery, roleFilter, statusFilter]);

  const handleAddStaff = async () => {
    try {
      const created = await mockApiService.createStaff(newStaff);
      setStaff(prev => [...prev, created]);
      setShowAddDialog(false);
      setNewStaff({
        name: '',
        email: '',
        phone: '',
        role: 'receptionist',
        department: '',
        employmentStatus: 'active',
        hireDate: new Date().toISOString().split('T')[0],
        permissions: [],
      });
      
      toast({
        title: 'Success',
        description: 'Staff member added successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add staff member.',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateStaff = async () => {
    if (!editingStaff) return;
    
    try {
      const updated = await mockApiService.updateStaff(editingStaff.id, editingStaff);
      setStaff(prev => prev.map(s => s.id === updated.id ? updated : s));
      setShowEditDialog(false);
      setEditingStaff(null);
      
      toast({
        title: 'Success',
        description: 'Staff member updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update staff member.',
        variant: 'destructive',
      });
    }
  };

  const handlePermissionToggle = (permission: string, isEditing = false) => {
    if (isEditing && editingStaff) {
      const newPermissions = editingStaff.permissions.includes(permission)
        ? editingStaff.permissions.filter(p => p !== permission)
        : [...editingStaff.permissions, permission];
      
      setEditingStaff({ ...editingStaff, permissions: newPermissions });
    } else {
      const newPermissions = newStaff.permissions.includes(permission)
        ? newStaff.permissions.filter(p => p !== permission)
        : [...newStaff.permissions, permission];
      
      setNewStaff({ ...newStaff, permissions: newPermissions });
    }
  };

  const exportStaffData = () => {
    const csvContent = [
      ['Name', 'Email', 'Role', 'Department', 'Status', 'Hire Date'],
      ...filteredStaff.map(s => [
        s.name,
        s.email,
        s.role,
        s.department,
        s.employmentStatus,
        s.hireDate
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'staff_export.csv';
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'Success',
      description: 'Staff data exported successfully.',
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <LoadingSpinner className="py-12" text="Loading HRM data..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Human Resource Management</h1>
          <p className="text-muted-foreground">Manage hospital staff and roles</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={exportStaffData}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          {canManageStaff && (
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Staff
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Staff Member</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={newStaff.name}
                        onChange={(e) => setNewStaff(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newStaff.email}
                        onChange={(e) => setNewStaff(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={newStaff.phone}
                        onChange={(e) => setNewStaff(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        value={newStaff.department}
                        onChange={(e) => setNewStaff(prev => ({ ...prev, department: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="role">Role</Label>
                      <Select value={newStaff.role} onValueChange={(value: Staff['role']) => setNewStaff(prev => ({ ...prev, role: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="doctor">Doctor</SelectItem>
                          <SelectItem value="nurse">Nurse</SelectItem>
                          <SelectItem value="hr">HR</SelectItem>
                          <SelectItem value="receptionist">Receptionist</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="hireDate">Hire Date</Label>
                      <Input
                        id="hireDate"
                        type="date"
                        value={newStaff.hireDate}
                        onChange={(e) => setNewStaff(prev => ({ ...prev, hireDate: e.target.value }))}
                      />
                    </div>
                  </div>
                  
                  {canManageRoles && (
                    <div>
                      <Label>Permissions</Label>
                      <div className="grid gap-2 md:grid-cols-3 mt-2">
                        {availablePermissions.map(permission => (
                          <div key={permission} className="flex items-center space-x-2">
                            <Checkbox
                              id={permission}
                              checked={newStaff.permissions.includes(permission)}
                              onCheckedChange={() => handlePermissionToggle(permission)}
                            />
                            <Label htmlFor={permission} className="text-sm">
                              {permission.replace('_', ' ')}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddStaff}>
                      Add Staff Member
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <Tabs defaultValue="staff" className="space-y-4">
        <TabsList>
          <TabsTrigger value="staff">Staff Management</TabsTrigger>
          <TabsTrigger value="roles">Role Management</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="staff">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Staff Directory</CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search staff..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="doctor">Doctor</SelectItem>
                      <SelectItem value="nurse">Nurse</SelectItem>
                      <SelectItem value="hr">HR</SelectItem>
                      <SelectItem value="receptionist">Receptionist</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="on-leave">On Leave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredStaff.length === 0 ? (
                <EmptyState
                  icon={<Users className="h-8 w-8" />}
                  title="No staff found"
                  description="No staff members match your search criteria."
                />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Hire Date</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStaff.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{member.name}</div>
                            <div className="text-sm text-muted-foreground">{member.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={roleColors[member.role]}>
                            {member.role}
                          </Badge>
                        </TableCell>
                        <TableCell>{member.department}</TableCell>
                        <TableCell>
                          <Badge className={statusColors[member.employmentStatus]}>
                            {member.employmentStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(member.hireDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {canManageStaff && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingStaff(member);
                                setShowEditDialog(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles">
          <Card>
            <CardHeader>
              <CardTitle>Role & Permission Management</CardTitle>
            </CardHeader>
            <CardContent>
              {canManageRoles ? (
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Role-based access control system with granular permissions.
                  </p>
                  {/* Role management UI would go here */}
                  <EmptyState
                    icon={<Shield className="h-8 w-8" />}
                    title="Role Management"
                    description="Advanced role and permission management features will be implemented here."
                  />
                </div>
              ) : (
                <EmptyState
                  icon={<Shield className="h-8 w-8" />}
                  title="Access Restricted"
                  description="You don't have permission to manage roles and permissions."
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>HR Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <EmptyState
                icon={<Building className="h-8 w-8" />}
                title="Analytics Dashboard"
                description="HR analytics and reporting features will be displayed here."
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Staff Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Staff Member</DialogTitle>
          </DialogHeader>
          {editingStaff && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="editName">Full Name</Label>
                  <Input
                    id="editName"
                    value={editingStaff.name}
                    onChange={(e) => setEditingStaff(prev => prev ? { ...prev, name: e.target.value } : null)}
                  />
                </div>
                <div>
                  <Label htmlFor="editEmail">Email</Label>
                  <Input
                    id="editEmail"
                    type="email"
                    value={editingStaff.email}
                    onChange={(e) => setEditingStaff(prev => prev ? { ...prev, email: e.target.value } : null)}
                  />
                </div>
                <div>
                  <Label htmlFor="editStatus">Employment Status</Label>
                  <Select
                    value={editingStaff.employmentStatus}
                    onValueChange={(value: Staff['employmentStatus']) => setEditingStaff(prev => prev ? { ...prev, employmentStatus: value } : null)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="on-leave">On Leave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="editDepartment">Department</Label>
                  <Input
                    id="editDepartment"
                    value={editingStaff.department}
                    onChange={(e) => setEditingStaff(prev => prev ? { ...prev, department: e.target.value } : null)}
                  />
                </div>
              </div>
              
              {canManageRoles && (
                <div>
                  <Label>Permissions</Label>
                  <div className="grid gap-2 md:grid-cols-3 mt-2">
                    {availablePermissions.map(permission => (
                      <div key={permission} className="flex items-center space-x-2">
                        <Checkbox
                          id={`edit-${permission}`}
                          checked={editingStaff.permissions.includes(permission)}
                          onCheckedChange={() => handlePermissionToggle(permission, true)}
                        />
                        <Label htmlFor={`edit-${permission}`} className="text-sm">
                          {permission.replace('_', ' ')}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateStaff}>
                  Update Staff Member
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}