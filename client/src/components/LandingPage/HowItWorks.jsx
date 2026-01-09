import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react'; // Optional: install lucide-react or use SVGs
import step1Image from '../../assets/step1Image.jpg';
import step2Image from '../../assets/step2Image.jpg';
import step3Image from '../../assets/step3Image.jpg';
import step4Image from '../../assets/step4Image.jpg';
const steps = [
  {
    number: "1",
    title: "Add Your Data",
    description: "Connect your financial ecosystem in seconds. Our secure integration allows you to sync accounts without the manual hassle of spreadsheets.",
    features: ["Secure Bank Syncing", "Manual Expense Logging", "Asset Portfolio Tracking"],
    image: step1Image,
    color: "bg-green-100 text-green-600"
  },
  {
    number: "2",
    title: "AI Analysis",
    description: "Our proprietary AI models scan your spending habits and market trends to find hidden leakages and growth opportunities you might miss.",
    features: ["Pattern Recognition", "Risk Assessment", "Spending Optimization"],
    image: step2Image,
    color: "bg-blue-100 text-blue-600"
  },
  {
    number: "3",
    title: "Context Building",
    description: "We don't just look at numbers in isolation. We map your data against your life goals, current inflation, and personalized risk tolerance.",
    features: ["Goal-Based Mapping", "Market Contextualization", "Holistic Wealth View"],
    image: step3Image,
    color: "bg-orange-100 text-orange-600"
  },
  {
    number: "4",
    title: "Get Recommendations",
    description: "Receive a clear, step-by-step roadmap. From debt repayment strategies to high-yield investment picks, everything is tailored to you.",
    features: ["Daily Action Items", "Long-term Projections", "Automated Rebalancing"],
    image: step4Image,
    color: "bg-teal-100 text-teal-600"
  }
];

const HowItWorks = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    setCurrentStep((prev) => (prev === steps.length - 1 ? 0 : prev + 1));
  };

  const prevStep = () => {
    setCurrentStep((prev) => (prev === 0 ? steps.length - 1 : prev - 1));
  };

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
          <p className="text-lg text-slate-600">Simple, intelligent, and automated financial planning in four easy steps</p>
        </div>

        {/* Slideshow Container */}
        <div className="relative bg-slate-50 rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100">
          <div className="flex flex-col md:flex-row items-center gap-12">
            
            {/* Left Side: Content */}
            <div className="w-full md:w-1/2 space-y-6">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full font-bold text-xl ${steps[currentStep].color}`}>
                {steps[currentStep].number}
              </div>
              <h3 className="text-3xl font-bold text-slate-800">
                {steps[currentStep].title}
              </h3>
              <p className="text-xl text-slate-600 leading-relaxed">
                {steps[currentStep].description}
              </p>
              
              {/* Desktop Nav Buttons (Positioned below text) */}
              <div className="flex gap-4 pt-4">
                <button 
                  onClick={prevStep}
                  className="p-3 rounded-full border border-slate-300 hover:bg-white hover:shadow-md transition-all"
                >
                  <ChevronLeft size={24} />
                </button>
                <button 
                  onClick={nextStep}
                  className="p-3 rounded-full border border-slate-300 hover:bg-white hover:shadow-md transition-all"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>

            {/* Right Side: Image */}
            <div className="w-full md:w-1/2">
              <div className="rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 transform">
                <img 
                  src={steps[currentStep].image} 
                  alt={steps[currentStep].title}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>

          {/* Step Indicators (Dots) */}
          <div className="flex justify-center gap-2 mt-8">
            {steps.map((_, index) => (
              <div 
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${index === currentStep ? 'w-8 bg-slate-800' : 'w-2 bg-slate-300'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;