
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, MoreVertical, Edit } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface ProjectCardProps {
  id: string;
  title: string;
  description?: string;
  status: string;
  thumbnail?: string;
  createdAt: string;
  type: 'animation' | 'story';
}

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  id, 
  title, 
  description, 
  status, 
  thumbnail, 
  createdAt, 
  type 
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'processing':
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const thumbnailUrl = thumbnail || 'https://images.unsplash.com/photo-1579547945413-497e1b99dac0?q=80&w=500';
  const formattedDate = new Date(createdAt).toLocaleDateString();

  return (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-300 h-full flex flex-col">
      <div className="relative">
        <img 
          src={thumbnailUrl} 
          alt={title}
          className="w-full h-48 object-cover"
        />
        {status === 'completed' && (
          <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button 
              size="icon" 
              className="bg-white text-pixar-blue hover:bg-white/90"
            >
              <Play className="h-6 w-6" />
            </Button>
          </div>
        )}
        <Badge 
          className={`absolute top-3 right-3 ${getStatusColor(status)}`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
        </Badge>
      </div>
      
      <CardContent className="p-4 flex-grow">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground">
              Last edited: {formattedDate}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {description && (
          <p className="text-gray-600 mt-2 line-clamp-2">{description}</p>
        )}
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <div className="flex justify-between w-full">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-pixar-blue hover:text-pixar-darkblue hover:bg-pixar-blue/5"
          >
            Preview
          </Button>
          <Link to={status === 'draft' ? `/build-story?id=${id}` : `/review-story?id=${id}`}>
            <Button 
              size="sm" 
              className="bg-pixar-blue text-white hover:bg-pixar-darkblue"
            >
              {status === 'draft' ? 'Continue Editing' : 'View Details'}
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
