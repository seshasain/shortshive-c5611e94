
import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Workflow from '../components/Workflow';
import Footer from '../components/Footer';
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Hero />
      <Features />
      <Workflow />
      
      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-br from-pixar-blue to-pixar-teal text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Create Your Pixar-Quality Animation?
          </h2>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto opacity-90">
            Join thousands of creators who are bringing their stories to life with our AI-powered animation platform.
          </p>
          <Button className="bg-white text-pixar-blue hover:bg-gray-100 pixar-button text-lg">
            Get Started For Free
          </Button>
          <p className="mt-4 opacity-80">No credit card required</p>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
