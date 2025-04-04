
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { User, Edit, Image as ImageIcon, Mail, Phone, MapPin, Loader2 } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getProfile } from '@/lib/supabase';
import ProjectCard from '@/components/dashboard/ProjectCard';

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

const Profile = () => {
  const [userId, setUserId] = useState<string | null>(null);

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
  });

  // Placeholder data for recent activity
  const recentActivity = [
    {
      id: '1',
      title: 'Space Adventure',
      description: 'A journey through the cosmos',
      status: 'completed',
      thumbnail: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      type: 'animation'
    },
    {
      id: '2',
      title: 'Underwater Odyssey',
      description: 'Exploring the depths of the ocean',
      status: 'in_progress',
      thumbnail: 'https://images.unsplash.com/photo-1551244072-5d12893278ab',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      type: 'story'
    }
  ];

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">My Profile</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="md:col-span-1">
            <Card className="overflow-hidden border border-gray-100 shadow-md">
              <CardHeader className="bg-gradient-to-r from-pixar-blue/10 to-transparent p-6">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-pixar-blue" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-pixar-blue" />
                  </div>
                ) : profile ? (
                  <div className="space-y-6">
                    <div className="flex flex-col items-center justify-center">
                      <Avatar className="h-24 w-24 mb-4">
                        <AvatarImage src={profile.avatar_url || ''} alt={profile.name} />
                        <AvatarFallback className="bg-pixar-blue/10 text-pixar-blue text-xl">
                          {profile.name?.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <h2 className="text-xl font-semibold">{profile.name}</h2>
                      <p className="text-gray-500">{profile.profession || 'Creative Storyteller'}</p>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{profile.email || 'No email provided'}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{profile.phone_number || 'No phone provided'}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{profile.country || 'Location not specified'}</span>
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button variant="outline" className="w-full border-pixar-blue/20 text-pixar-blue hover:bg-pixar-blue/5">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Profile
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Profile information not available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Activity Section */}
          <div className="md:col-span-2">
            <Card className="border border-gray-100 shadow-md h-full">
              <CardHeader className="bg-gradient-to-r from-pixar-blue/10 to-transparent p-6">
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-pixar-blue" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recentActivity.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <ProjectCard
                        id={item.id}
                        title={item.title}
                        description={item.description}
                        status={item.status}
                        thumbnail={item.thumbnail}
                        createdAt={item.createdAt}
                        type={item.type}
                      />
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
