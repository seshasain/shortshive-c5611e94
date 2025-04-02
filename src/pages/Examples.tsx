
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from "@/components/ui/button";
import { Play, Filter, ArrowRight } from 'lucide-react';

const videoCategories = [
  "All",
  "Short Films",
  "Character Demos",
  "Storytelling",
  "Action",
  "Comedy",
  "Educational"
];

const exampleVideos = [
  {
    id: 1,
    title: "Adventure in the Clouds",
    thumbnail: "https://images.unsplash.com/photo-1559083991-9bdef0d1a711?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    duration: "1:24",
    category: "Short Films",
    creator: "Pixar Studio",
    views: "324K"
  },
  {
    id: 2,
    title: "Robot's First Day",
    thumbnail: "https://images.unsplash.com/photo-1563804447971-6e113ab80713?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    duration: "2:12",
    category: "Comedy",
    creator: "AnimationAI",
    views: "156K"
  },
  {
    id: 3,
    title: "Ocean Explorers",
    thumbnail: "https://images.unsplash.com/photo-1510511233900-1982d92bd835?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    duration: "3:45",
    category: "Educational",
    creator: "OceanLife",
    views: "89K"
  },
  {
    id: 4,
    title: "Countryside Adventure",
    thumbnail: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1944&q=80",
    duration: "2:48",
    category: "Storytelling",
    creator: "StoryMakers",
    views: "237K"
  },
  {
    id: 5,
    title: "Superhero Rescue",
    thumbnail: "https://images.unsplash.com/photo-1608889476518-738c9b1dcb40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1780&q=80",
    duration: "4:12",
    category: "Action",
    creator: "SuperStudio",
    views: "412K"
  },
  {
    id: 6,
    title: "Character Expressions",
    thumbnail: "https://images.unsplash.com/photo-1633613286848-e6f43bbafb8d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    duration: "1:34",
    category: "Character Demos",
    creator: "CharacterAI",
    views: "76K"
  },
  {
    id: 7,
    title: "The Lost Toy",
    thumbnail: "https://images.unsplash.com/photo-1523586044048-b7d6e5d36cba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    duration: "3:22",
    category: "Short Films",
    creator: "ToyStories",
    views: "189K"
  },
  {
    id: 8,
    title: "Jungle Friends",
    thumbnail: "https://images.unsplash.com/photo-1478860409698-8707f313ee8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    duration: "2:56",
    category: "Comedy",
    creator: "JungleTales",
    views: "245K"
  },
  {
    id: 9,
    title: "Space Adventure",
    thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    duration: "4:48",
    category: "Action",
    creator: "SpaceTime",
    views: "367K"
  }
];

const VideoCard = ({ video }: { video: typeof exampleVideos[0] }) => {
  return (
    <div className="group rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={video.thumbnail} 
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
            <Play className="h-8 w-8 text-white fill-white" />
          </div>
        </div>
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          {video.duration}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1 group-hover:text-pixar-blue transition-colors">{video.title}</h3>
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>{video.creator}</span>
          <span>{video.views} views</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
            {video.category}
          </span>
          <Button variant="ghost" size="sm" className="text-pixar-blue p-0 h-auto">
            Watch <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const Examples = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  
  const filteredVideos = activeCategory === "All" 
    ? exampleVideos 
    : exampleVideos.filter(video => video.category === activeCategory);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="pt-20 pb-16 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="container-custom text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 pixar-text-gradient">
              Animation Gallery
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
              Explore stunning examples created with PixarifyAI by our users and team.
            </p>
            <Button className="primary-button text-lg">
              Create Your Own
            </Button>
          </div>
        </section>
        
        {/* Filter Categories */}
        <section className="py-8 border-b border-gray-200 sticky top-16 bg-white z-20 shadow-sm">
          <div className="container-custom">
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <Filter className="h-5 w-5 text-gray-400 mr-2" />
              {videoCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                    activeCategory === category
                      ? 'bg-pixar-blue text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>
        
        {/* Video Grid */}
        <section className="py-16">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredVideos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
            
            {filteredVideos.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No videos found in this category.</p>
              </div>
            )}
            
            {filteredVideos.length > 0 && (
              <div className="text-center mt-12">
                <Button variant="outline" className="text-pixar-blue border-pixar-blue">
                  Load More Examples
                </Button>
              </div>
            )}
          </div>
        </section>
        
        {/* Feature Callout */}
        <section className="py-20 bg-gradient-to-br from-pixar-purple to-pixar-blue text-white">
          <div className="container-custom text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Create Your Own Animation?
            </h2>
            <p className="text-xl mb-10 max-w-3xl mx-auto opacity-90">
              Join thousands of creators who are bringing their stories to life with our AI-powered animation platform.
            </p>
            <Button className="bg-white text-pixar-blue hover:bg-gray-100 pixar-button text-lg">
              Start Creating For Free
            </Button>
            <p className="mt-4 opacity-80">No credit card required</p>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Examples;
