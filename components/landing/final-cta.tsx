"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function FinalCta() {
  // Set expiration time to 3 days from now
  const targetDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 3);
    return date;
  }, []);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        clearInterval(interval);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-landing-bg/90">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Don&apos;t Miss Your Chance –{" "}
            <span className="text-highlight-yellow">23 Spots Left!</span>
          </h2>

          <p className="text-xl mb-8">
            Join hundreds of successful graduates who transformed their careers
            with Workly&apos;s digital marketing training.
          </p>

          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-4xl font-bold text-highlight-yellow">
                {timeLeft.days}
              </div>
              <div className="text-sm opacity-80">Days</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-4xl font-bold text-highlight-yellow">
                {timeLeft.hours}
              </div>
              <div className="text-sm opacity-80">Hours</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-4xl font-bold text-highlight-yellow">
                {timeLeft.minutes}
              </div>
              <div className="text-sm opacity-80">Minutes</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-4xl font-bold text-highlight-yellow">
                {timeLeft.seconds}
              </div>
              <div className="text-sm opacity-80">Seconds</div>
            </div>
          </div>

          <div className="max-w-md mx-auto">
            <Button
              size="lg"
              className="w-full bg-highlight-yellow hover:bg-highlight-yellow/90 text-zinc-800"
              asChild>
              <Link href="/register">Start Your Career Transformation</Link>
            </Button>
            <p className="mt-4 text-sm opacity-90">
              Next batch starts soon. Limited spots available.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
