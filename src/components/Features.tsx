
import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Film, Play, Video, Users, Wand2, Sparkles } from 'lucide-react';

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <motion.div 
    whileHover={{ y: -5, boxShadow: '0 10px 30px -15px rgba(0,0,0,0.15)' }}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true }}
    className="feature-card group"
  >
    <div className="mb-4 w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-pixar-blue/10 to-pixar-teal/10 group-hover:from-pixar-blue/20 group-hover:to-pixar-teal/20 transition-colors">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);

const Features = () => {
  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  return (
    <section className="py-20 bg-gradient-to-b from-white to-blue-50 relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div 
        animate={{ 
          y: [0, -15, 0],
          opacity: [0.1, 0.2, 0.1]
        }} 
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-10 w-72 h-72 rounded-full bg-pixar-purple/10 blur-3xl"
      />
      <motion.div 
        animate={{ 
          y: [0, 15, 0],
          opacity: [0.1, 0.15, 0.1]
        }} 
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-pixar-blue/10 blur-3xl"
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
            <div className="inline-block mb-4 px-4 py-2 rounded-full bg-white/80 shadow-sm backdrop-blur-sm">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-pixar-orange" />
                <span className="text-sm font-medium text-gray-800">Powerful Animation Tools</span>
              </div>
            </div>
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4 relative">
            <span className="pixar-text-gradient">Powerful Animation Tools</span>
            <span> at Your Fingertips</span>
            <motion.div
              className="absolute -bottom-2 left-0 right-0 mx-auto w-36 h-1 bg-gradient-to-r from-pixar-blue via-pixar-purple to-pixar-blue rounded-full"
              initial={{ width: 0, opacity: 0 }}
              whileInView={{ width: 100, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
            />
          </h2>
          <p className="text-xl text-gray-600">
            Our platform combines AI storytelling with Pixar-level animation to help you create professional animations in minutes, not months.
          </p>
        </motion.div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          <FeatureCard 
            icon={<Film className="h-7 w-7 text-pixar-blue" />}
            title="AI Story Generation"
            description="Generate compelling stories with our AI, complete with engaging plots and characters."
          />
          
          <FeatureCard 
            icon={<Video className="h-7 w-7 text-pixar-orange" />}
            title="Consistent Characters"
            description="Create and customize characters that maintain their look and personality throughout your animation."
          />
          
          <FeatureCard 
            icon={<Camera className="h-7 w-7 text-pixar-purple" />}
            title="Pixar-Level Quality"
            description="Enjoy high-quality 3D animations that rival professional studio productions."
          />
          
          <FeatureCard 
            icon={<Play className="h-7 w-7 text-pixar-teal" />}
            title="Voiceover & Subtitles"
            description="Add professional voiceovers and subtitles in multiple languages with just a few clicks."
          />
        </motion.div>
        
        {/* Large Feature Showcase */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-20 bg-gradient-to-r from-pixar-purple/5 to-pixar-yellow/5 rounded-3xl p-8 md:p-12 relative overflow-hidden"
        >
          {/* Animated accent elements */}
          <motion.div 
            className="absolute w-20 h-20 rounded-full bg-pixar-blue/10 -top-10 -left-10 blur-xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute w-16 h-16 rounded-full bg-pixar-orange/10 -bottom-8 right-20 blur-xl"
            animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
          
          <div className="flex flex-col lg:flex-row items-center gap-10 relative z-10">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="flex-1"
            >
              <h3 className="text-2xl md:text-3xl font-bold mb-4">Bring Your Stories to Life</h3>
              <p className="text-gray-600 mb-6">
                From concept to completion in minutes. Write your story or use our AI to generate one, then watch as our platform transforms it into a stunning animated short film.
              </p>
              
              <motion.ul 
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="space-y-3"
              >
                {[
                  "Write or generate your story",
                  "Choose and customize characters",
                  "Add voiceovers and sound effects",
                  "Export in multiple formats",
                  "Share with the world"
                ].map((item, index) => (
                  <motion.li 
                    key={index} 
                    className="flex items-start"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="mr-3 mt-1 h-5 w-5 rounded-full bg-pixar-green/20 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-pixar-green" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>{item}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
              className="flex-1"
            >
              <div className="relative">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="rounded-2xl overflow-hidden shadow-xl border-4 border-white"
                >
                  <img 
                    src="https://images.unsplash.com/photo-1630855214759-4bed28d2e847?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2532&q=80" 
                    alt="Animation Process" 
                    className="w-full"
                  />
                </motion.div>
                
                {/* Floating progress indicator */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="absolute -bottom-6 right-8 bg-white rounded-xl shadow-lg p-4 z-20 border border-gray-100"
                >
                  <div className="flex items-center space-x-3">
                    <div className="h-2 w-2 rounded-full bg-pixar-green"></div>
                    <div className="w-40 bg-gray-200 rounded-full h-2.5">
                      <motion.div 
                        initial={{ width: "0%" }}
                        animate={{ width: "75%" }}
                        transition={{ duration: 1.5, delay: 1 }}
                        className="bg-pixar-green h-2.5 rounded-full"
                      />
                    </div>
                    <span className="text-sm font-medium">75%</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
