
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';

const WorkflowStep = ({ number, title, description, isActive = false }: { 
  number: number, 
  title: string, 
  description: string,
  isActive?: boolean 
}) => (
  <div className={`relative ${isActive ? 'scale-105' : ''} transition-transform duration-300`}>
    <div className={`absolute left-5 h-full w-0.5 bg-gray-200 ${number === 4 ? 'hidden' : ''}`}></div>
    <div className="relative flex items-start group">
      <div className={`
        w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shrink-0 z-10
        ${isActive 
          ? 'bg-pixar-blue shadow-lg shadow-pixar-blue/30' 
          : 'bg-gray-300 group-hover:bg-pixar-purple transition-colors'}
      `}>
        {number}
      </div>
      <div className="ml-5">
        <h3 className={`text-xl font-bold mb-2 ${isActive ? 'text-pixar-blue' : ''}`}>{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  </div>
);

const Workflow = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Simple 4-Step Animation Process
          </h2>
          <p className="text-xl text-gray-600">
            From story to finished animation in minutes, not months
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="space-y-12 pl-4">
            <WorkflowStep 
              number={1} 
              title="Create Your Story" 
              description="Write your own story or use our AI to generate a compelling narrative for your animation."
              isActive={true}
            />
            
            <WorkflowStep 
              number={2} 
              title="Customize Characters" 
              description="Select from our library of Pixar-style characters or customize your own with our easy-to-use tools."
            />
            
            <WorkflowStep 
              number={3} 
              title="Generate Animation" 
              description="Our AI transforms your story into a professional 3D animation with consistent characters and scenes."
            />
            
            <WorkflowStep 
              number={4} 
              title="Add Voice & Export" 
              description="Choose from professional voiceovers, add subtitles, and export your animation in multiple formats."
            />
          </div>
          
          <div className="mt-16 text-center">
            <Button className="secondary-button text-lg group">
              Start Creating Now
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Workflow;
