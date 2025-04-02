
import React from 'react';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { Play, ArrowRight, Sparkles, FileText, Rocket } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50 pt-16 pb-20 md:pt-24 md:pb-28">
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
              <div className="inline-block mb-4 px-4 py-2 rounded-full bg-white/80 shadow-sm backdrop-blur-sm">
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 text-pixar-orange" />
                  <span className="text-sm font-medium text-gray-800">AI-Powered Animation Platform</span>
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
              <span className="relative">
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
              className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0"
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
              
              <Button variant="outline" className="text-lg flex items-center group relative overflow-hidden border-2 hover:border-pixar-orange hover:text-pixar-orange transition-colors">
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
                  <div key={i} className={`w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br from-pixar-blue to-pixar-purple flex items-center justify-center text-white text-xs font-bold`}>
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-semibold text-gray-800">1,000+</span> animations created today
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
            <div className="w-full aspect-video relative z-10 rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
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
              className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-3 z-20 border border-gray-100"
            >
              <motion.div 
                animate={{ y: [0, -5, 0] }} 
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="flex items-center space-x-2"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pixar-red to-pixar-orange flex items-center justify-center text-white font-bold">A</div>
                <div className="text-left">
                  <p className="text-xs text-gray-500">Character</p>
                  <p className="font-semibold">Adventure Amy</p>
                </div>
              </motion.div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-3 z-20 border border-gray-100"
            >
              <motion.div 
                animate={{ y: [0, -5, 0] }} 
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="flex items-center space-x-2"
              >
                <div className="text-right">
                  <p className="text-xs text-gray-500">Voice</p>
                  <p className="font-semibold">English (US)</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pixar-green to-pixar-teal flex items-center justify-center text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                  </svg>
                </div>
              </motion.div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              className="absolute top-1/2 -right-6 transform -translate-y-1/2 bg-white rounded-xl shadow-lg p-3 z-20 border border-gray-100"
            >
              <motion.div 
                animate={{ y: [0, -5, 0] }} 
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="flex items-center space-x-2"
              >
                <div className="text-right">
                  <p className="text-xs text-gray-500">Scene</p>
                  <p className="font-semibold">Forest Adventure</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pixar-purple to-pixar-blue flex items-center justify-center text-white">
                  <FileText className="h-5 w-5" />
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Trusted By Section with animation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="mt-20 text-center"
        >
          <p className="text-gray-500 mb-6">Trusted by storytellers and creators worldwide</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-70">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="h-8"
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/1920px-Netflix_2015_logo.svg.png" 
                alt="Netflix" className="h-full grayscale hover:grayscale-0 transition-all duration-300" />
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="h-8"
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Pixar_logo.svg/1200px-Pixar_logo.svg.png" 
                alt="Pixar" className="h-full grayscale hover:grayscale-0 transition-all duration-300" />
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="h-8"
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Pixar_Animation_Studios.svg/440px-Pixar_Animation_Studios.svg.png" 
                alt="Pixar Animation" className="h-full grayscale hover:grayscale-0 transition-all duration-300" />
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="h-8"
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/AMD_Logo.svg/1200px-AMD_Logo.svg.png" 
                alt="AMD" className="h-full grayscale hover:grayscale-0 transition-all duration-300" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
