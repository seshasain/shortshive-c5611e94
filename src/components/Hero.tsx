import React from 'react';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { Play, ArrowRight, Sparkles, FileText, Rocket } from 'lucide-react';
import { useTheme } from '@/lib/theme';

const Hero = () => {
  const { theme } = useTheme();
  
  return (
    <div className={`relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50'
    }`}>
      {/* Enhanced animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.2, scale: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          className="absolute top-[5%] left-[8%] w-40 h-40 rounded-full bg-pixar-blue/20"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.2, scale: 1 }}
          transition={{ duration: 2.5, repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
          className="absolute top-[15%] right-[12%] w-32 h-32 rounded-full bg-pixar-purple/20"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.2, scale: 1 }}
          transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", delay: 1 }}
          className="absolute bottom-[10%] left-[18%] w-48 h-48 rounded-full bg-pixar-teal/20"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.2, scale: 1 }}
          transition={{ duration: 3.5, repeat: Infinity, repeatType: "reverse", delay: 1.5 }}
          className="absolute bottom-[20%] right-[15%] w-36 h-36 rounded-full bg-pixar-orange/20"
        />
      </div>
      
      <div className="container-custom relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Text Content with enhanced animations */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className={`inline-block mb-4 px-4 py-2 rounded-full shadow-sm backdrop-blur-sm ${
                theme === 'dark' 
                  ? 'bg-gray-800/80' 
                  : 'bg-white/80'
              }`}>
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 text-pixar-orange" />
                  <span className={`text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                  }`}>AI-Powered Animation Platform</span>
                </div>
              </div>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6"
            >
              <span className="pixar-text-gradient">Create Pixar-Level</span> 
              <br />
              <span className={`relative ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Short Animations 
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" xmlns="http://www.w3.org/2000/svg">
                  <path 
                    d="M3 9C50 5 100 1 150 9C200 12 250 8 297 6" 
                    fill="none" 
                    stroke="url(#gradient)" 
                    strokeWidth="3" 
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3498db" />
                      <stop offset="100%" stopColor="#9b59b6" />
                    </linearGradient>
                  </defs>
                </svg>
              </span> 
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="text-pixar-orange"
              > Instantly</motion.span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className={`text-xl md:text-2xl mb-8 max-w-2xl mx-auto lg:mx-0 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              Transform your stories into stunning animated shorts with consistent characters, voiceovers, and subtitles.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button className="primary-button text-lg group relative overflow-hidden">
                <span className="relative z-10 flex items-center">
                  <Rocket className="mr-2 h-5 w-5" />
                  Create Your Animation
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-pixar-blue to-pixar-purple opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </Button>
              
              <Button variant="outline" className={`text-lg flex items-center group relative overflow-hidden border-2 hover:border-pixar-orange hover:text-pixar-orange transition-colors ${
                theme === 'dark' ? 'border-gray-700 text-gray-300' : ''
              }`}>
                <Play className="mr-2 h-5 w-5 text-pixar-orange group-hover:scale-110 transition-transform" />
                Watch Examples
              </Button>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="mt-8 lg:mt-12 flex items-center justify-center lg:justify-start space-x-6"
            >
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`w-8 h-8 rounded-full border-2 ${theme === 'dark' ? 'border-gray-800' : 'border-white'} bg-gradient-to-br from-pixar-blue to-pixar-purple flex items-center justify-center text-white text-xs font-bold`}>
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                <span className={`font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>1,000+</span> animations created today
              </div>
            </motion.div>
          </motion.div>
          
          {/* Right Animation Preview with enhanced effects */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex-1 relative"
          >
            <div className={`w-full aspect-video relative z-10 rounded-2xl overflow-hidden shadow-2xl border-4 ${
              theme === 'dark' ? 'border-gray-800' : 'border-white'
            }`}>
              <div className="absolute inset-0 bg-gradient-to-br from-pixar-blue/90 to-pixar-purple/90 mix-blend-soft-light"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0.8 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                  className="h-20 w-20 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center"
                >
                  <Play className="h-12 w-12 text-white" />
                </motion.div>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1636622433525-127afdf3662d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2532&q=80" 
                alt="Animation Preview" 
                className="w-full h-full object-cover opacity-80"
              />
            </div>
            
            {/* Enhanced floating interface elements */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
              className={`absolute -bottom-6 -left-6 rounded-xl shadow-lg p-3 z-20 ${
                theme === 'dark' 
                  ? 'bg-gray-800 border border-gray-700' 
                  : 'bg-white border border-gray-100'
              }`}
            >
              <motion.div 
                animate={{ y: [0, -5, 0] }} 
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="flex items-center space-x-2"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pixar-red to-pixar-orange flex items-center justify-center text-white font-bold">A</div>
                <div className="text-left">
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Character</p>
                  <p className={`font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>Adventure Amy</p>
                </div>
              </motion.div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className={`absolute -top-4 -right-4 rounded-xl shadow-lg p-3 z-20 ${
                theme === 'dark' 
                  ? 'bg-gray-800 border border-gray-700' 
                  : 'bg-white border border-gray-100'
              }`}
            >
              <motion.div 
                animate={{ y: [0, -5, 0] }} 
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="flex items-center space-x-2"
              >
                <div className="text-right">
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Scene</p>
                  <p className={`font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>Forest Adventure</p>
                </div>
                <FileText className="w-6 h-6 text-pixar-purple" />
              </motion.div>
            </motion.div>
            
            {/* Stats card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              className={`absolute top-1/2 -right-4 transform -translate-y-1/2 rounded-lg shadow-lg p-3 z-20 ${
                theme === 'dark' 
                  ? 'bg-gray-800 border border-gray-700' 
                  : 'bg-white border border-gray-100'
              }`}
            >
              <motion.div 
                animate={{ y: [0, -5, 0] }} 
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Progress</p>
                <div className="w-48 bg-gray-200 rounded-full h-2.5 my-2 dark:bg-gray-700">
                  <div className="bg-pixar-teal h-2.5 rounded-full w-[70%]"></div>
                </div>
                <p className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>70% Complete</p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* Added Stats section */}
      <div className={`mt-20 py-10 relative z-10 ${
        theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/50'
      } backdrop-blur-sm`}>
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { label: "Active Users", value: "10,000+", icon: "👥" },
              { label: "Animations Created", value: "250,000+", icon: "🎬" },
              { label: "Positive Reviews", value: "99.8%", icon: "⭐" },
              { label: "Average Render Time", value: "60 sec", icon: "⚡" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="px-4 py-6"
              >
                <div className="text-3xl mb-1">{stat.icon}</div>
                <h4 className={`text-2xl sm:text-3xl font-bold mb-1 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>{stat.value}</h4>
                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
