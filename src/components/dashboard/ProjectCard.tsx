import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, MoreVertical, Edit } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

type Project = {
  id: string;
  title: string;
  thumbnail: string;
  date: string;
  status: 'draft' | 'completed' | 'processing';
}

interface ProjectCardProps {
  project: Project;
  delay?: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, delay = 0 }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        delay 
      } 
    }
  };

  return (
    <motion.div 
      variants={item}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="mb-5"
    >
      <Card className="overflow-hidden hover:shadow-md transition-all duration-300 dark:bg-gray-800 dark:border-gray-700">
        <div className="relative">
          <img 
            src={project.thumbnail} 
            alt={project.title}
            className="w-full h-48 object-cover"
          />
          {project.status === 'completed' && (
            <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button 
                size="icon" 
                className="bg-white text-pixar-blue hover:bg-white/90 dark:bg-gray-800 dark:text-pixar-blue/80 dark:hover:bg-gray-700"
              >
                <Play className="h-6 w-6" />
              </Button>
            </div>
          )}
          <Badge 
            className={`absolute top-3 right-3 ${getStatusColor(project.status)} dark:bg-opacity-20`}
          >
            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
          </Badge>
        </div>
        
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold mb-1 dark:text-white">{project.title}</h3>
              <p className="text-sm text-muted-foreground dark:text-gray-400">
                Last edited: {new Date(project.date).toLocaleDateString()}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="dark:text-gray-400 dark:hover:text-pixar-blue dark:hover:bg-gray-700">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="dark:bg-gray-800 dark:border-gray-700">
                <DropdownMenuItem className="dark:text-gray-300 dark:hover:text-pixar-blue dark:hover:bg-gray-700">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem className="dark:text-gray-300 dark:hover:text-pixar-blue dark:hover:bg-gray-700">Duplicate</DropdownMenuItem>
                <DropdownMenuItem className="text-red-500 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-gray-700">Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0 flex justify-between">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-pixar-blue hover:text-pixar-darkblue hover:bg-pixar-blue/5 dark:text-pixar-blue/80 dark:hover:text-pixar-blue dark:hover:bg-gray-700"
          >
            Preview
          </Button>
          <Link to={project.status === 'draft' ? `/build-story?id=${project.id}` : `/review-story?id=${project.id}`}>
            <Button 
              size="sm" 
              className="bg-pixar-blue text-white hover:bg-pixar-darkblue dark:bg-pixar-blue/80 dark:hover:bg-pixar-blue"
            >
              {project.status === 'draft' ? 'Continue Editing' : 'View Details'}
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ProjectCard;
