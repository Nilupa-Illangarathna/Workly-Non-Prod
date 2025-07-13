"use client";

import CertificationSection from "@/components/landing/certification-section";
import ContactFooter from "@/components/landing/contact-footer";
import CourseOverview from "@/components/landing/course-overview";
import CurriculumBreakdown from "@/components/landing/curriculum-breakdown";
import FaqSection from "@/components/landing/faq-section";
import FeatureCards from "@/components/landing/feature-cards";
import FinalCta from "@/components/landing/final-cta";
import HeroSection from "@/components/landing/hero-section";
import JobOpportunities from "@/components/landing/job-opportunities";
import PricingSection from "@/components/landing/pricing-section";
import { ThemeToggler } from "@/components/theme-toggle";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { useEffect, useRef } from "react";
import ThemedLogoLink from "@/components/themed-logo-link";

export default function Home() {
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > screen.height * 0.8) {
        headerRef.current?.classList.add("!bg-background");
      } else {
        headerRef.current?.classList.remove("!bg-background");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="min-h-screen bg-zinc-500">
      <div
        ref={headerRef}
        className="w-full fixed h-24 top-0 left-0 z-50 flex items-center justify-between transition-colors duration-300 px-10">
        <ThemedLogoLink href="/" />
        <div className="flex items-center gap-x-4">
          <Link
            href={"/login"}
            className={buttonVariants({ variant: "outline" })}>
            Login
          </Link>
          <Link
            href={"/register"}
            className={buttonVariants({ variant: "outline" })}>
            Register Now
          </Link>

          <ThemeToggler />
        </div>
      </div>
      <HeroSection />
      <FeatureCards />
      <CourseOverview />
      <JobOpportunities />
      <CurriculumBreakdown />
      <CertificationSection />
      <PricingSection />
      <FaqSection />
      <FinalCta />
      <ContactFooter />
    </main>
  );
}
