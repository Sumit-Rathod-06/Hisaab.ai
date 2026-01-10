import React, { useState } from 'react';
import { PlusCircle, MinusCircle } from 'lucide-react';

const faqs = [
  {
    question: "What is Hisaab.ai and how does it work?",
    answer: "Hisaab.ai is an AI-powered personal finance assistant that helps you manage your money smarter. Upload your bank statements (PDF, CSV, Excel), and our multi-agent AI system automatically categorizes transactions, analyzes spending patterns, tracks investments, and provides personalized financial insights."
  },
  {
    question: "How does the AI analyze my financial data?",
    answer: "We use specialized AI agents that work together: the Expense Analyzer tracks spending patterns, the Investment Advisor monitors your portfolio, and the Goal Tracker helps you achieve financial milestones. Our ML models use pattern recognition and anomaly detection to provide accurate, context-aware recommendations."
  },
  {
    question: "Is my financial data secure?",
    answer: "Absolutely. We use bank-level security with JWT authentication, bcrypt encryption, and secure data protocols. Your data is encrypted at rest and in transit, and we never share your information with third parties. We comply with industry-standard security practices."
  },
  {
    question: "What file formats can I upload?",
    answer: "You can upload bank statements and investment documents in PDF, CSV, Excel formats, and even scanned images. Our OCR technology automatically extracts transaction data and intelligently categorizes it, saving you hours of manual entry."
  },
  {
    question: "How does goal tracking work?",
    answer: "Set your financial goals (savings, travel, home purchase, etc.) and our Goal Tracker Agent monitors your progress, calculates required contributions, analyzes feasibility, and provides timeline adjustments. You'll get alerts when you're off track and actionable advice to stay on course."
  },
  {
    question: "Can I track multiple investment portfolios?",
    answer: "Yes! Our Investment Advisor Agent tracks multiple portfolios, analyzes performance, assesses risk, provides diversification recommendations, and calculates ROI. You'll get insights on portfolio rebalancing and opportunities to optimize your investments."
  }
];

const FAQSection = () => {
  // Use null if you want all items closed by default, or 0 to keep the first open
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-semibold text-slate-900 mb-4">
            Frequently asked questions
          </h2>
          <p className="text-lg text-slate-600">
            Everything you need to know about the product and billing.
          </p>
        </div>

        {/* Accordion List */}
        <div className="divide-y divide-slate-200">
          {faqs.map((faq, index) => (
            <div key={index} className="py-6">
              <button
                onClick={() => toggleAccordion(index)}
                className="flex w-full items-start justify-between text-left focus:outline-none"
              >
                <span className="text-lg font-medium text-slate-900">
                  {faq.question}
                </span>
                <span className="ml-6 shrink-0 text-slate-400">
                  {activeIndex === index ? (
                    <MinusCircle className="w-6 h-6" />
                  ) : (
                    <PlusCircle className="w-6 h-6" />
                  )}
                </span>
              </button>

              {/* Animated Answer Container */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${activeIndex === index ? 'max-h-40 opacity-100 mt-3' : 'max-h-0 opacity-0'
                  }`}
              >
                <p className="text-slate-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;