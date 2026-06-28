import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import AISection from "../components/landing/AISection";
import ProblemShowcase from "../components/landing/ProblemShowcase";
import Stats from "../components/landing/Stats";
import CTA from "../components/landing/CTA";
import Footer from "../components/landing/Footer";

function LandingPage() {
  return (
    <div className="bg-background text-white overflow-x-hidden">

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#7c3aed20,transparent_50%)]" />

      <Navbar />

      <Hero />

      <Features />

      <AISection />

      <ProblemShowcase />

      <CTA />

      <Footer />

    </div>
  );
}

export default LandingPage;