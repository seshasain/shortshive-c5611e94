
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from 'lucide-react';

const WorkflowStep = ({ number, title, description, isActive = false, delay = 0 }: { 
  number: number, 
  title: string, 
  description: string,
  isActive?: boolean,
  delay?: number
}) => (
  <motion.div 
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay: delay }}
    viewport={{ once: true }}
    className={`relative ${isActive ? 'scale-105' : ''} transition-transform duration-300`}
  >
    <div className={`absolute left-5 h-full w-0.5 bg-gray-200 ${number === 4 ? 'hidden' : ''}`}></div>
    <motion.div 
      whileHover={{ x: 5 }}
      className="relative flex items-start group"
    >
      <motion.div 
        whileHover={{ scale: 1.1 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
        className={`
          w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shrink-0 z-10
          ${isActive 
            ? 'bg-pixar-blue shadow-lg shadow-pixar-blue/30' 
            : 'bg-gray-300 group-hover:bg-pixar-purple transition-colors'}
        `}
      >
        {number}
      </motion.div>
      <div className="ml-5">
        <h3 className={`text-xl font-bold mb-2 ${isActive ? 'text-pixar-blue' : ''}`}>{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </motion.div>
  </motion.div>
);

const Workflow = () => {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div 
        animate={{ 
          y: [0, -15, 0],
          opacity: [0.1, 0.2, 0.1]
        }} 
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-40 right-10 w-80 h-80 rounded-full bg-pixar-teal/10 blur-3xl"
      />
      <motion.div 
        animate={{ 
          y: [0, 15, 0],
          opacity: [0.1, 0.15, 0.1]
        }} 
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-40 left-10 w-96 h-96 rounded-full bg-pixar-orange/10 blur-3xl"
      />
      
      <div className="container-custom relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="inline-block mb-4 px-4 py-2 rounded-full bg-white/80 shadow-sm backdrop-blur-sm border border-gray-100">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-pixar-purple" />
                <span className="text-sm font-medium text-gray-800">Create in Minutes, Not Months</span>
              </div>
            </div>
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4 relative">
            <span className="pixar-text-gradient">Simple 4-Step</span>
            <span> Animation Process</span>
            <motion.div
              className="absolute -bottom-2 left-0 right-0 mx-auto w-36 h-1 bg-gradient-to-r from-pixar-purple via-pixar-orange to-pixar-purple rounded-full"
              initial={{ width: 0, opacity: 0 }}
              whileInView={{ width: 100, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
            />
          </h2>
          <p className="text-xl text-gray-600">
            From story to finished animation in minutes, not months
          </p>
        </motion.div>
        
        <div className="max-w-4xl mx-auto">
          <div className="space-y-12 pl-4">
            <WorkflowStep 
              number={1} 
              title="Create Your Story" 
              description="Write your own story or use our AI to generate a compelling narrative for your animation."
              isActive={true}
              delay={0.1}
            />
            
            <WorkflowStep 
              number={2} 
              title="Customize Characters" 
              description="Select from our library of Pixar-style characters or customize your own with our easy-to-use tools."
              delay={0.2}
            />
            
            <WorkflowStep 
              number={3} 
              title="Generate Animation" 
              description="Our AI transforms your story into a professional 3D animation with consistent characters and scenes."
              delay={0.3}
            />
            
            <WorkflowStep 
              number={4} 
              title="Add Voice & Export" 
              description="Choose from professional voiceovers, add subtitles, and export your animation in multiple formats."
              delay={0.4}
            />
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Button className="secondary-button text-lg group relative overflow-hidden">
                <span className="relative z-10 flex items-center">
                  Start Creating Now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <motion.span 
                  className="absolute inset-0 bg-gradient-to-r from-pixar-orange to-pixar-darkorange opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ opacity: 0, x: -100 }}
                  whileHover={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Workflow;
