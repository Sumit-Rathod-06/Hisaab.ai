import React, { useState } from 'react';
import { PlusCircle, MinusCircle } from 'lucide-react';

const faqs = [
  {
    question: "Is there a free trial available?",
    answer: "Yes, you can try us for free for 30 days. If you want, we'll provide you with a free, personalized 30-minute onboarding call to get you up and running as soon as possible."
  },
  {
    question: "Can I change my plan later?",
    answer: "Absolutely. You can upgrade or downgrade your plan at any time from your account settings. Changes will be reflected in your next billing cycle."
  },
  {
    question: "What is your cancellation policy?",
    answer: "You can cancel your subscription at any time. Once cancelled, you will retain access to your features until the end of your current billing period."
  },
  {
    question: "Can other info be added to an invoice?",
    answer: "Yes, you can add your company name, VAT number, and address to your invoices through the billing portal in your settings."
  },
  {
    question: "How does billing work?",
    answer: "We offer monthly and annual billing. Our secure payment system processes your subscription automatically at the start of each period."
  },
  {
    question: "How do I change my account email?",
    answer: "You can update your account email through the Profile section in your settings. You'll need to verify the new email address to complete the change."
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
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  activeIndex === index ? 'max-h-40 opacity-100 mt-3' : 'max-h-0 opacity-0'
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