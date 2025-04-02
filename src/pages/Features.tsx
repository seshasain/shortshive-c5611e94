
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Features = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <div className="container-custom py-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 pixar-text-gradient">Features</h1>
          <p className="text-xl text-gray-700 mb-10">
            Discover all the powerful features that PixarifyAI has to offer.
          </p>
          
          <div className="bg-white rounded-xl shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4">This page is under construction</h2>
            <p className="text-gray-600">
              We're currently building this page. Please check back soon for more information about our features.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Features;
