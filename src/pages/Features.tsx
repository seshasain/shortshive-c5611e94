
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  PenTool, 
  Wand2, 
  Users, 
  MessageSquareText, 
  Languages, 
  Download, 
  Sparkle,
  UserPlus,
  Palette,
  Heart,
  Video
} from 'lucide-react';

const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description, 
  gradient = "from-pixar-blue to-pixar-teal"
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string;
  gradient?: string;
}) => {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="text-white h-7 w-7" />
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const Features = () => {
  const featuresList = [
    {
      icon: Sparkles,
      title: "AI Story Generator",
      description: "Create compelling narratives with our advanced AI, or customize your own stories for animation.",
      gradient: "from-pixar-purple to-pixar-blue"
    },
    {
      icon: Users,
      title: "Character Library",
      description: "Choose from hundreds of Pixar-style characters or customize your own with our intuitive tools.",
      gradient: "from-pixar-blue to-pixar-teal"
    },
    {
      icon: Wand2,
      title: "One-Click Animation",
      description: "Transform your story into a fully animated short with a single click, powered by our AI.",
      gradient: "from-pixar-teal to-pixar-green"
    },
    {
      icon: MessageSquareText,
      title: "Voice Customization",
      description: "Choose from 100+ realistic voices in multiple languages to bring your characters to life.",
      gradient: "from-pixar-green to-pixar-yellow"
    },
    {
      icon: Languages,
      title: "Automatic Subtitles",
      description: "Generate accurate subtitles in 50+ languages for global accessibility.",
      gradient: "from-pixar-yellow to-pixar-orange"
    },
    {
      icon: Download,
      title: "Multiple Export Options",
      description: "Download your animations in various formats and resolutions for any platform.",
      gradient: "from-pixar-orange to-pixar-red"
    },
    {
      icon: Sparkle,
      title: "Style Consistency",
      description: "Maintain consistent character appearance and animation style across all scenes.",
      gradient: "from-pixar-red to-pixar-purple"
    },
    {
      icon: PenTool,
      title: "Scene Editing",
      description: "Fine-tune scenes, camera angles, and transitions with our intuitive editor.",
      gradient: "from-pixar-purple to-pixar-blue"
    },
    {
      icon: UserPlus,
      title: "Collaboration",
      description: "Work together with your team on animations with our robust sharing features.",
      gradient: "from-pixar-blue to-pixar-teal"
    },
    {
      icon: Palette,
      title: "Custom Art Styles",
      description: "Choose from various Pixar-inspired art styles or create your own unique look.",
      gradient: "from-pixar-teal to-pixar-green"
    },
    {
      icon: Heart,
      title: "Save & Favorite",
      description: "Save your favorite animations and characters for quick access in future projects.",
      gradient: "from-pixar-green to-pixar-yellow"
    },
    {
      icon: Video,
      title: "Animation Templates",
      description: "Start with pre-designed templates to quickly create professional animations.",
      gradient: "from-pixar-yellow to-pixar-orange"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="pt-20 pb-16 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="container-custom text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 pixar-text-gradient">
              Powerful Features for Magical Animations
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
              Everything you need to create stunning Pixar-quality animations in minutes, not months.
            </p>
            <Button className="primary-button text-lg">
              Start Creating Now
            </Button>
          </div>
        </section>
        
        {/* Features Grid */}
        <section className="py-20">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuresList.map((feature, index) => (
                <FeatureCard 
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  gradient={feature.gradient}
                />
              ))}
            </div>
          </div>
        </section>
        
        {/* Showcase Section */}
        <section className="py-20 bg-gradient-to-br from-pixar-blue to-pixar-teal text-white">
          <div className="container-custom">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Experience the Magic of AI-Powered Animation
                </h2>
                <p className="text-xl mb-8 text-white/90">
                  Our platform combines the latest in artificial intelligence with the artistry of Pixar-style animation to help you create stunning animated shorts in minutes.
                </p>
                <Button className="bg-white text-pixar-blue hover:bg-gray-100 pixar-button text-lg">
                  See Examples
                </Button>
              </div>
              
              <div className="flex-1">
                <div className="rounded-2xl overflow-hidden border-4 border-white/30 shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1636622433525-127afdf3662d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2532&q=80" 
                    alt="Animation Preview" 
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Features;
