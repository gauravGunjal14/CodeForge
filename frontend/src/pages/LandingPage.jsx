import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import AISection from "../components/landing/AISection";
import ProblemShowcase from "../components/landing/ProblemShowcase";
import Footer from "../components/landing/Footer";

function LandingPage() {
  return (
    <div className="bg-background text-white overflow-x-hidden pt-20">
      <div className="absolute right-0 top-1/2 pointer-events-none w-125 h-125 bg-primary/20 blur-[140px] rounded-full "/>
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,#7c3aed20,transparent_50%)]" />

      <Navbar />

      <Hero />

      <Features />

      <AISection />

      <ProblemShowcase />

      <Footer />

    </div>
  );
}

export default LandingPage;