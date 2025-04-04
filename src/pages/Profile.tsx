
import React from 'react';
import { motion } from 'framer-motion';
import { Edit, Share2, Image, Award, Calendar, MapPin, Link2, Mail, Clock, Eye, Trophy, Users, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProjectCard } from '@/components/dashboard/ProjectCard';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

const Profile = () => {
  // Sample data - in a real app this would come from an API/database
  const user = {
    name: "Jane Smith",
    username: "janesmith",
    bio: "Award-winning animator and storyteller with a passion for creating magical worlds through animation. Based in Los Angeles, CA.",
    avatar: "https://source.unsplash.com/random/100x100?portrait=woman",
    coverImage: "https://source.unsplash.com/random/1200x300?landscape",
    location: "Los Angeles, CA",
    website: "janesmith.design",
    email: "jane@example.com",
    memberSince: "March 2022",
    stats: {
      animations: 34,
      views: "12.5K",
      followers: 824
    },
    badges: ["Pro Creator", "Storyteller", "Animation Expert"]
  };
  
  const recentAnimations = [
    {
      id: 1,
      title: "The Forest Adventure",
      description: "A magical journey through an enchanted forest",
      status: "completed",
      duration: 45,
      thumbnail: "https://source.unsplash.com/random/300x200?animation=1",
      date: "2 days ago"
    },
    {
      id: 2,
      title: "Ocean Explorer",
      description: "Deep sea adventure with colorful marine life",
      status: "draft",
      duration: 30,
      thumbnail: "https://source.unsplash.com/random/300x200?animation=2",
      date: "1 week ago"
    },
    {
      id: 3,
      title: "Space Odyssey",
      description: "Journey through the cosmos and distant galaxies",
      status: "in_progress",
      duration: 60,
      thumbnail: "https://source.unsplash.com/random/300x200?animation=3",
      date: "3 days ago"
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Cover image */}
        <div className="relative h-64 overflow-hidden">
          <img 
            src={user.coverImage} 
            alt="Cover"
            className="w-full h-full object-cover"
          />
          <Button 
            className="absolute top-4 right-4 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white"
            size="sm"
          >
            <Edit className="h-4 w-4 mr-2" /> Edit Cover
          </Button>
        </div>
        
        <div className="container-custom">
          {/* Profile header */}
          <div className="flex flex-col md:flex-row gap-6 -mt-16 relative">
            <div className="z-10">
              <div className="relative">
                <Avatar className="h-32 w-32 border-4 border-white shadow-md">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <Button 
                  className="absolute bottom-0 right-0 rounded-full h-8 w-8 p-0 bg-pixar-blue hover:bg-pixar-blue/90"
                  size="sm"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex-1 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                  <p className="text-gray-500">@{user.username}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Share2 className="h-4 w-4" /> Share Profile
                  </Button>
                  <Button className="bg-pixar-blue hover:bg-pixar-blue/90">
                    <Edit className="h-4 w-4 mr-2" /> Edit Profile
                  </Button>
                </div>
              </div>
              
              <p className="text-gray-700">{user.bio}</p>
              
              <div className="flex flex-wrap gap-4 text-gray-600">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                  <span>{user.location}</span>
                </div>
                <div className="flex items-center">
                  <Link2 className="h-4 w-4 mr-1 text-gray-400" />
                  <a href={`https://${user.website}`} className="text-pixar-blue hover:underline">{user.website}</a>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-1 text-gray-400" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                  <span>Member since {user.memberSince}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {user.badges.map((badge) => (
                  <Badge key={badge} className="bg-gradient-to-r from-pixar-blue to-purple-500 text-white">
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          
          {/* Stats cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <Card>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Animations</p>
                  <p className="text-2xl font-bold">{user.stats.animations}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Image className="h-5 w-5 text-pixar-blue" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Views</p>
                  <p className="text-2xl font-bold">{user.stats.views}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Eye className="h-5 w-5 text-purple-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Followers</p>
                  <p className="text-2xl font-bold">{user.stats.followers}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Tabs */}
          <Tabs defaultValue="animations" className="mt-6">
            <TabsList className="w-full grid grid-cols-3 sm:w-auto sm:flex">
              <TabsTrigger value="animations">Animations</TabsTrigger>
              <TabsTrigger value="stories">Stories</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            </TabsList>
            
            <TabsContent value="animations" className="mt-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {recentAnimations.map((animation) => (
                  <ProjectCard
                    key={animation.id}
                    title={animation.title}
                    description={animation.description}
                    image={animation.thumbnail}
                    status={animation.status}
                    date={animation.date}
                  />
                ))}
              </motion.div>
            </TabsContent>
            
            <TabsContent value="stories" className="mt-6">
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-medium text-gray-700">No stories yet</h3>
                <p className="text-gray-500 mt-2">Start creating your first story now</p>
                <Button className="mt-4 bg-pixar-blue hover:bg-pixar-blue/90">
                  Create Story
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="achievements" className="mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="border-2 border-yellow-200">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="h-16 w-16 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
                      <Award className="h-8 w-8 text-yellow-500" />
                    </div>
                    <h3 className="font-bold text-lg">Animation Master</h3>
                    <p className="text-gray-500 text-sm mt-2">Created 25+ animations</p>
                  </CardContent>
                </Card>
                <Card className="border-2 border-blue-200">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                      <Trophy className="h-8 w-8 text-blue-500" />
                    </div>
                    <h3 className="font-bold text-lg">Featured Creator</h3>
                    <p className="text-gray-500 text-sm mt-2">Had animations featured on the platform</p>
                  </CardContent>
                </Card>
                <Card className="border-2 border-green-200">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                      <Clock className="h-8 w-8 text-green-500" />
                    </div>
                    <h3 className="font-bold text-lg">One Year Club</h3>
                    <p className="text-gray-500 text-sm mt-2">Active member for over a year</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
