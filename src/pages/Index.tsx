import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Workflow from '../components/Workflow';
import Footer from '../components/Footer';
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Star, PlayCircle, CheckCircle2, Users, Video, BookOpen, Trophy } from 'lucide-react';

const Index = () => {
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

  return (
    <div className="min-h-screen flex flex-col">
      {/* SEO Optimization */}
      <Helmet>
        <title>ShortsHive - AI Animation with Perfect Character Consistency | Transform Stories to Videos</title>
        <meta name="description" content="Transform your stories into stunning animated videos with ShortsHive. Our AI-powered platform ensures perfect character consistency throughout your animation - a feature unique to our platform." />
        <meta name="keywords" content="character consistency, AI animation, story to video, animation platform, Pixar-style animation, AI storytelling" />
        <meta property="og:title" content="ShortsHive - AI Animation with Perfect Character Consistency" />
        <meta property="og:description" content="Transform your stories into stunning animated videos with perfect character consistency throughout your animation - a feature unique to our platform." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://shortshive.com" />
        <meta property="og:image" content="https://shortshive.com/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ShortsHive - AI Animation with Perfect Character Consistency" />
        <meta name="twitter:description" content="Transform your stories into stunning animated videos with perfect character consistency throughout your animation - a feature unique to our platform." />
        <meta name="twitter:image" content="https://shortshive.com/twitter-image.jpg" />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "ShortsHive",
              "applicationCategory": "MultimediaApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "description": "AI-powered platform for creating high-quality animated videos with perfect character consistency"
            }
          `}
        </script>
      </Helmet>

      <Navbar />
      <Hero />
      <Features />
      
      {/* Character Consistency Showcase - NEW */}
      <section className="py-24 bg-white dark:bg-gray-900 overflow-hidden relative">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern"></div>
        </div>
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex-1"
            >
              <div className="inline-block mb-6 px-4 py-2 rounded-full bg-pixar-purple/10 text-pixar-purple">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span className="text-sm font-medium">Exclusive Feature</span>
                </div>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white leading-tight">
                Perfect <span className="text-transparent bg-clip-text bg-gradient-to-r from-pixar-purple to-pixar-blue">Character Consistency</span> Across All Scenes
              </h2>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
                <strong>Our biggest advantage</strong> that no competitor offers: characters that maintain their exact appearance, personality, and style throughout your entire animation.
              </p>
              
              <ul className="space-y-4 mb-8">
                {[
                  "Characters look identical in every scene and angle",
                  "Consistent personality traits and expressions",
                  "Maintain proper scale and proportions throughout",
                  "Same voice and mannerisms in every interaction"
                ].map((point, index) => (
                  <motion.li 
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    viewport={{ once: true }}
                    className="flex items-start text-gray-700 dark:text-gray-200"
                  >
                    <CheckCircle2 className="h-6 w-6 text-pixar-purple mr-3 flex-shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </motion.li>
                ))}
              </ul>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <Link to="/features">
                  <Button className="bg-gradient-to-r from-pixar-purple to-pixar-blue hover:from-pixar-purple/90 hover:to-pixar-blue/90 text-white text-lg px-8 py-3 rounded-full group">
                    See How It Works
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex-1"
            >
              <div className="relative mt-10 lg:mt-0">
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
                  <div className="bg-gradient-to-r from-pixar-purple to-pixar-blue rounded-full h-12 w-12 flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Social Proof Section - UPDATED */}
      <section className="py-20 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-block mb-4 px-4 py-2 rounded-full bg-pixar-blue/10 text-pixar-blue">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span className="text-sm font-medium">Trusted by Thousands</span>
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-pixar-blue to-pixar-purple">Creative Revolution</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              See why creators, educators, and businesses love our perfect character consistency feature
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                avatar: "https://randomuser.me/api/portraits/women/44.jpg",
                name: "Sarah Johnson",
                role: "Content Creator",
                quote: "The character consistency is mind-blowing! My characters actually look the same in every scene - no other platform can do this. It's a game-changer for storytelling.",
                rating: 5
              },
              {
                avatar: "https://randomuser.me/api/portraits/men/32.jpg",
                name: "David Chen",
                role: "Education Specialist",
                quote: "My students connect with animated characters that maintain their identity across lessons. The consistency creates trust and engagement that other platforms can't match.",
                rating: 5
              },
              {
                avatar: "https://randomuser.me/api/portraits/women/68.jpg",
                name: "Maya Patel",
                role: "Marketing Director",
                quote: "Our brand mascot stays perfectly consistent in every video we create with ShortsHive. This level of character consistency is exactly what we needed for brand recognition.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 relative"
              >
                <div className="flex items-center mb-4">
                  <div className="mr-4">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{testimonial.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300">"{testimonial.quote}"</p>
                <div className="absolute -bottom-3 -right-3 h-12 w-12 rounded-full bg-gradient-to-br from-pixar-purple to-pixar-blue opacity-30 blur-lg"></div>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 flex justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-full shadow-lg py-3 px-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center space-x-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <span className="text-gray-700 dark:text-gray-300">
                  <span className="font-bold">4.9/5</span> for <span className="font-bold">Character Consistency</span>
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section - ENHANCED */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-block mb-4 px-4 py-2 rounded-full bg-pixar-green/10 text-pixar-green">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-5 w-5" />
                <span className="text-sm font-medium">Simple Process</span>
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Create Professional Animations <span className="text-transparent bg-clip-text bg-gradient-to-r from-pixar-green to-pixar-teal">in 3 Simple Steps</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our intuitive platform makes animation creation easier than ever before
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connection lines */}
            <div className="hidden md:block absolute top-1/2 left-1/4 right-1/4 h-1 bg-gradient-to-r from-pixar-blue to-pixar-purple"></div>
            
            {[
              {
                icon: BookOpen,
                title: "1. Create Your Story",
                description: "Write your own story or use our AI to generate a compelling narrative with engaging characters and plot.",
                color: "text-pixar-blue"
              },
              {
                icon: Video,
                title: "2. Customize Your Animation",
                description: "Choose characters, scenes, and voiceovers. Adjust styles and settings to match your creative vision.",
                color: "text-pixar-purple"
              },
              {
                icon: PlayCircle,
                title: "3. Generate & Export",
                description: "Let our AI create your animation, then export in HD quality ready to share on any platform.",
                color: "text-pixar-teal"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 relative z-10"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-${step.color.split('-')[1]}-500/20 to-${step.color.split('-')[1]}-600/20 flex items-center justify-center mb-6`}>
                  <step.icon className={`h-8 w-8 ${step.color}`} />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
                <div className="absolute -top-2 -right-2 h-20 w-20 rounded-full bg-gradient-to-br from-pixar-blue/5 to-pixar-purple/5 blur-xl"></div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <Link to="/dashboard">
              <Button className="bg-gradient-to-r from-pixar-blue to-pixar-purple hover:from-pixar-blue/90 hover:to-pixar-purple/90 text-white text-lg px-8 py-6 rounded-full shadow-lg group">
                Start Creating Now
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
      
      {/* Benefits Grid - UPDATED */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-block mb-4 px-4 py-2 rounded-full bg-pixar-orange/10 text-pixar-orange">
              <div className="flex items-center space-x-2">
                <Trophy className="h-5 w-5" />
                <span className="text-sm font-medium">Why Choose ShortsHive</span>
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pixar-orange to-pixar-red">Benefits</span> That Set Us Apart
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Discover why ShortsHive is the only platform offering perfect character consistency
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              {
                title: "Perfect Character Consistency",
                description: "Our exclusive technology ensures characters maintain identical appearance and personality across all scenes - not available anywhere else.",
                icon: "👥",
                gradient: "from-purple-500/20 to-blue-600/20"
              },
              {
                title: "Time Efficiency",
                description: "Create animations in minutes instead of weeks or months with traditional methods.",
                icon: "⏱️",
                gradient: "from-blue-500/20 to-blue-600/20"
              },
              {
                title: "Cost Effective",
                description: "Save thousands on animation production with our affordable subscription plans.",
                icon: "💰",
                gradient: "from-green-500/20 to-green-600/20"
              },
              {
                title: "Professional Quality",
                description: "Achieve studio-level animation quality without specialized technical skills.",
                icon: "🏆",
                gradient: "from-purple-500/20 to-purple-600/20"
              },
              {
                title: "Easy to Use",
                description: "Intuitive interface designed for creators of all skill levels - no animation experience needed.",
                icon: "👌",
                gradient: "from-pink-500/20 to-pink-600/20"
              },
              {
                title: "Multiple Export Options",
                description: "Export in various formats optimized for social media, presentations, and more.",
                icon: "🚀",
                gradient: "from-red-500/20 to-red-600/20"
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${benefit.gradient} flex items-center justify-center mb-4 text-2xl`}>
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{benefit.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{benefit.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      <Workflow />
      
      {/* Call to Action Section - ENHANCED */}
      <section className="py-20 bg-gradient-to-br from-pixar-blue to-pixar-purple text-white relative overflow-hidden">
        {/* Enhanced background elements */}
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
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-block mb-6 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm"
          >
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-pixar-yellow" />
              <span className="text-sm font-medium">Start Creating Today</span>
            </div>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
          >
            Ready to Transform Your Stories into 
            <span className="block mt-2">Engaging Animations?</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto opacity-90"
          >
            Join thousands of creators who are bringing their stories to life with our AI-powered animation platform.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Link to="/dashboard">
                <Button className="bg-white text-pixar-blue hover:bg-gray-100 text-lg px-8 py-6 rounded-full shadow-lg group">
                  Get Started For Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
            <Link to="/features">
              <Button variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8 py-6 rounded-full">
                Explore Features
              </Button>
            </Link>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            viewport={{ once: true }}
            className="mt-6 opacity-80"
          >
            No credit card required • Free 7-day trial • Cancel anytime
          </motion.p>
          
          {/* Social proof */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="mt-12 flex justify-center items-center"
          >
            <div className="flex -space-x-2 mr-4">
              {[1, 2, 3, 4].map((i) => (
                <motion.div 
                  key={i}
                  initial={{ x: -10 * i, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.7 + (i * 0.1) }}
                  viewport={{ once: true }}
                  className="w-8 h-8 rounded-full border-2 border-white overflow-hidden"
                >
                  <img 
                    src={`https://randomuser.me/api/portraits/women/${i + 20}.jpg`} 
                    alt={`User ${i}`}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              ))}
            </div>
            <motion.div
              initial={{ x: 10, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center text-white/90">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-4 h-4 text-pixar-yellow fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                    </svg>
                  ))}
                </div>
                <div className="ml-2 text-sm">
                  from <span className="font-bold">1,000+</span> creators
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
