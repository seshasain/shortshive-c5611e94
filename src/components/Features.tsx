
import React from 'react';
import { Camera, Film, Play, Video } from 'lucide-react';

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="feature-card group">
    <div className="mb-4 w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-pixar-blue/10 to-pixar-teal/10 group-hover:from-pixar-blue/20 group-hover:to-pixar-teal/20 transition-colors">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const Features = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-blue-50">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Powerful Animation Tools at Your Fingertips
          </h2>
          <p className="text-xl text-gray-600">
            Our platform combines AI storytelling with Pixar-level animation to help you create professional animations in minutes, not months.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
        </div>
        
        {/* Large Feature Showcase */}
        <div className="mt-20 bg-gradient-to-r from-pixar-purple/5 to-pixar-yellow/5 rounded-3xl p-8 md:p-12">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            <div className="flex-1">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">Bring Your Stories to Life</h3>
              <p className="text-gray-600 mb-6">
                From concept to completion in minutes. Write your story or use our AI to generate one, then watch as our platform transforms it into a stunning animated short film.
              </p>
              
              <ul className="space-y-3">
                {[
                  "Write or generate your story",
                  "Choose and customize characters",
                  "Add voiceovers and sound effects",
                  "Export in multiple formats",
                  "Share with the world"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="mr-3 mt-1 h-5 w-5 rounded-full bg-pixar-green/20 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-pixar-green" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex-1">
              <div className="relative">
                <div className="rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                  <img 
                    src="https://images.unsplash.com/photo-1630855214759-4bed28d2e847?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2532&q=80" 
                    alt="Animation Process" 
                    className="w-full"
                  />
                </div>
                
                {/* Floating progress indicator */}
                <div className="absolute -bottom-6 right-8 bg-white rounded-xl shadow-lg p-4 z-20 border border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="h-2 w-2 rounded-full bg-pixar-green"></div>
                    <div className="w-40 bg-gray-200 rounded-full h-2.5">
                      <div className="bg-pixar-green h-2.5 rounded-full w-[75%]"></div>
                    </div>
                    <span className="text-sm font-medium">75%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
