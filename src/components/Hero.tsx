
import React from 'react';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { Play, ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-teal-50 pt-16 pb-20 md:pt-24 md:pb-28">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[10%] left-[5%] w-32 h-32 rounded-full bg-pixar-yellow/20 animate-float"></div>
        <div className="absolute top-[20%] right-[15%] w-24 h-24 rounded-full bg-pixar-purple/20 animate-bounce-slow delay-700"></div>
        <div className="absolute bottom-[15%] left-[15%] w-40 h-40 rounded-full bg-pixar-teal/20 animate-pulse-slow"></div>
      </div>
      
      <div className="container-custom relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6">
              <span className="pixar-text-gradient">Create Pixar-Level</span> 
              <br />Short Animations Instantly
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
              Transform your stories into stunning animated shorts with consistent characters, voiceovers, and subtitles.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button className="primary-button text-lg group">
                Create Your Animation
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button variant="outline" className="text-lg flex items-center">
                <Play className="mr-2 h-5 w-5 text-pixar-orange" />
                Watch Examples
              </Button>
            </div>
          </div>
          
          {/* Right Animation Preview */}
          <div className="flex-1 relative">
            <div className="w-full aspect-video relative z-10 rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
              <div className="absolute inset-0 bg-gradient-to-br from-pixar-blue to-pixar-teal opacity-75"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Play className="h-20 w-20 text-white opacity-90" />
              </div>
              <img 
                src="https://images.unsplash.com/photo-1636622433525-127afdf3662d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2532&q=80" 
                alt="Animation Preview" 
                className="w-full h-full object-cover opacity-60"
              />
            </div>
            
            {/* Floating interface elements */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-3 z-20 border border-gray-100 animate-float">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full bg-pixar-red flex items-center justify-center text-white font-bold">A</div>
                <div className="text-left">
                  <p className="text-xs text-gray-500">Character</p>
                  <p className="font-semibold">Adventure Amy</p>
                </div>
              </div>
            </div>
            
            <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-3 z-20 border border-gray-100 animate-bounce-slow">
              <div className="flex items-center space-x-2">
                <div className="text-right">
                  <p className="text-xs text-gray-500">Voice</p>
                  <p className="font-semibold">English (US)</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-pixar-green flex items-center justify-center text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Trusted By Section */}
        <div className="mt-20 text-center">
          <p className="text-gray-500 mb-6">Trusted by storytellers and creators worldwide</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-70">
            <div className="h-8">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/1920px-Netflix_2015_logo.svg.png" 
                alt="Netflix" className="h-full grayscale" />
            </div>
            <div className="h-8">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Pixar_logo.svg/1200px-Pixar_logo.svg.png" 
                alt="Pixar" className="h-full grayscale" />
            </div>
            <div className="h-8">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Pixar_Animation_Studios.svg/440px-Pixar_Animation_Studios.svg.png" 
                alt="Pixar Animation" className="h-full grayscale" />
            </div>
            <div className="h-8">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/AMD_Logo.svg/1200px-AMD_Logo.svg.png" 
                alt="AMD" className="h-full grayscale" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
