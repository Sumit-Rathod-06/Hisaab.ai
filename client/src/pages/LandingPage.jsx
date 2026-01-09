import HeroSection from "../components/LandingPage/HeroSection.jsx";
import HowItWorks from "../components/LandingPage/HowItWorks.jsx";
import FAQSection from "../components/LandingPage/FAQSection.jsx";
import Footer from "../components/LandingPage/Footer.jsx";
import OurSolution from "../components/LandingPage/Solution.jsx";
import Audience from "../components/LandingPage/Audience.jsx";
import TestimonialsMarquee from "../components/LandingPage/review.jsx";


const LandingPage = () => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <HeroSection />

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
