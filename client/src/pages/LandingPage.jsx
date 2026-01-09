import HeroSection from "../components/LandingPage/HeroSection.jsx";
import FeaturesSection from "../components/LandingPage/FeaturesSection.jsx";
import HowItWorks from "../components/LandingPage/HowItWorks.jsx";
import FAQSection from "../components/LandingPage/FAQSection.jsx";
import Footer from "../components/LandingPage/Footer.jsx";
import Navbar from "../components/NavBar.jsx";

const LandingPage = () => {
  return (
    <div className="w-full">
      <Navbar />
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section with Scroll Animation */}
      <FeaturesSection />

      {/* Future sections */}
      {/* <Features /> */}
      <HowItWorks />
      {/* <AIAgents /> */}
      {/* <Pricing /> */}
      <FAQSection />
      <Footer />
    </div>
  );
};

export default LandingPage;
