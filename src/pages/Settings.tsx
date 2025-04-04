
import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Shield, Globe, CreditCard, User, Check, Save, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

const Settings = () => {
  return (
    <DashboardLayout>
      <div className="container-custom py-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Settings</h1>
        
        <Tabs defaultValue="account" className="space-y-6">
          <TabsList className="w-full sm:w-auto grid grid-cols-4 sm:flex">
            <TabsTrigger value="account" className="flex items-center">
              <User className="mr-2 h-4 w-4" /> Account
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center">
              <Bell className="mr-2 h-4 w-4" /> Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center">
              <Shield className="mr-2 h-4 w-4" /> Security
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center">
              <CreditCard className="mr-2 h-4 w-4" /> Billing
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="account">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your personal information and how others see you on the platform
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="w-full sm:w-1/2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input id="fullName" defaultValue="John Doe" className="mt-1" />
                    </div>
                    <div className="w-full sm:w-1/2">
                      <Label htmlFor="username">Username</Label>
                      <Input id="username" defaultValue="johndoe" className="mt-1" />
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="w-full sm:w-1/2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" defaultValue="john@example.com" className="mt-1" />
                    </div>
                    <div className="w-full sm:w-1/2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" defaultValue="+1 (555) 123-4567" className="mt-1" />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <textarea
                      id="bio"
                      rows={4}
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      defaultValue="Animation enthusiast and storyteller passionate about bringing characters to life."
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button className="bg-pixar-blue hover:bg-pixar-blue/90">
                    <Save className="mr-2 h-4 w-4" /> Save Changes
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Preferences</CardTitle>
                  <CardDescription>
                    Customize your experience on the platform
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="w-full sm:w-1/2">
                      <Label htmlFor="language">Language</Label>
                      <Select defaultValue="en">
                        <SelectTrigger id="language" className="mt-1">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                          <SelectItem value="ja">Japanese</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-full sm:w-1/2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select defaultValue="pst">
                        <SelectTrigger id="timezone" className="mt-1">
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pst">Pacific Time (PST)</SelectItem>
                          <SelectItem value="est">Eastern Time (EST)</SelectItem>
                          <SelectItem value="utc">Coordinated Universal Time (UTC)</SelectItem>
                          <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
                          <SelectItem value="cet">Central European Time (CET)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="dark-mode" className="cursor-pointer">Dark Mode</Label>
                      <Switch id="dark-mode" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="newsletter" className="cursor-pointer">Receive newsletter</Label>
                      <Switch id="newsletter" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="animations-public" className="cursor-pointer">Make animations public by default</Label>
                      <Switch id="animations-public" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button className="bg-pixar-blue hover:bg-pixar-blue/90">
                    <Save className="mr-2 h-4 w-4" /> Save Preferences
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="notifications">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>
                    Control how and when you receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="font-medium text-lg">Email Notifications</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="email-animations" className="cursor-pointer">Animation completion</Label>
                        <Switch id="email-animations" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="email-comments" className="cursor-pointer">Comments on my animations</Label>
                        <Switch id="email-comments" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="email-marketing" className="cursor-pointer">Marketing emails</Label>
                        <Switch id="email-marketing" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="font-medium text-lg">Push Notifications</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="push-animations" className="cursor-pointer">Animation completion</Label>
                        <Switch id="push-animations" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="push-comments" className="cursor-pointer">Comments on my animations</Label>
                        <Switch id="push-comments" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="push-updates" className="cursor-pointer">Platform updates</Label>
                        <Switch id="push-updates" />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button className="bg-pixar-blue hover:bg-pixar-blue/90">
                    <Save className="mr-2 h-4 w-4" /> Save Notification Settings
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="security">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Password</CardTitle>
                  <CardDescription>
                    Change your password to keep your account secure
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" className="mt-1" />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button className="bg-pixar-blue hover:bg-pixar-blue/90">
                    <Save className="mr-2 h-4 w-4" /> Update Password
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Two-Factor Authentication</CardTitle>
                  <CardDescription>
                    Add an extra layer of security to your account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Two-Factor Authentication</h3>
                      <p className="text-gray-500 text-sm">Enable two-factor authentication for your account</p>
                    </div>
                    <Switch id="tfa" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Sessions</CardTitle>
                  <CardDescription>
                    Manage your active sessions across devices
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <div>
                        <p className="font-medium">Current Session (Chrome on macOS)</p>
                        <p className="text-sm text-gray-500">Last active: Just now</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        Current
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <div>
                        <p className="font-medium">Safari on iPhone</p>
                        <p className="text-sm text-gray-500">Last active: 2 days ago</p>
                      </div>
                      <Button variant="outline" size="sm" className="text-red-500 hover:text-white hover:bg-red-500">
                        Log Out
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button variant="outline" className="text-red-500 hover:text-white hover:bg-red-500">
                    Log Out All Other Devices
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="billing">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Current Plan</CardTitle>
                  <CardDescription>
                    Your current subscription plan and usage
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-lg text-white">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-xl font-bold">Pro Plan</h3>
                        <p className="opacity-90">$19.99/month</p>
                      </div>
                      <Badge className="bg-white text-blue-800">Current</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-sm opacity-90">Animation Minutes</p>
                        <p className="font-semibold flex items-center">
                          <span className="text-lg">45</span>
                          <span className="text-xs opacity-90 ml-1">/ 60 min</span>
                        </p>
                        <div className="w-full bg-white/20 h-2 rounded-full mt-1">
                          <div className="bg-white h-2 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm opacity-90">Storage</p>
                        <p className="font-semibold flex items-center">
                          <span className="text-lg">3.2</span>
                          <span className="text-xs opacity-90 ml-1">/ 5 GB</span>
                        </p>
                        <div className="w-full bg-white/20 h-2 rounded-full mt-1">
                          <div className="bg-white h-2 rounded-full" style={{ width: '64%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button variant="outline">View All Plans</Button>
                    <Button className="bg-pixar-blue hover:bg-pixar-blue/90">Upgrade Plan</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>
                    Manage your payment methods and billing information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center">
                      <div className="h-10 w-16 bg-gray-200 rounded mr-3 flex items-center justify-center">
                        <CreditCard className="text-gray-700" />
                      </div>
                      <div>
                        <p className="font-medium">Visa ending in 4242</p>
                        <p className="text-sm text-gray-500">Expires 12/2024</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="border-green-200 text-green-700">
                        Default
                      </Badge>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    <Plus className="mr-2 h-4 w-4" /> Add Payment Method
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Billing History</CardTitle>
                  <CardDescription>
                    View your past invoices and payment history
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border-b">
                      <div>
                        <p className="font-medium">Apr 1, 2025</p>
                        <p className="text-sm text-gray-500">Pro Plan - Monthly</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">$19.99</p>
                        <Badge variant="outline" className="text-green-700 bg-green-50">Paid</Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border-b">
                      <div>
                        <p className="font-medium">Mar 1, 2025</p>
                        <p className="text-sm text-gray-500">Pro Plan - Monthly</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">$19.99</p>
                        <Badge variant="outline" className="text-green-700 bg-green-50">Paid</Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3">
                      <div>
                        <p className="font-medium">Feb 1, 2025</p>
                        <p className="text-sm text-gray-500">Pro Plan - Monthly</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">$19.99</p>
                        <Badge variant="outline" className="text-green-700 bg-green-50">Paid</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button variant="link">View All Invoices</Button>
                </CardFooter>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
