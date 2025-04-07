import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Zap, Shield, Clock, Star, Video, Music, Palette, Users, BarChart, Crown, CheckCircle2, ArrowRight } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const features = {
  common: [
    "AI Story Generation",
    "Basic Transitions",
    "Standard Text-to-Speech",
    "Basic Aspect Ratios (16:9)",
    "Progress Tracking",
    "Preview Before Export",
  ],
  basic: [
    "Up to 8 Scenes per Story",
    "High-Quality Images",
    "Basic Character Consistency",
    "No Watermarks",
    "HD Video Export (1080p)",
    "Premium Text-to-Speech Voices",
    "5 Video Generations per Month",
    "Advanced Transitions",
    "Custom Aspect Ratios",
    "Background Music Options",
  ],
  pro: [
    "Up to 15 Scenes per Story",
    "Ultra-High Quality Images",
    "Advanced Character Consistency",
    "15 Video Generations per Month",
    "Advanced Transitions and Effects",
    "Background Music Library",
    "Priority Generation",
    "Multiple Export Formats",
  ],
  business: [
    "Up to 25 Scenes per Story",
    "Perfect Character Consistency™",
    "Character Customization",
    "30 Video Generations per Month",
    "Custom Branding",
    "Advanced Video Effects",
    "Priority Support",
    "Team Collaboration Features",
    "Analytics Dashboard",
  ],
};

const tiers = [
  {
    name: "Free Trial",
    price: "$0",
    description: "Includes character consistency (Limited quality)",
    features: [
      "Up to 3 Scenes per Story",
      "All Visual Styles",
      "Basic Quality Images",
      "Character Consistency (Limited Quality)",
      "Video Export with Watermark (720p)",
      "Standard Text-to-Speech",
      "Basic Transitions",
      "Limited to 1 Successful Video Generation",
      "7-Day Trial Period",
      "Basic Aspect Ratios (16:9 only)",
    ],
    cta: "Start Free Trial",
    popular: false,
    highlight: false,
    icon: Sparkles,
    consistencyLevel: "Limited"
  },
  {
    name: "Basic",
    price: "$19.99",
    period: "/month",
    description: "Includes character consistency (Basic quality)",
    features: [...features.common, ...features.basic.map(feature => 
      feature === "Basic Character Consistency" ? "Character Consistency (Basic Quality)" : feature
    )],
    cta: "Get Started",
    popular: false,
    highlight: false,
    icon: Zap,
    consistencyLevel: "Basic"
  },
  {
    name: "Pro",
    price: "$49.99",
    period: "/month",
    description: "Includes character consistency (Advanced quality)",
    features: [...features.common, ...features.basic.map(feature => 
      feature === "Basic Character Consistency" ? "Character Consistency (Advanced Quality)" : feature
    ), ...features.pro.filter(feature => feature !== "Advanced Character Consistency")],
    cta: "Go Pro",
    popular: true,
    highlight: true,
    icon: Shield,
    consistencyLevel: "Advanced"
  },
  {
    name: "Business",
    price: "$99.99",
    period: "/month",
    description: "Includes character consistency (Perfect quality)",
    features: [...features.common, ...features.basic.map(feature => 
      feature === "Basic Character Consistency" ? "Character Consistency (Perfect Quality)" : feature
    ), ...features.pro.filter(feature => feature !== "Advanced Character Consistency"), ...features.business.filter(feature => feature !== "Perfect Character Consistency™")],
    cta: "Contact Sales",
    popular: false,
    highlight: false,
    icon: Clock,
    consistencyLevel: "Perfect"
  },
];

const consistencyFeatures = {
  "Limited": {
    title: "Limited Character Consistency",
    description: "All characters maintain consistency - expect good appearance matching between scenes with some minor variations in details.",
    color: "from-gray-400 to-gray-500"
  },
  "Basic": {
    title: "Basic Character Consistency",
    description: "Improved character consistency with better appearance matching and minimal variations between different scenes.",
    color: "from-blue-400 to-blue-500"
  },
  "Advanced": {
    title: "Advanced Character Consistency",
    description: "High-quality character consistency with excellent matching of appearance, expressions, and movements across all scenes.",
    color: "from-pixar-purple to-pixar-blue"
  },
  "Perfect": {
    title: "Perfect Character Consistency™",
    description: "Our premium technology ensures characters are pixel-perfect identical in every scene, angle, and interaction - our most advanced offering.",
    color: "from-pixar-blue to-pixar-teal"
  }
};

const Pricing = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Helmet>
        <title>Pricing - Character Consistency Technology | ShortsHive</title>
        <meta name="description" content="Choose the perfect plan with our exclusive character consistency technology. Create professional animations with characters that maintain their exact appearance across all scenes." />
        <meta name="keywords" content="animation pricing, character consistency, AI animation, animation plans, video creation pricing" />
        <meta property="og:title" content="ShortsHive Pricing - Character Consistency Technology" />
        <meta property="og:description" content="Choose the perfect plan with our exclusive character consistency technology. Create professional animations with characters that maintain their exact appearance across all scenes." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://shortshive.com/pricing" />
      </Helmet>
      
      <Navbar />
      
      <main className="flex-grow">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-pixar-blue/5 to-transparent dark:from-pixar-blue/10"></div>
          <div className="container mx-auto px-4 py-24 relative">
            <div className="text-center max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-block mb-6"
              >
                <span className="bg-pixar-purple/10 text-pixar-purple px-4 py-2 rounded-full text-sm font-medium">
                  Exclusive Technology
                </span>
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight"
              >
                Perfect
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pixar-purple to-pixar-blue">
                  {" "}Character Consistency
                </span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto"
              >
                ALL plans include our character consistency technology - the main difference is the QUALITY level of consistency
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-12"
              >
                <Link to="/features">
                  <Button variant="outline" className="bg-white/80 dark:bg-gray-800/80 border-pixar-purple/30 text-pixar-purple hover:bg-pixar-purple/5 hover:border-pixar-purple text-lg px-8 py-3 rounded-full backdrop-blur-sm">
                    Learn More About Character Consistency
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap justify-center gap-6"
              >
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm">
                  <Check className="h-5 w-5 text-pixar-blue" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm">
                  <Check className="h-5 w-5 text-pixar-blue" />
                  <span>7-day free trial</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm">
                  <Check className="h-5 w-5 text-pixar-blue" />
                  <span>Cancel anytime</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
              Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-pixar-purple to-pixar-blue">Plan</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              ALL plans include our character consistency technology - higher tiers offer better quality
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {tiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <Card className={cn(
                  "relative p-8 h-full transition-all duration-300 hover:shadow-xl",
                  tier.highlight 
                    ? 'border-2 border-pixar-blue dark:border-pixar-blue/50 shadow-lg scale-105 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-pixar-blue/30 bg-white dark:bg-gray-800'
                )}>
                  {tier.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-pixar-blue to-pixar-teal text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg flex items-center gap-2">
                        <Star className="h-4 w-4" />
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-8">
                    <tier.icon className="h-12 w-12 mx-auto mb-4 text-pixar-blue" />
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {tier.name}
                    </h3>
                    <div className="flex items-center justify-center mb-4">
                      <span className="text-4xl font-bold text-gray-900 dark:text-white">
                        {tier.price}
                      </span>
                      {tier.period && (
                        <span className="text-gray-600 dark:text-gray-400 ml-2">
                          {tier.period}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">
                      {tier.description}
                    </p>
                  </div>
                  
                  <div className="mb-6 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Users className="h-5 w-5 text-pixar-purple mr-2" />
                      <span className="font-semibold text-gray-900 dark:text-white">Character Consistency:</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      {consistencyFeatures[tier.consistencyLevel].title}
                    </p>
                  </div>

                  <div className="space-y-4 mb-8">
                    {tier.features.map((feature) => (
                      <div key={feature} className="flex items-center">
                        <Check className={`h-5 w-5 mr-2 flex-shrink-0 ${
                          feature.includes("Character Consistency") || feature.includes("Perfect Character") 
                            ? "text-pixar-purple" 
                            : "text-pixar-blue"
                        }`} />
                        <span className={`text-gray-700 dark:text-gray-300 ${
                          feature.includes("Character Consistency") || feature.includes("Perfect Character")
                            ? "font-medium" 
                            : ""
                        }`}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    className={cn(
                      "w-full transition-all duration-300",
                      tier.highlight 
                        ? 'bg-gradient-to-r from-pixar-blue to-pixar-teal hover:from-pixar-blue/90 hover:to-pixar-teal/90 text-lg py-6 text-white' 
                        : 'bg-gray-900 hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100'
                    )}
                  >
                    {tier.cta}
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[
              { 
                icon: Users, 
                title: "Character Consistency", 
                description: "ALL plans include character consistency at different quality levels", 
                highlight: true 
              },
              { 
                icon: Video, 
                title: "High-Quality Videos", 
                description: "Create stunning 1080p videos" 
              },
              { 
                icon: Music, 
                title: "Premium Audio", 
                description: "Professional voice and music" 
              },
              { 
                icon: Palette, 
                title: "Visual Styles", 
                description: "Multiple creative options" 
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`text-center p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 ${
                  feature.highlight 
                    ? 'bg-gradient-to-b from-white to-purple-50/30 dark:from-gray-800 dark:to-gray-900 border border-pixar-purple/30' 
                    : 'bg-white dark:bg-gray-800'
                }`}
              >
                <feature.icon className={`h-12 w-12 mx-auto mb-4 ${feature.highlight ? 'text-pixar-purple' : 'text-pixar-blue'}`} />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mb-16 mt-24">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
              Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-pixar-purple to-pixar-blue">Character Consistency</span> Level
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Every single plan includes our character consistency technology - you're just paying for better quality
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {Object.entries(consistencyFeatures).map(([level, feature], index) => (
              <motion.div
                key={level}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 flex flex-col h-full"
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6`}>
                  {level === "Perfect" ? (
                    <Crown className="h-8 w-8 text-white" />
                  ) : level === "Advanced" ? (
                    <Shield className="h-8 w-8 text-white" />
                  ) : level === "Basic" ? (
                    <CheckCircle2 className="h-8 w-8 text-white" />
                  ) : (
                    <Check className="h-8 w-8 text-white" />
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 flex-grow">
                  {feature.description}
                </p>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Available in: 
                  <span className="ml-1 font-bold text-pixar-blue">
                    {tiers.filter(tier => tier.consistencyLevel === level).map(tier => tier.name).join(', ')}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-24 bg-white dark:bg-gray-800 rounded-2xl p-12 shadow-lg container mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {[
              {
                q: "Does every plan include character consistency?",
                a: "Yes! Every plan, including our free trial, includes our exclusive character consistency technology. Higher tiers offer progressively better quality, with our Business plan delivering perfect character consistency across all scenes."
              },
              {
                q: "What is Character Consistency and why is it important?",
                a: "Character Consistency is our exclusive technology that ensures your characters maintain identical appearance, personality, and style across all scenes. It's crucial for creating professional animations that don't break viewer immersion when characters change between scenes."
              },
              {
                q: "What's included in the free trial?",
                a: "The free trial includes access to all basic features with limited character consistency, up to 3 scenes per story and 1 successful video generation. It's perfect for experiencing our platform's capabilities."
              },
              {
                q: "How does your Character Consistency technology compare to competitors?",
                a: "While competitors' characters change appearance between scenes, our technology ensures characters remain consistent across scenes. Even our free tier offers better consistency than competitors, with our premium tiers providing increasingly perfect matching."
              }
            ].map((faq, index) => (
              <motion.div
                key={faq.q}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-4 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {faq.q}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {faq.a}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-24 text-center bg-gradient-to-r from-pixar-purple to-pixar-blue rounded-2xl p-12 text-white relative overflow-hidden container mx-auto mb-20">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <div className="relative">
            <h2 className="text-3xl font-bold mb-6">
              Every Plan Includes Character Consistency
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              ALL plans include character consistency - the difference is just in quality level. Start your free trial today!
            </p>
            <Button className="bg-white text-pixar-purple hover:bg-gray-100 text-lg px-8 py-6 shadow-lg">
              Start Free Trial
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Pricing;
