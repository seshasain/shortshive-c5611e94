import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
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
  Video,
  Star,
  Zap,
  BarChart,
  Play,
  ArrowRight,
  Check,
  CheckCircle2
} from 'lucide-react';

const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description, 
  gradient = "from-pixar-blue to-pixar-teal",
  highlighted = false
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string;
  gradient?: string;
  highlighted?: boolean;
}) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={`rounded-2xl p-8 hover:shadow-xl transition-all duration-300 group border h-full ${
        highlighted 
          ? 'border-pixar-blue/50 bg-gradient-to-b from-white to-blue-50/30 dark:from-gray-800 dark:to-gray-900' 
          : 'bg-white border-gray-100 dark:bg-gray-800 dark:border-gray-700'
      }`}
    >
      <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="text-white h-8 w-8" />
      </div>
      <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </motion.div>
  );
};

const Features = () => {
  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const featuresList = [
    {
      icon: Users,
      title: "Perfect Character Consistency",
      description: "Our exclusive technology ensures characters maintain identical appearance and personality across all scenes - a feature no competitor offers.",
      gradient: "from-pixar-purple to-pixar-blue",
      highlighted: true
    },
    {
      icon: Sparkles,
      title: "AI Story Generator",
      description: "Create compelling narratives with our advanced AI, or customize your own stories for animation.",
      gradient: "from-pixar-blue to-pixar-teal"
    },
    {
      icon: Wand2,
      title: "One-Click Animation",
      description: "Transform your story into a fully animated short with a single click, powered by our AI.",
      gradient: "from-pixar-teal to-pixar-green",
      highlighted: true
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

  const comparisonData = [
    { feature: "Time to create a 2-min animation", traditional: "2-8 weeks", shortshive: "15-30 minutes" },
    { feature: "Professional animation skills required", traditional: "Yes", shortshive: "No" },
    { feature: "Average cost", traditional: "$5,000-$20,000", shortshive: "Starting at $19/month" },
    { feature: "Revisions and changes", traditional: "Time-consuming", shortshive: "Instant" },
    { feature: "Character consistency", traditional: "Requires skilled animators", shortshive: "Automatic" },
    { feature: "Multi-language support", traditional: "Additional cost", shortshive: "Included" }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* SEO Optimization */}
      <Helmet>
        <title>Perfect Character Consistency - ShortsHive | AI-Powered Animation Platform</title>
        <meta name="description" content="Discover ShortsHive's exclusive character consistency technology - ensuring your characters maintain identical appearance and personality across all scenes, a feature no competitor offers." />
        <meta name="keywords" content="character consistency, animation character continuity, AI animation features, story generation, character customization" />
        <meta property="og:title" content="Perfect Character Consistency - ShortsHive | AI-Powered Animation Platform" />
        <meta property="og:description" content="Discover ShortsHive's exclusive character consistency technology - ensuring your characters maintain identical appearance across all scenes." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://shortshive.com/features" />
      </Helmet>
      
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="pt-20 pb-16 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
          {/* Background elements */}
          <div className="absolute inset-0">
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.2, 0.1]
              }} 
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-10 left-10 w-64 h-64 rounded-full bg-pixar-purple/10 blur-3xl"
            />
            <motion.div 
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.1, 0.15, 0.1]
              }} 
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-pixar-blue/10 blur-3xl"
            />
          </div>
          
          <div className="container-custom text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="inline-block mb-4 px-4 py-2 rounded-full bg-pixar-purple/10 text-pixar-purple">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span className="text-sm font-medium">Exclusive Feature</span>
                </div>
              </div>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pixar-purple to-pixar-blue">Perfect Character Consistency</span>
              <span className="block text-gray-900 dark:text-white">Across All Your Scenes</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto"
            >
              <strong>Only ShortsHive</strong> ensures your characters maintain identical appearance and personality in every scene - a revolutionary feature our competitors can't match.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row items-center justify-center gap-5"
            >
              <Link to="/dashboard">
                <Button className="bg-gradient-to-r from-pixar-blue to-pixar-purple hover:from-pixar-blue/90 hover:to-pixar-purple/90 text-white text-lg px-8 py-6 rounded-full shadow-lg group">
                  Start Creating Now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/examples">
                <Button variant="outline" className="border-gray-300 dark:border-gray-700 hover:border-pixar-blue dark:hover:border-pixar-blue text-gray-900 dark:text-white text-lg px-8 py-6 rounded-full flex items-center gap-2">
                  <Play className="h-5 w-5 text-pixar-blue" />
                  Watch Examples
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
        
        {/* Character Consistency Showcase - NEW */}
        <section className="py-24 bg-white dark:bg-gray-900 overflow-hidden relative">
          <div className="container-custom">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="flex-1"
              >
                <div className="relative">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div className="rounded-xl overflow-hidden shadow-lg border-2 border-pixar-purple/30">
                        <img 
                          src="https://images.unsplash.com/photo-1627163439134-7a8c47e08208?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80" 
                          alt="Character in scene 1" 
                          className="w-full h-auto"
                        />
                        <div className="bg-white dark:bg-gray-800 p-2 text-center">
                          <p className="text-sm text-gray-700 dark:text-gray-300">Scene 1</p>
                        </div>
                      </div>
                      <div className="rounded-xl overflow-hidden shadow-lg border-2 border-pixar-purple/30">
                        <img 
                          src="https://images.unsplash.com/photo-1627163439134-7a8c47e08208?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80" 
                          alt="Character in scene 2" 
                          className="w-full h-auto"
                        />
                        <div className="bg-white dark:bg-gray-800 p-2 text-center">
                          <p className="text-sm text-gray-700 dark:text-gray-300">Scene 2</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4 mt-8">
                      <div className="rounded-xl overflow-hidden shadow-lg border-2 border-pixar-purple/30">
                        <img 
                          src="https://images.unsplash.com/photo-1627163439134-7a8c47e08208?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80" 
                          alt="Character in scene 3" 
                          className="w-full h-auto"
                        />
                        <div className="bg-white dark:bg-gray-800 p-2 text-center">
                          <p className="text-sm text-gray-700 dark:text-gray-300">Scene 3</p>
                        </div>
                      </div>
                      <div className="rounded-xl overflow-hidden shadow-lg border-2 border-pixar-purple/30">
                        <img 
                          src="https://images.unsplash.com/photo-1627163439134-7a8c47e08208?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80" 
                          alt="Character in scene 4" 
                          className="w-full h-auto"
                        />
                        <div className="bg-white dark:bg-gray-800 p-2 text-center">
                          <p className="text-sm text-gray-700 dark:text-gray-300">Scene 4</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Connection lines */}
                  <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                    <line x1="25%" y1="25%" x2="75%" y2="75%" stroke="rgba(139, 92, 246, 0.5)" strokeWidth="2" strokeDasharray="6,6" />
                    <line x1="25%" y1="75%" x2="75%" y2="25%" stroke="rgba(139, 92, 246, 0.5)" strokeWidth="2" strokeDasharray="6,6" />
                  </svg>
                  
                  {/* Center badge */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full shadow-lg p-3 z-20 border-2 border-pixar-purple">
                    <div className="bg-gradient-to-r from-pixar-purple to-pixar-blue rounded-full h-14 w-14 flex items-center justify-center">
                      <Users className="h-7 w-7 text-white" />
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="flex-1"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white leading-tight">
                  Why Character Consistency <span className="text-transparent bg-clip-text bg-gradient-to-r from-pixar-purple to-pixar-blue">Matters</span>
                </h2>
                
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
                  Character consistency is crucial for creating professional animations that engage viewers. When characters change appearance between scenes, it breaks immersion and reduces the quality of your story.
                </p>
                
                <div className="mb-8 space-y-6">
                  <div className="flex items-start">
                    <div className="bg-pixar-purple/10 rounded-lg p-3 mr-4">
                      <Star className="h-6 w-6 text-pixar-purple" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-1 text-gray-900 dark:text-white">The Competition</h3>
                      <p className="text-gray-700 dark:text-gray-300">Other platforms produce characters that change appearance between scenes, with inconsistent features, clothing, and proportions.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-pixar-blue/10 rounded-lg p-3 mr-4">
                      <CheckCircle2 className="h-6 w-6 text-pixar-blue" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-1 text-gray-900 dark:text-white">Only ShortsHive</h3>
                      <p className="text-gray-700 dark:text-gray-300">Our proprietary technology ensures characters maintain perfect consistency across every scene, angle, and interaction.</p>
                    </div>
                  </div>
                </div>
                
                <p className="text-lg font-medium text-gray-900 dark:text-white mb-6">
                  This exclusive feature creates:
                </p>
                
                <ul className="space-y-3 mb-8">
                  {[
                    "Professional-quality animations that feel cohesive",
                    "More engaging stories that maintain viewer immersion",
                    "Stronger character recognition and emotional connection",
                    "Animations that compete with professional studio quality"
                  ].map((point, index) => (
                    <motion.li 
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 * index }}
                      viewport={{ once: true }}
                      className="flex items-center text-gray-700 dark:text-gray-300"
                    >
                      <Check className="h-5 w-5 text-pixar-blue mr-3 flex-shrink-0" />
                      <span>{point}</span>
                    </motion.li>
                  ))}
                </ul>
                
                <Link to="/dashboard">
                  <Button className="bg-gradient-to-r from-pixar-purple to-pixar-blue hover:from-pixar-purple/90 hover:to-pixar-blue/90 text-white text-lg px-8 py-3 rounded-full group">
                    Try It Now
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Featured Highlights */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                Key Features That Make <span className="text-transparent bg-clip-text bg-gradient-to-r from-pixar-blue to-pixar-purple">ShortsHive</span> Special
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Our powerful tools work together to simplify the animation creation process without sacrificing quality.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {featuresList.slice(0, 6).map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <FeatureCard
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                    gradient={feature.gradient}
                    highlighted={feature.highlighted}
                  />
                </motion.div>
              ))}
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="mt-16 text-center"
            >
              <Link to="/dashboard">
                <Button className="bg-pixar-blue hover:bg-pixar-blue/90 text-white px-8 py-3 rounded-full">
                  Try All Features
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
        
        {/* Showcase/Comparison Section - UPDATED */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
          {/* Background elements */}
          <div className="absolute inset-0">
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.05, 0.1, 0.05]
              }} 
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-40 right-10 w-96 h-96 rounded-full bg-pixar-teal/10 blur-3xl"
            />
          </div>
          
          <div className="container-custom relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="flex-1"
              >
                <div className="inline-block mb-4 px-4 py-2 rounded-full bg-pixar-teal/10 text-pixar-teal">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-5 w-5" />
                    <span className="text-sm font-medium">Productivity Boost</span>
                  </div>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                  Traditional Animation vs <span className="text-transparent bg-clip-text bg-gradient-to-r from-pixar-teal to-pixar-green">ShortsHive</span>
                </h2>
                
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                  See how ShortsHive transforms the animation creation process, saving you time, money, and technical expertise while delivering professional results with perfect character consistency.
                </p>
                
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700"
                >
                  <table className="w-full text-left">
                    <thead className="bg-gray-100 dark:bg-gray-800">
                      <tr>
                        <th className="py-4 px-6 text-gray-900 dark:text-white">Feature</th>
                        <th className="py-4 px-6 text-gray-500 dark:text-gray-400">Traditional Animation</th>
                        <th className="py-4 px-6 text-pixar-teal">ShortsHive</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
                      {comparisonData.map((item, index) => (
                        <motion.tr
                          key={index}
                          variants={itemVariants}
                          className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                        >
                          <td className="py-4 px-6 font-medium text-gray-900 dark:text-white">{item.feature}</td>
                          <td className="py-4 px-6 text-gray-500 dark:text-gray-400">{item.traditional}</td>
                          <td className="py-4 px-6 text-pixar-teal font-medium">{item.shortshive}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </motion.div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="flex-1"
              >
                <div className="relative">
                  <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
                    <img 
                      src="https://images.unsplash.com/photo-1636622433525-127afdf3662d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2532&q=80" 
                      alt="Animation Preview" 
                      className="w-full h-auto rounded-2xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-pixar-blue/30 to-transparent"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="w-20 h-20 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center cursor-pointer"
                      >
                        <Play className="h-10 w-10 text-white" />
                      </motion.div>
                    </div>
                  </div>
                  
                  {/* Floating stats */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    viewport={{ once: true }}
                    className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-20"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-pixar-teal/10 flex items-center justify-center">
                        <BarChart className="h-6 w-6 text-pixar-teal" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white text-xl">98%</p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Time saved</p>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    viewport={{ once: true }}
                    className="absolute -top-6 -right-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-20"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-pixar-purple/10 flex items-center justify-center">
                        <Star className="h-6 w-6 text-pixar-purple" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white text-xl">4.9/5</p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">User rating</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* More Features */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                More Powerful <span className="text-transparent bg-clip-text bg-gradient-to-r from-pixar-orange to-pixar-red">Features</span> to Explore
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Discover additional tools that will help you create exceptional animations
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {featuresList.slice(6).map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <FeatureCard
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                    gradient={feature.gradient}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section - UPDATED */}
        <section className="py-20 bg-gradient-to-r from-pixar-blue to-pixar-purple text-white relative overflow-hidden">
          {/* Background elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern"></div>
          </div>
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1]
            }} 
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-10 left-10 w-64 h-64 rounded-full bg-white/10 blur-3xl"
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.15, 0.1]
            }} 
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-white/10 blur-3xl"
          />
          
          <div className="container-custom text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Experience Perfect Character Consistency
              </h2>
              <p className="text-xl mb-10 max-w-2xl mx-auto opacity-90">
                Create animations with characters that maintain consistent appearance and personality across all scenes - a feature exclusive to ShortsHive.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-10">
                <Link to="/dashboard">
                  <Button className="bg-white text-pixar-blue hover:bg-gray-100 text-lg px-8 py-6 rounded-full shadow-lg group">
                    Get Started For Free
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/pricing">
                  <Button variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8 py-6 rounded-full">
                    View Pricing
                  </Button>
                </Link>
              </div>
              
              <div className="flex flex-col md:flex-row justify-center items-center gap-6 mt-10">
                {[
                  "No credit card required",
                  "7-day free trial",
                  "Cancel anytime"
                ].map((item, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    viewport={{ once: true }}
                    className="flex items-center gap-2"
                  >
                    <Check className="h-5 w-5 text-pixar-yellow" />
                    <span>{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Features;
