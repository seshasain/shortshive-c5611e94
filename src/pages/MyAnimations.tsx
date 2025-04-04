
import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Film, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProjectCard from '@/components/dashboard/ProjectCard';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

const MyAnimations = () => {
  // Sample data - in a real app this would come from an API/database
  const animations = [
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
    },
    {
      id: 4,
      title: "Dinosaur World",
      description: "Adventure in the prehistoric era with dinosaurs",
      status: "completed",
      duration: 50,
      thumbnail: "https://source.unsplash.com/random/300x200?animation=4",
      date: "2 weeks ago"
    }
  ];

  return (
    <DashboardLayout>
      <div className="container-custom py-6 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Animations</h1>
            <p className="text-gray-500 mt-1">Manage and organize all your animation projects</p>
          </div>
          <Button className="bg-pixar-blue hover:bg-pixar-blue/90">
            <Plus className="mr-2 h-4 w-4" /> Create New Animation
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search animations..."
              className="pl-10 w-full"
            />
          </div>
          <Tabs defaultValue="all" className="w-full sm:w-auto">
            <TabsList className="grid w-full sm:w-auto grid-cols-4 sm:flex">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="in_progress">In Progress</TabsTrigger>
              <TabsTrigger value="draft">Drafts</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <TabsContent value="all" className="mt-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {animations.map((animation) => (
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
      </div>
    </DashboardLayout>
  );
};

export default MyAnimations;
