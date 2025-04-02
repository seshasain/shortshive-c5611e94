
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Examples = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <div className="container-custom py-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 pixar-text-gradient">Examples</h1>
          <p className="text-xl text-gray-700 mb-10">
            Check out these amazing animations created with PixarifyAI.
          </p>
          
          <div className="bg-white rounded-xl shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4">This page is under construction</h2>
            <p className="text-gray-600">
              We're currently building this page. Please check back soon to see examples of animations created with our platform.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Examples;
