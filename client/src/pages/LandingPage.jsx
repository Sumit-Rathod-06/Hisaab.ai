import HeroSection from "../components/LandingPage/HeroSection.jsx";
import FeaturesSection from "../components/LandingPage/FeaturesSection.jsx";
import PagePreview from "../components/LandingPage/PagePreview.jsx";
import HowItWorks from "../components/LandingPage/HowItWorks.jsx";
import FAQSection from "../components/LandingPage/FAQSection.jsx";
import Footer from "../components/LandingPage/Footer.jsx";
import OurSolution from "../components/LandingPage/Solution.jsx";
import Audience from "../components/LandingPage/Audience.jsx";
import TestimonialsMarquee from "../components/LandingPage/review.jsx";

import Navbar from "../components/NavBar.jsx";

const LandingPage = () => {
  return (
    <div className="w-full">
      <Navbar />
      {/* Hero Section */}
      <HeroSection />

      {/* UI Preview (scroll-synced laptop) */}
      <PagePreview />

      {/* Features Section with Scroll Animation */}
      <FeaturesSection />

      {/* Future sections */}
      {/* <Features /> */}
      <HowItWorks />
      {/* <AIAgents /> */}
      {/* <Pricing /> */}
      <Audience />
      <OurSolution/>
      <FAQSection />
       <TestimonialsMarquee/>
      <Footer />
    </div>
  );
};

export default LandingPage;
