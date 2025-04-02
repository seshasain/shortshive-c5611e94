import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink } from 'lucide-react';

const Footer = () => {
  // Function to handle navigation safely
  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    window.location.href = path;
  };

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
    visible: { opacity: 1, y: 0 }
  };

  return (
    <footer className="bg-gray-50 pt-16 pb-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          animate={{ 
            y: [0, -15, 0],
            opacity: [0.03, 0.05, 0.03]
          }} 
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-20 w-96 h-96 rounded-full bg-pixar-blue blur-3xl"
        />
        <motion.div 
          animate={{ 
            y: [0, 15, 0],
            opacity: [0.03, 0.05, 0.03]
          }} 
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-pixar-purple blur-3xl"
        />
      </div>

      <div className="container-custom relative z-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12"
        >
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-2"
          >
            <Link to="/" className="flex items-center space-x-2 mb-4 group">
              <motion.div
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="h-10 w-10 rounded-full bg-gradient-to-r from-pixar-blue to-pixar-teal flex items-center justify-center"
              >
                <span className="text-white font-bold text-xl">P</span>
              </motion.div>
              <span className="font-bold text-2xl pixar-text-gradient">PixarifyAI</span>
            </Link>
            <p className="text-gray-600 mb-6 max-w-md">
              Transform your stories into stunning Pixar-quality animations with our AI-powered platform. Create, customize, and share in minutes.
            </p>
            <div className="flex space-x-4">
              {['facebook', 'twitter', 'instagram', 'youtube'].map((social, index) => (
                <motion.a 
                  key={social} 
                  href={`https://${social}.com`}
                  whileHover={{ y: -3, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-pixar-blue hover:text-white transition-colors"
                >
                  <span className="sr-only">{social}</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10zm-10 6a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
                  </svg>
                </motion.a>
              ))}
            </div>
          </motion.div>
          
          <FooterColumn 
            title="Product"
            items={['Features', 'Pricing', 'Examples', 'Templates', 'Character Library']}
            variants={itemVariants}
          />
          
          <FooterColumn 
            title="Resources"
            items={['Documentation', 'Tutorials', 'Blog', 'Community', 'API']}
            variants={itemVariants}
          />
          
          <FooterColumn 
            title="Company"
            items={['About', 'Careers', 'Contact', 'Legal', 'Press']}
            variants={itemVariants}
          />
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center"
        >
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} PixarifyAI. All rights reserved.
          </p>
          <div className="flex space-x-6">
            {['Terms of Service', 'Privacy Policy', 'Cookie Policy'].map((item, index) => (
              <motion.a 
                key={item}
                href={`/${item.toLowerCase().replace(/\s+/g, '-')}`} 
                onClick={(e) => handleNavigation(e, `/${item.toLowerCase().replace(/\s+/g, '-')}`)}
                className="text-gray-500 text-sm hover:text-pixar-blue transition-colors relative group"
                whileHover={{ x: 2 }}
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pixar-blue transition-all duration-300 group-hover:w-full"></span>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

// Helper component for footer columns
const FooterColumn = ({ title, items, variants }: { 
  title: string, 
  items: string[],
  variants: any
}) => (
  <motion.div variants={variants}>
    <h3 className="font-bold text-lg mb-4 relative inline-block">
      {title}
      <motion.div
        className="absolute -bottom-1 left-0 h-0.5 w-0 bg-pixar-blue"
        whileInView={{ width: '100%' }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: 0.2 }}
      />
    </h3>
    <ul className="space-y-3">
      {items.map((item, index) => (
        <motion.li 
          key={item}
          variants={variants}
          custom={index}
          whileHover={{ x: 3 }}
        >
          <a 
            href={`/${item.toLowerCase()}`} 
            onClick={(e) => e.preventDefault()}
            className="text-gray-600 hover:text-pixar-blue transition-colors flex items-center group"
          >
            <span>{item}</span>
            <motion.span
              initial={{ opacity: 0, x: -5 }}
              whileHover={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="ml-1"
            >
              <ArrowRight className="h-3 w-3 text-pixar-blue opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.span>
          </a>
        </motion.li>
      ))}
    </ul>
  </motion.div>
);

export default Footer;
