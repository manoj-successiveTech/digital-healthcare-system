"use client";
import { Suspense, lazy, memo } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";

// 🚀 LAZY LOADING: Components are loaded only when needed, reducing initial bundle size
const FeaturesSection = lazy(() => import("../components/FeaturesSection"));
const ServicesSection = lazy(() => import("../components/ServicesSection"));
const StatsSection = lazy(() => import("../components/StatsSection"));
const TestimonialsSection = lazy(() =>
  import("../components/TestimonialsSection")
);
const CTASection = lazy(() => import("../components/CTASection"));

// 🧠 MEMOIZATION: Loading component to prevent unnecessary re-renders
const LoadingSpinner = memo(() => (
  <div className="flex items-center justify-center py-16">
    {/* Modern loading spinner with healthcare theme */}
    <div className="relative">
      {/* Outer ring */}
      <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin"></div>
      {/* Inner ring */}
      <div className="absolute top-2 left-2 w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      {/* Center dot */}
      <div className="absolute top-6 left-6 w-4 h-4 bg-blue-600 rounded-full animate-pulse"></div>
    </div>
    <div className="ml-4 text-blue-600 font-medium">
      Loading healthcare services...
    </div>
  </div>
));

// 🧠 MEMOIZATION: Section wrapper to prevent unnecessary re-renders
const SectionWrapper = memo(({ children, className = "" }) => (
  <section
    className={`transition-opacity duration-500 ease-in-out ${className}`}
  >
    {children}
  </section>
));

// 🧠 MEMOIZATION: Main Home component
const Home = memo(() => {
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      {/* 🎯 ABOVE THE FOLD: Critical components loaded immediately */}
      <Navbar />

      <main className="flex-1">
        {/* 🎯 HERO SECTION: Always visible, loaded immediately */}
        <SectionWrapper>
          <HeroSection />
        </SectionWrapper>

        {/* 🚀 LAZY LOADED SECTIONS: Load only when user scrolls down */}
        <Suspense fallback={<LoadingSpinner />}>
          <SectionWrapper className="fade-in">
            <FeaturesSection />
          </SectionWrapper>
        </Suspense>

        <Suspense fallback={<LoadingSpinner />}>
          <SectionWrapper className="fade-in">
            <ServicesSection />
          </SectionWrapper>
        </Suspense>

        <Suspense fallback={<LoadingSpinner />}>
          <SectionWrapper className="fade-in">
            <StatsSection />
          </SectionWrapper>
        </Suspense>

        <Suspense fallback={<LoadingSpinner />}>
          <SectionWrapper className="fade-in">
            <TestimonialsSection />
          </SectionWrapper>
        </Suspense>

        <Suspense fallback={<LoadingSpinner />}>
          <SectionWrapper className="fade-in">
            <CTASection />
          </SectionWrapper>
        </Suspense>
      </main>

      {/* 🎯 FOOTER: Critical component loaded immediately */}
      <Footer />
    </div>
  );
});

// 🧠 MEMOIZATION: Set display name for debugging
Home.displayName = "Home";
LoadingSpinner.displayName = "LoadingSpinner";
SectionWrapper.displayName = "SectionWrapper";

export default Home;
