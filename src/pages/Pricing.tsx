
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from "@/components/ui/button";
import { Check } from 'lucide-react';

const PricingTier = ({ 
  name, 
  price, 
  description, 
  features, 
  isPopular = false,
  ctaText = "Get Started" 
}: { 
  name: string; 
  price: string; 
  description: string; 
  features: string[]; 
  isPopular?: boolean;
  ctaText?: string;
}) => {
  return (
    <div className={`rounded-2xl p-8 ${isPopular ? 'bg-gradient-to-br from-pixar-blue to-pixar-teal text-white transform scale-105 shadow-xl' : 'bg-white shadow-lg border border-gray-100'}`}>
      {isPopular && (
        <div className="mb-4">
          <span className="px-4 py-1 bg-white/20 text-white text-sm font-medium rounded-full">
            Most Popular
          </span>
        </div>
      )}
      
      <h3 className="text-2xl font-bold mb-2">{name}</h3>
      <div className="mb-4">
        <span className="text-4xl font-bold">{price}</span>
        {price !== 'Custom' && <span className="text-gray-500 dark:text-gray-400">/month</span>}
      </div>
      
      <p className={`mb-8 ${isPopular ? 'text-white/90' : 'text-gray-600'}`}>
        {description}
      </p>
      
      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check className={`mr-3 h-5 w-5 mt-0.5 ${isPopular ? 'text-white' : 'text-pixar-green'}`} />
            <span className={isPopular ? 'text-white/90' : 'text-gray-600'}>{feature}</span>
          </li>
        ))}
      </ul>
      
      <Button 
        className={`w-full ${isPopular ? 'bg-white text-pixar-blue hover:bg-gray-100' : 'primary-button'}`}
      >
        {ctaText}
      </Button>
    </div>
  );
};

const Pricing = () => {
  const pricingPlans = [
    {
      name: "Starter",
      price: "$29",
      description: "Perfect for beginners and small projects.",
      features: [
        "3 animations per month",
        "720p resolution exports",
        "10 character templates",
        "Basic voice options",
        "Email support"
      ],
      isPopular: false
    },
    {
      name: "Pro",
      price: "$79",
      description: "For professionals and growing businesses.",
      features: [
        "15 animations per month",
        "1080p resolution exports",
        "Full character library",
        "Advanced voice customization",
        "Priority support",
        "Commercial rights",
        "Custom subtitles"
      ],
      isPopular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large organizations with specific needs.",
      features: [
        "Unlimited animations",
        "4K resolution exports",
        "Custom character creation",
        "Advanced scene editing",
        "API access",
        "Dedicated account manager",
        "Custom branding",
        "Team collaboration tools"
      ],
      isPopular: false,
      ctaText: "Contact Sales"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <div className="container-custom py-16">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 pixar-text-gradient">Simple, Transparent Pricing</h1>
            <p className="text-xl text-gray-600">
              Choose the plan that's right for your creative journey. No hidden fees.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan) => (
              <PricingTier 
                key={plan.name}
                name={plan.name}
                price={plan.price}
                description={plan.description}
                features={plan.features}
                isPopular={plan.isPopular}
                ctaText={plan.ctaText}
              />
            ))}
          </div>
          
          <div className="mt-20 bg-gray-50 rounded-2xl p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {[
                {
                  q: "Can I switch plans later?",
                  a: "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle."
                },
                {
                  q: "Do you offer a free trial?",
                  a: "Yes! You can try PixarifyAI with our 7-day free trial. No credit card required."
                },
                {
                  q: "What payment methods do you accept?",
                  a: "We accept all major credit cards, PayPal, and for Enterprise plans, we can arrange invoicing."
                },
                {
                  q: "Can I cancel my subscription?",
                  a: "Yes, you can cancel your subscription at any time without any cancellation fees."
                }
              ].map((faq, index) => (
                <div key={index}>
                  <h3 className="font-bold text-lg mb-2">{faq.q}</h3>
                  <p className="text-gray-600">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Pricing;
