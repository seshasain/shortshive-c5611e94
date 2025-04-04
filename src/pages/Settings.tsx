
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Settings as SettingsIcon, CreditCard, User, Bell, Key, Laptop, Shield, PowerOff, Loader2, PlusCircle } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { getProfile, updateProfile } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

interface UserProfile {
  id: string;
  name: string;
  full_name?: string;
  email?: string;
  phone_number?: string;
  country?: string;
  profession?: string;
  avatar_url?: string;
  created_at: string;
}

const countries = [
  "United States", "Canada", "United Kingdom", "Australia", "India", 
  "Germany", "France", "Japan", "China", "Brazil", "Mexico", "South Africa",
  "Nigeria", "Egypt", "Saudi Arabia", "UAE", "Singapore", "New Zealand",
  "Other"
];

const Settings = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [profession, setProfession] = useState('');
  const [avatar, setAvatar] = useState('');

  // Simulate getting the user ID (in a real app, this would come from an auth context)
  useEffect(() => {
    // This is a placeholder
    const mockUserId = 'mock-user-id';
    setUserId(mockUserId);
  }, []);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await getProfile(userId);
      if (error) throw error;
      return data as UserProfile;
    },
    enabled: !!userId,
    onSuccess: (data) => {
      if (data) {
        setName(data.name || '');
        setEmail(data.email || '');
        setPhone(data.phone_number || '');
        setCountry(data.country || '');
        setProfession(data.profession || '');
        setAvatar(data.avatar_url || '');
      }
    }
  });

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    
    setIsSubmitting(true);
    
    try {
      const { error } = await updateProfile(userId, {
        name,
        full_name: name,
        phone_number: phone,
        country,
        profession
      });
      
      if (error) throw error;
      
      toast({
        title: "Profile updated!",
        description: "Your profile information has been updated successfully."
      });
      
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update failed",
        description: "There was a problem updating your profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="bg-gray-100/80 p-1 rounded-xl grid grid-cols-4 h-auto">
            <TabsTrigger
              value="profile"
              className="flex items-center gap-2 data-[state=active]:bg-white rounded-lg py-3 transition-all data-[state=active]:shadow-sm"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger
              value="billing"
              className="flex items-center gap-2 data-[state=active]:bg-white rounded-lg py-3 transition-all data-[state=active]:shadow-sm"
            >
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Billing</span>
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="flex items-center gap-2 data-[state=active]:bg-white rounded-lg py-3 transition-all data-[state=active]:shadow-sm"
            >
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="flex items-center gap-2 data-[state=active]:bg-white rounded-lg py-3 transition-all data-[state=active]:shadow-sm"
            >
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="border-pixar-blue/10 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-pixar-blue/10 to-transparent">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-pixar-blue" />
                  Personal Information
                </CardTitle>
                <CardDescription>
                  Update your personal details and profile picture
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-pixar-blue" />
                  </div>
                ) : (
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="flex flex-col sm:flex-row gap-6 items-start">
                      <div className="w-full sm:w-auto flex flex-col items-center">
                        <Avatar className="h-24 w-24 mb-4">
                          <AvatarImage src={avatar} alt={name} />
                          <AvatarFallback className="bg-pixar-blue/10 text-pixar-blue text-xl">
                            {name?.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <Button variant="outline" size="sm" className="mt-2">
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Change Photo
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                        <div className="space-y-2">
                          <Label htmlFor="fullName">Full Name</Label>
                          <Input 
                            id="fullName" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            placeholder="John Doe"
                            className="border-pixar-blue/20"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input 
                            id="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            placeholder="john.doe@example.com"
                            className="border-pixar-blue/20"
                            disabled
                          />
                          <p className="text-xs text-gray-500">Email cannot be changed</p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input 
                            id="phone" 
                            value={phone} 
                            onChange={(e) => setPhone(e.target.value)} 
                            placeholder="+1 (123) 456-7890"
                            className="border-pixar-blue/20"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="country">Country</Label>
                          <Select value={country} onValueChange={setCountry}>
                            <SelectTrigger className="border-pixar-blue/20">
                              <SelectValue placeholder="Select a country" />
                            </SelectTrigger>
                            <SelectContent>
                              {countries.map((c) => (
                                <SelectItem key={c} value={c}>
                                  {c}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="profession">Profession</Label>
                          <Input 
                            id="profession" 
                            value={profession} 
                            onChange={(e) => setProfession(e.target.value)} 
                            placeholder="e.g. Animator, Teacher, Developer"
                            className="border-pixar-blue/20"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <CardFooter className="flex justify-end px-0 pt-6">
                      <Button 
                        type="submit" 
                        className="bg-pixar-blue hover:bg-pixar-darkblue"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          'Save Changes'
                        )}
                      </Button>
                    </CardFooter>
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Billing Tab */}
          <TabsContent value="billing" className="space-y-6">
            <Card className="border-pixar-blue/10 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-pixar-blue/10 to-transparent">
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-pixar-blue" />
                    Current Plan
                  </CardTitle>
                  <Badge className="bg-pixar-purple">Free Plan</Badge>
                </div>
                <CardDescription>
                  You are currently on the free plan with limited features
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Plan Features</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-sm">
                        <Badge variant="outline" className="bg-green-50 text-green-600 hover:bg-green-50">✓</Badge>
                        Up to 5 animated stories per month
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <Badge variant="outline" className="bg-green-50 text-green-600 hover:bg-green-50">✓</Badge>
                        Basic customization options
                      </li>
                      <li className="flex items-center gap-2 text-sm text-gray-500">
                        <Badge variant="outline" className="bg-gray-100 text-gray-400 hover:bg-gray-100">✗</Badge>
                        Advanced style customization
                      </li>
                      <li className="flex items-center gap-2 text-sm text-gray-500">
                        <Badge variant="outline" className="bg-gray-100 text-gray-400 hover:bg-gray-100">✗</Badge>
                        Commercial usage rights
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium mb-3">Upgrade to Pro</h3>
                    <p className="text-sm text-gray-600 mb-4">Get unlimited stories, advanced customization options, and commercial usage rights.</p>
                    <Button className="bg-pixar-blue hover:bg-pixar-darkblue">
                      Upgrade Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-pixar-blue/10 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-pixar-blue/10 to-transparent">
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-pixar-blue" />
                  Payment Methods
                </CardTitle>
                <CardDescription>
                  Manage your payment methods and billing details
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No payment methods added yet</p>
                  <Button variant="outline" className="border-pixar-blue/20">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Payment Method
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="border-pixar-blue/10 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-pixar-blue/10 to-transparent">
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-pixar-blue" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Choose how and when you'd like to be notified
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Email Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Animation Completion</p>
                        <p className="text-sm text-gray-500">Get notified when your animations are ready</p>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">New Features</p>
                        <p className="text-sm text-gray-500">Be the first to know about new features</p>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Marketing & Promotions</p>
                        <p className="text-sm text-gray-500">Receive special offers and promotions</p>
                      </div>
                      <Switch defaultChecked={false} />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Push Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Animation Status Updates</p>
                        <p className="text-sm text-gray-500">Get notified about status changes</p>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Comments & Feedback</p>
                        <p className="text-sm text-gray-500">When someone comments on your animations</p>
                      </div>
                      <Switch defaultChecked={false} />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button className="bg-pixar-blue hover:bg-pixar-darkblue">
                  Save Preferences
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card className="border-pixar-blue/10 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-pixar-blue/10 to-transparent">
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5 text-pixar-blue" />
                  Password & Authentication
                </CardTitle>
                <CardDescription>
                  Manage your password and security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Change Password</h3>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" className="border-pixar-blue/20" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" className="border-pixar-blue/20" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input id="confirm-password" type="password" className="border-pixar-blue/20" />
                    </div>
                    <Button className="bg-pixar-blue hover:bg-pixar-darkblue mt-2">
                      Update Password
                    </Button>
                  </div>
                </div>
                
                <div className="pt-4">
                  <h3 className="text-lg font-medium mb-4">Login Sessions</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Laptop className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="font-medium">Current Session</p>
                          <p className="text-xs text-gray-500">Chrome on macOS - Last active: Just now</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Button variant="outline" className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600">
                      <PowerOff className="mr-2 h-4 w-4" />
                      Sign Out All Devices
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-pixar-blue/10 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-red-50 to-transparent border-b border-red-100">
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <Shield className="h-5 w-5" />
                  Account Deletion
                </CardTitle>
                <CardDescription className="text-red-500/70">
                  Permanently delete your account and all associated data
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-sm text-gray-600 mb-4">
                  Deleting your account will remove all of your data and animations. This action cannot be undone.
                </p>
                <Button variant="outline" className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600">
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
