
import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

const Stories = () => {
  // Sample data - in a real app this would come from an API/database
  const stories = [
    {
      id: 1,
      title: "The Enchanted Garden",
      content: "Once upon a time in a magical garden where flowers talked and trees sang...",
      tags: ["fantasy", "magic", "adventure"],
      date: "2 days ago",
      wordCount: 1200
    },
    {
      id: 2,
      title: "Lost in Space",
      content: "Captain Alex woke to blaring alarms as the ship drifted into unknown territory...",
      tags: ["sci-fi", "action", "thriller"],
      date: "1 week ago",
      wordCount: 2100
    },
    {
      id: 3,
      title: "The Mystery of Blackwood Manor",
      content: "The old manor stood atop the hill, its windows like eyes watching over the town...",
      tags: ["mystery", "horror", "suspense"],
      date: "3 days ago",
      wordCount: 1800
    },
    {
      id: 4,
      title: "A Journey Through Time",
      content: "The pocket watch glowed with an unearthly light as Sarah touched its golden surface...",
      tags: ["time travel", "history", "adventure"],
      date: "2 weeks ago",
      wordCount: 1600
    }
  ];

  return (
    <DashboardLayout>
      <div className="container-custom py-6 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Stories</h1>
            <p className="text-gray-500 mt-1">Create and manage your story ideas and scripts</p>
          </div>
          <div className="flex gap-2">
            <Button className="bg-gradient-to-r from-pixar-blue to-purple-600 hover:opacity-90 text-white">
              <Plus className="mr-2 h-4 w-4" /> New Story
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search stories..."
              className="pl-10 w-full"
            />
          </div>
          <Tabs defaultValue="all" className="w-full sm:w-auto">
            <TabsList className="grid w-full sm:w-auto grid-cols-3 sm:flex">
              <TabsTrigger value="all">All Stories</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="animated">Animated</TabsTrigger>
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
            {stories.map((story) => (
              <Card key={story.id} className="overflow-hidden hover:shadow-md transition-shadow border border-gray-200">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-xl text-gray-900">{story.title}</h3>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {story.wordCount} words
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-6">
                  <p className="text-gray-600 line-clamp-3">{story.content}</p>
                  <div className="flex gap-2 mt-4 flex-wrap">
                    {story.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-gray-100 text-gray-700">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 pt-3 pb-3 flex justify-between border-t">
                  <span className="text-sm text-gray-500">{story.date}</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost">
                      <FileText className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button size="sm" variant="outline" className="text-pixar-blue hover:text-white hover:bg-pixar-blue">
                      Animate
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </motion.div>
        </TabsContent>
      </div>
    </DashboardLayout>
  );
};

export default Stories;
