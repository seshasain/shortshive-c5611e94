
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ProjectCard from '@/components/dashboard/ProjectCard';
import { ArrowRight, MagicWand, Pencil, Film, Plus, Video } from 'lucide-react';

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
              Your Animation Projects
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-muted-foreground"
            >
              Create, edit and manage your Pixar-quality animations
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {/* New Project Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <Link to="/build-story" className="block h-full">
              <Card className="border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 h-full transition-all duration-300 flex flex-col justify-center items-center py-10">
                <div className="text-center">
                  <div className="mx-auto rounded-full bg-pixar-blue/10 p-4 mb-4">
                    <Plus className="h-8 w-8 text-pixar-blue" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Create New Animation</h3>
                  <p className="text-muted-foreground mb-4">Start from scratch or use AI assistance</p>
                  <div className="flex justify-center gap-3">
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                      <MagicWand className="h-4 w-4" />
                      AI Generate
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                      <Pencil className="h-4 w-4" />
                      Manual
                    </Button>
                  </div>
                </div>
              </Card>
            </Link>
          </motion.div>
          
          {/* Project Cards */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="col-span-1 md:col-span-2"
          >
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} delay={index * 0.1} />
            ))}
          </motion.div>
        </div>
        
        {/* Additional sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Quick Actions Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Access common tools and features</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-auto flex flex-col items-center justify-start p-4 gap-2 hover:bg-pixar-blue/5">
                  <MagicWand className="h-10 w-10 text-pixar-blue mb-2" />
                  <span className="text-sm font-medium">AI Story Generator</span>
                </Button>
                <Button variant="outline" className="h-auto flex flex-col items-center justify-start p-4 gap-2 hover:bg-pixar-purple/5">
                  <Pencil className="h-10 w-10 text-pixar-purple mb-2" />
                  <span className="text-sm font-medium">Script Editor</span>
                </Button>
                <Button variant="outline" className="h-auto flex flex-col items-center justify-start p-4 gap-2 hover:bg-pixar-orange/5">
                  <Film className="h-10 w-10 text-pixar-orange mb-2" />
                  <span className="text-sm font-medium">Scene Gallery</span>
                </Button>
                <Button variant="outline" className="h-auto flex flex-col items-center justify-start p-4 gap-2 hover:bg-pixar-green/5">
                  <Video className="h-10 w-10 text-pixar-green mb-2" />
                  <span className="text-sm font-medium">My Animations</span>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>What's been happening in your projects</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0">
                    <div className="w-10 h-10 rounded-full bg-pixar-blue/10 flex items-center justify-center flex-shrink-0">
                      <Film className="h-5 w-5 text-pixar-blue" />
                    </div>
                    <div>
                      <p className="font-medium">Animation {i} Generated</p>
                      <p className="text-sm text-muted-foreground">2 hour{i > 1 ? 's' : ''} ago</p>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="ml-auto">
                  View All Activity
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
