import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Film, Play, Video, Users, Wand2, Sparkles } from 'lucide-react';
import { useTheme } from '@/lib/theme';

const FeatureCard = ({ icon, title, description, theme }: { 
  icon: React.ReactNode, 
  title: string, 
  description: string,
  theme: 'light' | 'dark' 
}) => (
  <motion.div 
    whileHover={{ y: -5, boxShadow: '0 10px 30px -15px rgba(0,0,0,0.15)' }}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true }}
    className={`feature-card group ${
      theme === 'dark' 
        ? 'bg-gray-800 border-gray-700 hover:shadow-gray-900/40' 
        : 'bg-white border-gray-100 hover:shadow-gray-200/70'
    }`}
  >
    <div className="mb-4 w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-pixar-blue/10 to-pixar-teal/10 group-hover:from-pixar-blue/20 group-hover:to-pixar-teal/20 transition-colors">
      {icon}
    </div>
    <h3 className={`text-xl font-bold mb-2 ${
      theme === 'dark' ? 'text-white' : 'text-gray-900'
    }`}>{title}</h3>
    <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>{description}</p>
  </motion.div>
);

const Features = () => {
  const { theme } = useTheme();
  
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
    <section className={`py-20 relative overflow-hidden ${
      theme === 'dark'
        ? 'bg-gradient-to-b from-gray-900 to-gray-800'
        : 'bg-gradient-to-b from-white to-blue-50'
    }`}>
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
            <div className={`inline-block mb-4 px-4 py-2 rounded-full shadow-sm backdrop-blur-sm ${
              theme === 'dark' 
                ? 'bg-gray-800/80' 
                : 'bg-white/80'
            }`}>
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-pixar-orange" />
                <span className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                }`}>Powerful Animation Tools</span>
              </div>
            </div>
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4 relative">
            <span className="pixar-text-gradient">Powerful Animation Tools</span>
            <span className={theme === 'dark' ? ' text-white' : ''}> at Your Fingertips</span>
            <motion.div
              className="absolute -bottom-2 left-0 right-0 mx-auto w-36 h-1 bg-gradient-to-r from-pixar-blue via-pixar-purple to-pixar-blue rounded-full"
              initial={{ width: 0, opacity: 0 }}
              whileInView={{ width: 100, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
            />
          </h2>
          <p className={`text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
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
            theme={theme}
          />
          
          <FeatureCard 
            icon={<Video className="h-7 w-7 text-pixar-orange" />}
            title="Consistent Characters"
            description="Create and customize characters that maintain their look and personality throughout your animation."
            theme={theme}
          />
          
          <FeatureCard 
            icon={<Camera className="h-7 w-7 text-pixar-purple" />}
            title="Pixar-Level Quality"
            description="Enjoy high-quality 3D animations that rival professional studio productions."
            theme={theme}
          />
          
          <FeatureCard 
            icon={<Play className="h-7 w-7 text-pixar-teal" />}
            title="Voiceover & Subtitles"
            description="Add professional voiceovers and subtitles in multiple languages with just a few clicks."
            theme={theme}
          />
        </motion.div>
        
        {/* Large Feature Showcase */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          viewport={{ once: true }}
          className={`mt-20 rounded-3xl p-8 md:p-12 relative overflow-hidden ${
            theme === 'dark'
              ? 'bg-gradient-to-r from-gray-800/80 to-gray-800/50'
              : 'bg-gradient-to-r from-pixar-purple/5 to-pixar-yellow/5'
          }`}
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
              <h3 className={`text-2xl md:text-3xl font-bold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Bring Your Stories to Life</h3>
              <p className={`mb-6 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
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
                    className={`flex items-start ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}
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
                  className={`rounded-lg overflow-hidden shadow-xl ${
                    theme === 'dark' ? 'border border-gray-700' : ''
                  }`}
                >
                  <img 
                    src="https://images.unsplash.com/photo-1627163439134-7a8c47e08208?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80" 
                    alt="Animation Interface" 
                    className="w-full rounded-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-pixar-blue/20 to-transparent mix-blend-overlay"></div>
                </motion.div>
                
                {/* Floating UI elements */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  viewport={{ once: true }}
                  className={`absolute -bottom-5 -left-5 p-3 rounded-lg shadow-lg ${
                    theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-pixar-blue/20 flex items-center justify-center">
                      <Users className="h-4 w-4 text-pixar-blue" />
                    </div>
                    <div>
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Characters</p>
                      <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>5 Selected</p>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1 }}
                  viewport={{ once: true }}
                  className={`absolute -top-5 -right-5 p-3 rounded-lg shadow-lg ${
                    theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div>
                      <p className={`text-xs text-right ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>AI Magic</p>
                      <p className={`text-sm font-semibold text-right ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>Enhanced</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-pixar-purple/20 flex items-center justify-center">
                      <Wand2 className="h-4 w-4 text-pixar-purple" />
                    </div>
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
