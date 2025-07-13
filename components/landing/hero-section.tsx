import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative py-20 md:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="w-full h-full absolute inset-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover">
          <source src="/hero_sec_video.webm" type="video/webm" />
          <source src="/hero_sec_video.mp4" type="video/mp4" />
        </video>
        <div className="w-full h-full absolute top-0 left-0 bg-black/50 backdrop-blur-sm backdrop-brightness-75"></div>
      </div>
      <div className="container mx-auto max-w-6xl relative z-10 mt-12">
        <div className="flex flex-col items-center text-center mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-8 text-white leading-16 uppercase tracking-wide">
            Sri Lanka&apos;s First Comprehensive Training Program Guaranteeing
            High-Paying Remote Jobs
          </h1>
          <div className="flex flex-col items-center text-lg sm:text-xl md:text-2xl mb-8 max-w-3xl text-white/70 font-semibold">
            <h1>
              Unlock Global Opportunities: Earn{" "}
              <span className="text-highlight-yellow/90">
                60,000 - 250,000 LKR/Month
              </span>{" "}
              with Digital Marketing Expertise
            </h1>
          </div>
          <div className="flex flex-col sm:flex-row gap-8 text">
            <Button size="lg" className="" asChild>
              <Link href="/register">Start Free Training →</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="bg-white text-zinc-800 hover:bg-white/90"
              asChild>
              <Link href="#success-stories">Watch Success Stories →</Link>
            </Button>
          </div>
        </div>
        <div className="mt-8 flex justify-center">
          <div className="p-3 rounded-lg bg-black/50 text-background backdrop-blur-sm inline-flex items-center gap-x-2">
            <div className="bg-highlight-yellow/20 p-2 rounded-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-highlight-yellow"
                viewBox="0 0 20 20"
                fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <span className="text-sm font-medium text-highlight-yellow/70">
              Next batch starting soon -{" "}
              <span className="font-bold">Limited Spots Available!</span>
            </span>
          </div>
        </div>
      </div>

      {/* Background decorative elements */}
      <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-accentGreen/10 rounded-full blur-3xl"></div>
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-highlight-yellow/10 rounded-full blur-3xl"></div>
    </section>
  );
}
