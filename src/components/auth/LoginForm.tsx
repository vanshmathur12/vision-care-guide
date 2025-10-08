import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Stethoscope, Shield, User } from 'lucide-react';
import { useAuth } from './AuthProvider';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'doctor' | 'patient' | 'admin' | null>(null);
  const { login, switchRole } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole) {
      // For demo purposes, use the quick login
      switchRole(selectedRole);
    } else {
      await login(email, password);
    }
  };

  const roleOptions = [
    { role: 'doctor' as const, icon: Stethoscope, title: 'Doctor Portal', description: 'Access patient records and manage appointments', color: 'from-blue-500 to-cyan-500' },
    { role: 'patient' as const, icon: User, title: 'Patient Portal', description: 'View your health records and book appointments', color: 'from-green-500 to-emerald-500' },
    { role: 'admin' as const, icon: Shield, title: 'Admin Portal', description: 'Manage system and user accounts', color: 'from-purple-500 to-pink-500' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 p-4">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex items-center justify-center mb-4">
            <Heart className="h-10 w-10 sm:h-12 sm:w-12 text-primary mr-2" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">ValueKare EMR</h1>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground">
            Electronic Medical Records & Patient Navigation
          </p>
        </div>

        {!selectedRole ? (
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-center mb-6 sm:mb-8">Select Your Portal</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {roleOptions.map(({ role, icon: Icon, title, description, color }) => (
                <Card 
                  key={role}
                  className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 hover:border-primary"
                  onClick={() => setSelectedRole(role)}
                >
                  <CardContent className="p-6 sm:p-8 text-center">
                    <div className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-full bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
                      <Icon className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold mb-2">{title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">{description}</p>
                    <Button className="w-full mt-4" variant="outline">
                      Continue as {role.charAt(0).toUpperCase() + role.slice(1)}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <Card className="max-w-md mx-auto shadow-2xl">
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-center mb-4">
                {selectedRole === 'doctor' && <Stethoscope className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />}
                {selectedRole === 'patient' && <User className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />}
                {selectedRole === 'admin' && <Shield className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />}
              </div>
              <CardTitle className="text-xl sm:text-2xl text-center">
                {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Login
              </CardTitle>
              <CardDescription className="text-center">
                Enter your credentials to access your portal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="flex justify-end">
                  <a
                    href="/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot Password?
                  </a>
                </div>

                <Button type="submit" className="w-full">
                  Login
                </Button>
                
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="w-full"
                  onClick={() => setSelectedRole(null)}
                >
                  Back to Portal Selection
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
