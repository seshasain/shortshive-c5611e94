import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from "@/components/ui/card";
import { User, Bell, Shield, ChevronRight, Mail, Key, Smartphone, Globe } from 'lucide-react';
import ProfileCard from '@/components/profile/ProfileCard';
import { supabase } from '@/lib/auth';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

const Settings = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (updatedProfile) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error('No session found');

      const { error } = await supabase
        .from('profiles')
        .update(updatedProfile)
        .eq('id', session.user.id);

      if (error) throw error;

      await fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
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
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <nav className="space-y-2">
              {Object.entries(settingsSections).map(([key, section]) => {
                const Icon = section.icon;
                return (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-all duration-200 ${
                      activeTab === key
                        ? 'bg-pixar-blue text-white shadow-lg shadow-blue-500/20'
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
            <div className="bg-white rounded-xl shadow-lg border border-pixar-blue/10 overflow-hidden">
              <div className="p-6 border-b border-pixar-blue/10">
                <h2 className="text-xl font-semibold text-gray-900">{settingsSections[activeTab].title}</h2>
                <p className="text-gray-500 mt-1">{settingsSections[activeTab].description}</p>
              </div>

              <div className="p-6">
                {activeTab === 'profile' && (
                  loading ? (
                    <div className="animate-pulse space-y-4">
                      <div className="h-24 w-24 bg-gray-200 rounded-full mx-auto" />
                      <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto" />
                      <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-full" />
                        <div className="h-4 bg-gray-200 rounded w-5/6" />
                        <div className="h-4 bg-gray-200 rounded w-4/6" />
                      </div>
                    </div>
                  ) : profile ? (
                    <ProfileCard profile={profile} onUpdate={handleProfileUpdate} />
                  ) : (
                    <div className="text-center text-gray-500">
                      <p>Failed to load profile. Please try again later.</p>
                    </div>
                  )
                )}

                {activeTab === 'notifications' && (
                  <div className="space-y-6">
                    <div className="grid gap-6">
                      <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <Mail className="h-5 w-5 text-pixar-blue" />
                          Email Notifications
                        </h3>
                        <p className="text-gray-500 mb-4">Coming soon: Manage your email notification preferences.</p>
                      </Card>
                      <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <Smartphone className="h-5 w-5 text-pixar-blue" />
                          Push Notifications
                        </h3>
                        <p className="text-gray-500 mb-4">Coming soon: Control your push notification settings.</p>
                      </Card>
                    </div>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div className="space-y-6">
                    <div className="grid gap-6">
                      <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <Key className="h-5 w-5 text-pixar-blue" />
                          Password & Authentication
                        </h3>
                        <p className="text-gray-500 mb-4">Coming soon: Update your password and security settings.</p>
                      </Card>
                      <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <Globe className="h-5 w-5 text-pixar-blue" />
                          Login Activity
                        </h3>
                        <p className="text-gray-500 mb-4">Coming soon: View and manage your login sessions.</p>
                      </Card>
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