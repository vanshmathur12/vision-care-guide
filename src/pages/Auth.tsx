import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSignin, useSignup } from '@/hooks/useAuth';
import { UserCircle, Stethoscope, Shield } from 'lucide-react';

const signinSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signupSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
});

type SigninForm = z.infer<typeof signinSchema>;
type SignupForm = z.infer<typeof signupSchema>;

export default function Auth() {
  const [activeTab, setActiveTab] = useState('signin');
  const signinMutation = useSignin();
  const signupMutation = useSignup();

  const signinForm = useForm<SigninForm>({
    resolver: zodResolver(signinSchema),
  });

  const signupForm = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  const onSignin = (data: SigninForm) => {
    signinMutation.mutate({
      email: data.email,
      password: data.password,
    });
  };

  const onSignup = (data: SignupForm) => {
    signupMutation.mutate({
      username: data.username,
      email: data.email,
      password: data.password,
      phone: data.phone,
    });
  };

  const portalCards = [
    {
      icon: UserCircle,
      title: 'Patient Portal',
      description: 'Book appointments and manage your health records',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Stethoscope,
      title: 'Doctor Portal',
      description: 'Access patient records and manage appointments',
      color: 'text-green-500',
      bgColor: 'bg-green-50',
    },
    {
      icon: Shield,
      title: 'Admin Portal',
      description: 'Manage system users and hospital operations',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-5xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold">Healthcare Portal</h1>
          <p className="text-muted-foreground">Choose your portal to continue</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {portalCards.map((portal, idx) => (
            <Card key={idx} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="pt-6 text-center space-y-3">
                <div className={`w-16 h-16 ${portal.bgColor} rounded-full flex items-center justify-center mx-auto`}>
                  <portal.icon className={`h-8 w-8 ${portal.color}`} />
                </div>
                <h3 className="font-semibold">{portal.title}</h3>
                <p className="text-sm text-muted-foreground">{portal.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
            <CardDescription>Sign in to your account or create a new one</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="space-y-4">
                <form onSubmit={signinForm.handleSubmit(onSignin)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="your@email.com"
                      {...signinForm.register('email')}
                    />
                    {signinForm.formState.errors.email && (
                      <p className="text-sm text-destructive">{signinForm.formState.errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      {...signinForm.register('password')}
                    />
                    {signinForm.formState.errors.password && (
                      <p className="text-sm text-destructive">{signinForm.formState.errors.password.message}</p>
                    )}
                  </div>

                  <Button type="submit" className="w-full" disabled={signinMutation.isPending}>
                    {signinMutation.isPending ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={signupForm.handleSubmit(onSignup)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-username">Username</Label>
                    <Input
                      id="signup-username"
                      placeholder="johndoe"
                      {...signupForm.register('username')}
                    />
                    {signupForm.formState.errors.username && (
                      <p className="text-sm text-destructive">{signupForm.formState.errors.username.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your@email.com"
                      {...signupForm.register('email')}
                    />
                    {signupForm.formState.errors.email && (
                      <p className="text-sm text-destructive">{signupForm.formState.errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      {...signupForm.register('password')}
                    />
                    {signupForm.formState.errors.password && (
                      <p className="text-sm text-destructive">{signupForm.formState.errors.password.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-phone">Phone (Optional)</Label>
                    <Input
                      id="signup-phone"
                      type="tel"
                      placeholder="+1234567890"
                      {...signupForm.register('phone')}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={signupMutation.isPending}>
                    {signupMutation.isPending ? 'Creating account...' : 'Sign Up'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
