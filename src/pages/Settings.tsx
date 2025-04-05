import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from "@/components/ui/card";
import { User, Bell, Shield, ChevronRight, Mail, Key, Smartphone, Globe, Check, AlertCircle } from 'lucide-react';
import ProfileCard from '@/components/profile/ProfileCard';
import { supabase, useProfile, useLoginActivity, signOutDevice } from '@/lib/auth';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { toast } from 'sonner';
import { useTheme } from '@/lib/theme';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { initializeLoginActivity } from '@/utils/initDatabase';

interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone_number?: string;
  country?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

interface NotificationSettings {
  id: string;
  user_id: string;
  email_notifications: boolean;
  push_notifications: boolean;
  marketing_emails: boolean;
  story_completion_notifications: boolean;
  promotional_notifications: boolean;
  created_at?: string;
  updated_at?: string;
}

// Add interface for login activity history
interface LoginActivity {
  id: string;
  user_id: string;
  ip_address: string;
  device_type: string;
  device_name: string;
  location: string;
  last_accessed: string;
  is_current: boolean;
}

const Toggle = ({ 
  checked, 
  onChange, 
  disabled 
}: { 
  checked: boolean; 
  onChange: () => void; 
  disabled?: boolean 
}) => {
  const { theme } = useTheme();
  
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onChange}
        disabled={disabled}
        className={`block w-14 h-8 rounded-full relative cursor-pointer ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        } ${
          checked
            ? 'bg-gradient-to-r from-pixar-blue to-pixar-teal'
            : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
        }`}
        aria-checked={checked}
        role="switch"
      >
        <span 
          className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transform transition-transform duration-200 ${
            checked ? 'translate-x-6' : ''
          }`} 
        />
      </button>
    </div>
  );
};

// Password form component to prevent parent re-renders
const PasswordChangeForm = React.memo(() => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordChanging, setPasswordChanging] = useState(false);
  const { theme } = useTheme();

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setPasswordChanging(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;
      
      toast.success('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('New password should be different from the old password');
    } finally {
      setPasswordChanging(false);
    }
  };

  return (
    <form onSubmit={handleChangePassword} className="space-y-4 mt-4 pt-4 border-t border-gray-700">
      <div className="space-y-2">
        <Label htmlFor="current-password" className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
          Current Password
        </Label>
        <Input
          id="current-password"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
          className={`${
            theme === 'dark' 
              ? 'bg-gray-700 border-gray-600 text-gray-200' 
              : 'bg-white border-gray-300 text-gray-800'
          }`}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="new-password" className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
          New Password
        </Label>
        <Input
          id="new-password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className={`${
            theme === 'dark' 
              ? 'bg-gray-700 border-gray-600 text-gray-200' 
              : 'bg-white border-gray-300 text-gray-800'
          }`}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirm-password" className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
          Confirm New Password
        </Label>
        <Input
          id="confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className={`${
            theme === 'dark' 
              ? 'bg-gray-700 border-gray-600 text-gray-200' 
              : 'bg-white border-gray-300 text-gray-800'
          }`}
        />
      </div>
      
      <Button 
        type="submit"
        disabled={passwordChanging}
        className="bg-gradient-to-r from-pixar-blue to-pixar-teal text-white hover:opacity-90 w-full"
      >
        {passwordChanging ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Updating Password...
          </>
        ) : 'Update Password'}
      </Button>
    </form>
  );
});

const Settings = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const { theme } = useTheme();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings | null>(null);
  const [savingSettings, setSavingSettings] = useState(false);
  const [securityLoading, setSecurityLoading] = useState(false);
  const [initializingActivity, setInitializingActivity] = useState(false);
  
  // Use the login activity hook instead of local state
  const { data: loginActivity, isLoading: isLoginActivityLoading, refetch: refetchLoginActivity } = useLoginActivity();

  useEffect(() => {
    fetchProfile();
    fetchNotificationSettings();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error('No session found');
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const fetchNotificationSettings = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error('No session found');
      }

      const { data, error } = await supabase
        .from('notification_settings')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Record not found, create default settings
          const { data: newSettings, error: insertError } = await supabase
            .from('notification_settings')
            .insert({
              user_id: session.user.id,
              email_notifications: true,
              push_notifications: true,
              marketing_emails: true,
              story_completion_notifications: true,
              promotional_notifications: false
            })
            .select()
            .single();

          if (insertError) throw insertError;
          setNotificationSettings(newSettings);
        } else {
          throw error;
        }
      } else {
        setNotificationSettings(data);
      }
    } catch (error) {
      console.error('Error fetching notification settings:', error);
      toast.error('Failed to load notification settings');
    }
  };

  // Memoize the toggle handler to prevent re-renders
  const handleNotificationToggle = useCallback(async (setting: keyof NotificationSettings, value: boolean) => {
    if (!notificationSettings?.id || savingSettings) return;
    
    // Update UI immediately for a smoother experience
    setNotificationSettings(prev => prev ? {...prev, [setting]: value} : null);
    
    setSavingSettings(true);
    try {
      const updates = {
        [setting]: value,
        updated_at: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('notification_settings')
        .update(updates)
        .eq('id', notificationSettings.id);
        
      if (error) {
        // Revert the setting if the API call fails
        setNotificationSettings(prev => prev ? {...prev, [setting]: !value} : null);
        throw error;
      }
      
      // Silent success - no toast to prevent UI distraction
    } catch (error) {
      console.error('Error updating notification settings:', error);
      toast.error('Failed to update notification settings');
    } finally {
      setSavingSettings(false);
    }
  }, [notificationSettings, savingSettings]);

  const handleProfileUpdate = async (updatedProfile: Partial<Profile>) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error('No session found');

      const { error } = await supabase
        .from('profiles')
        .update(updatedProfile)
        .eq('id', session.user.id);

      if (error) throw error;

      await fetchProfile();
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
      throw error;
    }
  };

  const settingsSections = {
    profile: {
      icon: User,
      title: "Profile Settings",
      description: "Manage your personal information and preferences"
    },
    notifications: {
      icon: Bell,
      title: "Notification Preferences",
      description: "Control how you receive updates and alerts"
    },
    security: {
      icon: Shield,
      title: "Security Settings",
      description: "Manage your account security and privacy"
    }
  };

  const FeatureComingSoon = ({ title, icon: Icon }) => {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    
    const handleWaitlistSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      
      try {
        const { data: userData, error: userError } = await supabase.auth.getUser();
        
        if (userError) throw userError;
        
        const user = userData.user;
        
        const { error } = await supabase
          .from('feature_waitlist')
          .insert({
            user_id: user.id,
            email: email || user.email,
            feature_name: title.toLowerCase().replace(/\s+/g, '_')
          });
          
        if (error) throw error;
        
        setIsSubmitted(true);
        toast.success(`You've been added to the ${title} waitlist!`);
      } catch (error) {
        console.error('Error joining waitlist:', error);
        toast.error('Failed to join waitlist. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    };
    
    return (
      <div className={`p-6 rounded-lg space-y-4 border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <Icon className={`h-5 w-5 ${theme === 'dark' ? 'text-pixar-blue' : 'text-pixar-teal'}`} />
          </div>
          <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
        </div>
        
        <div className={`p-3 rounded-lg ${
          theme === 'dark' 
            ? 'bg-blue-900/10 border border-blue-800/20 text-blue-300' 
            : 'bg-blue-50 border border-blue-100 text-blue-700'
        }`}>
          <p className="text-sm">This feature is coming soon! Join the waitlist to get early access.</p>
        </div>
        
        {!isSubmitted ? (
          <form onSubmit={handleWaitlistSubmit} className="space-y-3">
            <Input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-gray-200' 
                  : 'bg-white border-gray-300 text-gray-800'
              }`}
            />
            <Button 
              type="submit"
              className="w-full bg-gradient-to-r from-pixar-blue to-pixar-teal text-white hover:opacity-90"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Joining...' : 'Join Waitlist'}
            </Button>
          </form>
        ) : (
          <div className={`p-3 rounded-lg flex items-center space-x-2 ${
            theme === 'dark' 
              ? 'bg-green-900/20 text-green-300' 
              : 'bg-green-50 text-green-700'
          }`}>
            <Check className="h-5 w-5" />
            <p className="text-sm font-medium">You're on the waitlist!</p>
          </div>
        )}
      </div>
    );
  };

  const handleSignOutDevice = async (deviceId: string) => {
    try {
      const { error } = await signOutDevice(deviceId);
      
      if (error) throw error;
      
      // Refresh the login activity data
      refetchLoginActivity();
      toast.success('Device signed out successfully');
    } catch (error) {
      console.error('Error signing out device:', error);
      toast.error('Failed to sign out device');
    }
  };

  // Function to handle login activity initialization
  const handleInitializeActivity = async () => {
    setInitializingActivity(true);
    try {
      const success = await initializeLoginActivity();
      if (success) {
        toast.success('Login activity data initialized successfully');
        // Refresh the login activity data
        refetchLoginActivity();
      } else {
        toast.error('Failed to initialize login activity data');
      }
    } catch (error) {
      console.error('Error initializing login activity:', error);
      toast.error('An error occurred while initializing login activity data');
    } finally {
      setInitializingActivity(false);
    }
  };

  const SettingsContent = () => (
    <div className="py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container-custom max-w-7xl mx-auto"
      >
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Sidebar */}
          <div className="w-full md:w-64 space-y-4">
            <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Settings</h1>
            <nav className="space-y-2">
              {Object.entries(settingsSections).map(([key, section]) => {
                const Icon = section.icon;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActiveTab(key)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-all duration-200 ${
                      activeTab === key
                        ? 'bg-pixar-blue text-white shadow-lg shadow-blue-500/20'
                        : theme === 'dark'
                          ? 'text-gray-300 hover:bg-gray-800 hover:text-pixar-blue'
                          : 'text-gray-600 hover:bg-pixar-blue/5 hover:text-pixar-blue'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{section.title}</span>
                    </div>
                    <ChevronRight className={`h-4 w-4 transition-transform ${
                      activeTab === key ? 'rotate-90' : ''
                    }`} />
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-pixar-blue/10'} rounded-xl shadow-lg border overflow-hidden`}>
              <div className={`p-6 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-pixar-blue/10'}`}>
                <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{settingsSections[activeTab].title}</h2>
                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mt-1`}>{settingsSections[activeTab].description}</p>
              </div>

              <div className="p-6">
                {activeTab === 'profile' && (
                  loading ? (
                    <div className="animate-pulse space-y-6">
                      <div className="flex justify-center">
                        <div className={`h-24 w-24 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-full`} />
                      </div>
                      <div className="space-y-4">
                        <div className={`h-4 w-1/4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded`} />
                        <div className={`h-10 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded`} />
                        <div className={`h-4 w-1/4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded`} />
                        <div className={`h-10 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded`} />
                        <div className={`h-4 w-1/4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded`} />
                        <div className={`h-10 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded`} />
                      </div>
                    </div>
                  ) : profile ? (
                    <ProfileCard profile={profile} onUpdate={handleProfileUpdate} />
                  ) : (
                    <div className={`text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} py-8`}>
                      <p>Failed to load profile. Please try refreshing the page.</p>
                    </div>
                  )
                )}

                {activeTab === 'notifications' && (
                  <div className="space-y-6">
                    {notificationSettings ? (
                      <>
                        <div className={`p-6 rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                          <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            Email & Push Notifications
                        </h3>
                          <div className="space-y-6">
                            {/* Email Notifications */}
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <div className="flex items-center">
                                  <Mail className={`h-5 w-5 mr-2 ${theme === 'dark' ? 'text-pixar-blue' : 'text-pixar-blue'}`} />
                                  <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Email Notifications</span>
                                </div>
                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                  Receive updates and alerts via email
                                </p>
                              </div>
                              <Toggle
                                checked={notificationSettings.email_notifications}
                                onChange={() => handleNotificationToggle('email_notifications', !notificationSettings.email_notifications)}
                                disabled={savingSettings}
                              />
                            </div>

                            {/* Push Notifications */}
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <div className="flex items-center">
                                  <Bell className={`h-5 w-5 mr-2 ${theme === 'dark' ? 'text-pixar-blue' : 'text-pixar-blue'}`} />
                                  <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Push Notifications</span>
                                </div>
                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                  Receive real-time alerts within the app
                                </p>
                              </div>
                              <Toggle
                                checked={notificationSettings.push_notifications}
                                onChange={() => handleNotificationToggle('push_notifications', !notificationSettings.push_notifications)}
                                disabled={savingSettings}
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className={`p-6 rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                          <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            Notification Preferences
                        </h3>
                          <div className="space-y-6">
                            {/* Story Completion Notifications */}
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Story Completion</span>
                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                  Get notified when your stories and animations are finished processing
                                </p>
                              </div>
                              <Toggle
                                checked={notificationSettings.story_completion_notifications}
                                onChange={() => handleNotificationToggle('story_completion_notifications', !notificationSettings.story_completion_notifications)}
                                disabled={savingSettings}
                              />
                            </div>

                            {/* Marketing Email Notifications */}
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Marketing Emails</span>
                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                  Receive updates about new features and special offers
                                </p>
                              </div>
                              <Toggle
                                checked={notificationSettings.marketing_emails}
                                onChange={() => handleNotificationToggle('marketing_emails', !notificationSettings.marketing_emails)}
                                disabled={savingSettings}
                              />
                            </div>

                            {/* Promotional Notifications */}
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Promotional Notifications</span>
                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                  Receive notifications about promotions and discounts
                                </p>
                              </div>
                              <Toggle
                                checked={notificationSettings.promotional_notifications}
                                onChange={() => handleNotificationToggle('promotional_notifications', !notificationSettings.promotional_notifications)}
                                disabled={savingSettings}
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="animate-pulse space-y-6">
                        <div className={`h-52 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg`}></div>
                        <div className={`h-52 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg`}></div>
                    </div>
                    )}
                  </div>
                )}

                {activeTab === 'security' && (
                  <div className="space-y-6">
                    {/* Password Change Section */}
                    <div className={`p-6 rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                      <div className="flex flex-col space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Password</h3>
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                              Update your password to keep your account secure
                            </p>
                          </div>
                          <Button 
                            variant="outline" 
                            type="button"
                            onClick={() => setShowPasswordForm(!showPasswordForm)}
                            className={`${
                              theme === 'dark' 
                                ? 'border-gray-700 hover:bg-gray-700 text-gray-300'
                                : 'border-pixar-blue/20 hover:bg-pixar-blue/5 text-gray-700'
                            }`}
                          >
                            {showPasswordForm ? 'Cancel' : 'Change Password'}
                          </Button>
                        </div>
                        
                        <AnimatePresence initial={false} mode="wait">
                          {showPasswordForm && (
                            <motion.div
                              key="password-form"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <PasswordChangeForm />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                    
                    {/* Two-Factor Authentication */}
                    <div className={`p-6 rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                      <div className="flex flex-col space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Two-Factor Authentication</h3>
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                              Add an extra layer of security to your account
                            </p>
                          </div>
                          <Button 
                            variant="outline"
                            type="button"
                            onClick={() => {
                              const twoFactorSection = document.getElementById('two-factor-auth-info');
                              if (twoFactorSection) {
                                twoFactorSection.scrollIntoView({ behavior: 'smooth' });
                              }
                            }}
                            className={`${
                              theme === 'dark' 
                                ? 'border-gray-700 hover:bg-gray-700 text-gray-300'
                                : 'border-pixar-blue/20 hover:bg-pixar-blue/5 text-gray-700'
                            }`}
                          >
                            Join Waitlist
                          </Button>
                        </div>
                        <div 
                          id="two-factor-auth-info"
                          className={`p-4 rounded-lg ${
                            theme === 'dark' 
                              ? 'bg-yellow-900/10 border border-yellow-900/20 text-yellow-300' 
                              : 'bg-yellow-50 border border-yellow-100 text-yellow-700'
                          }`}
                        >
                          <div className="flex gap-2.5">
                            <AlertCircle className="h-5 w-5 flex-shrink-0" />
                            <div>
                              <p className="font-medium">Enhanced Security</p>
                              <p className="text-sm mt-1">
                                Two-factor authentication will be available soon. Join the waitlist to get early access.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Login Activity */}
                    <div className={`p-6 rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          Recent Login Activity
                        </h3>
                        
                        {/* Only show this in development mode */}
                        {import.meta.env.DEV && !loginActivity?.length && (
                          <Button
                            variant="outline"
                            size="sm"
                            type="button"
                            onClick={handleInitializeActivity}
                            disabled={initializingActivity}
                            className={`${
                              theme === 'dark' 
                                ? 'border-blue-900/30 bg-blue-900/10 text-blue-400 hover:bg-blue-900/20'
                                : 'border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100'
                            }`}
                          >
                            {initializingActivity ? 'Initializing...' : 'Initialize Test Data'}
                          </Button>
                        )}
                      </div>
                      
                      {isLoginActivityLoading ? (
                        <div className="animate-pulse space-y-4">
                          {[1, 2].map(i => (
                            <div key={i} className={`h-20 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg`}></div>
                          ))}
                        </div>
                      ) : loginActivity && loginActivity.length > 0 ? (
                        <div className="space-y-4">
                          {loginActivity.map(device => (
                            <div 
                              key={device.id} 
                              className={`p-4 rounded-lg ${
                                device.is_current
                                  ? theme === 'dark' ? 'bg-green-900/20 border border-green-900/30' : 'bg-green-50 border border-green-100'
                                  : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                              }`}
                            >
                              <div className="flex justify-between items-center">
                                <div className="flex flex-col">
                                  <div className="flex items-center gap-2">
                                    <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                      {device.device_name}
                                    </span>
                                    {device.is_current && (
                                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                                        theme === 'dark' ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'
                                      }`}>
                                        Current Device
                                      </span>
                                    )}
                                  </div>
                                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {device.location} • {device.ip_address}
                                  </span>
                                  <span className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                                    Last active: {new Date(device.last_accessed).toLocaleDateString()} at {new Date(device.last_accessed).toLocaleTimeString()}
                                  </span>
                                </div>
                                
                                {!device.is_current && (
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    type="button"
                                    onClick={() => handleSignOutDevice(device.id)}
                                    className={`${
                                      theme === 'dark' 
                                        ? 'border-red-900/30 bg-red-900/10 text-red-400 hover:bg-red-900/20'
                                        : 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100'
                                    }`}
                                  >
                                    Sign Out
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className={`text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} py-8`}>
                          <p>No recent login activity</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );

  return (
    <DashboardLayout>
      <SettingsContent />
    </DashboardLayout>
  );
};

export default Settings; 