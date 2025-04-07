import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ProjectCard from '@/components/dashboard/ProjectCard';
import { ArrowRight, Wand2, Video, Film, Plus, Users, FileText, Clock } from 'lucide-react';

type Project = {
  id: string;
  title: string;
  thumbnail: string;
  date: string;
  status: 'draft' | 'completed' | 'processing';
}

const Dashboard = () => {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      title: 'Adventure in the Wild',
      thumbnail: 'https://source.unsplash.com/random/300x200?animation=1',
      date: '2023-10-15',
      status: 'completed'
    },
    {
      id: '2',
      title: 'Space Explorers',
      thumbnail: 'https://source.unsplash.com/random/300x200?animation=2',
      date: '2023-10-18',
      status: 'draft'
    },
    {
      id: '3',
      title: 'Underwater Journey',
      thumbnail: 'https://source.unsplash.com/random/300x200?animation=3',
      date: '2023-10-20',
      status: 'processing'
    }
  ]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const statistics = [
    { label: 'Total Animations', value: '12', icon: Video, color: 'bg-pixar-blue/10 text-pixar-blue' },
    { label: 'Characters Created', value: '28', icon: Users, color: 'bg-pixar-purple/10 text-pixar-purple' },
    { label: 'Stories Written', value: '15', icon: FileText, color: 'bg-pixar-green/10 text-pixar-green' },
    { label: 'Rendering Minutes', value: '145', icon: Clock, color: 'bg-pixar-orange/10 text-pixar-orange' }
  ];

  return (
    <DashboardLayout>
      <div className="container-custom py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold mb-2 pixar-text-gradient"
            >
              Welcome Back!
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-muted-foreground"
            >
              Continue working on your animations or create something new
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.03 }}
          >
            <Link to="/build-story">
              <Button className="bg-pixar-blue text-white hover:bg-pixar-darkblue pixar-button">
                <Plus className="mr-2 h-4 w-4" />
                New Animation
              </Button>
            </Link>
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {statistics.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="border border-gray-100">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </motion.div>
        
        <div className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl md:text-2xl font-bold pixar-text-gradient dark:text-white">Recent Projects</h2>
            <Link to="/my-animations" className="text-pixar-blue hover:text-pixar-darkblue dark:text-pixar-blue/80 dark:hover:text-pixar-blue flex items-center text-sm font-medium">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Link to="/build-story" className="block h-full">
                <Card className="border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 h-full transition-all duration-300 flex flex-col justify-center items-center py-10">
                  <div className="text-center">
                    <div className="mx-auto rounded-full bg-pixar-blue/10 dark:bg-pixar-blue/20 p-4 mb-4">
                      <Plus className="h-8 w-8 text-pixar-blue dark:text-pixar-blue/80" />
                    </div>
                    <h3 className="text-xl font-medium mb-2 dark:text-white">Start New Project</h3>
                    <p className="text-muted-foreground dark:text-gray-400 mb-4">Create a stunning Pixar-style animation</p>
                  </div>
                </Card>
              </Link>
            </motion.div>
            
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {projects.slice(0, 2).map((project, index) => (
                <ProjectCard key={project.id} project={project} delay={index * 0.1} />
              ))}
            </motion.div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Popular Templates</CardTitle>
                <CardDescription>Start with a pre-made template to save time</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: 'Character Introduction', category: 'Storytelling', image: 'https://source.unsplash.com/random/100x60?animation=5' },
                  { name: 'Adventure Quest', category: 'Action', image: 'https://source.unsplash.com/random/100x60?animation=6' },
                  { name: 'Educational Story', category: 'Learning', image: 'https://source.unsplash.com/random/100x60?animation=7' }
                ].map((template, index) => (
                  <div key={index} className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <img src={template.image} alt={template.name} className="w-16 h-10 rounded object-cover" />
                    <div className="flex-1">
                      <p className="font-medium">{template.name}</p>
                      <p className="text-xs text-gray-500">{template.category}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-pixar-blue hover:text-pixar-darkblue">
                      Use
                    </Button>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="ml-auto">
                  View All Templates
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Learning Resources</CardTitle>
                <CardDescription>Tutorials to help you master animation techniques</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { title: 'Creating Compelling Characters', duration: '10 min', type: 'Video Tutorial' },
                  { title: 'Writing Better Storylines', duration: '15 min', type: 'Written Guide' },
                  { title: 'Advanced Animation Settings', duration: '12 min', type: 'Interactive Tutorial' }
                ].map((resource, index) => (
                  <div key={index} className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-pixar-purple/10 flex items-center justify-center flex-shrink-0">
                      <Film className="h-5 w-5 text-pixar-purple" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{resource.title}</p>
                      <p className="text-xs text-gray-500">{resource.type} · {resource.duration}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="ml-auto">
                  View Learning Center
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
