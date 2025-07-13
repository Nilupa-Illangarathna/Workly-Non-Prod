"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const modules = [
  {
    id: "module-1",
    title: "Digital Marketing Fundamentals",
    description:
      "Introduction to digital marketing landscape, key metrics, and analytics tools.",
    gradient: "card-gradient-1",
  },
  {
    id: "module-2",
    title: "Facebook Marketing Mastery",
    description:
      "Create high-converting Facebook ads, optimize campaigns, and leverage Facebook Business Manager.",
    gradient: "card-gradient-3",
  },
  {
    id: "module-3",
    title: "YouTube & Video Marketing",
    description:
      "Produce engaging video content, optimize for YouTube SEO, and create effective ad campaigns.",
    gradient: "card-gradient-4",
  },
  {
    id: "module-4",
    title: "TikTok & Instagram Marketing",
    description:
      "Build viral content strategy and leverage short-form video for maximum engagement.",
    gradient: "card-gradient-6",
  },
  {
    id: "module-5",
    title: "Google Search & Display Ads",
    description:
      "Master Google Ads platform, create search and display campaigns, and optimize for conversions.",
    gradient: "card-gradient-5",
  },
  {
    id: "module-6",
    title: "SEO & Content Marketing",
    description:
      "Implement on-page and off-page SEO strategies to boost organic traffic and conversions.",
    gradient: "card-gradient-2",
  },
  {
    id: "module-7",
    title: "Email Marketing & Automation",
    description:
      "Build effective email funnels, create automated sequences, and optimize open rates.",
    gradient: "card-gradient-1",
  },
  {
    id: "module-8",
    title: "Canva & CapCut Mastery",
    description:
      "Create professional graphics and videos without design experience using essential tools.",
    gradient: "card-gradient-3",
  },
  {
    id: "module-9",
    title: "AI Tools for Marketing",
    description:
      "Leverage ChatGPT, DALL-E, and other AI tools to scale content production and marketing efficiency.",
    gradient: "card-gradient-4",
  },
];

export default function CurriculumBreakdown() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-landing-bg">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            15 Modules. Zero Fluff.
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our curriculum is designed for practical skill development with
            immediate application
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-[var(--primary)]/5 to-[var(--primary)]/20 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-[var(--highlight-yellow)]/20 rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-[var(--highlight-yellow)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2 text-foreground">
              Social Media Marketing
            </h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Facebook & Instagram Ads</li>
              <li>• TikTok Marketing</li>
              <li>• YouTube & Video Strategy</li>
              <li>• Social Media Management</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-[var(--secondary)]/5 to-[var(--secondary)]/20 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-[var(--primary)]/20 rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-[var(--primary)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2 text-foreground">
              Search & Advertising
            </h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• SEO Fundamentals</li>
              <li>• Google Search Ads</li>
              <li>• Display Advertising</li>
              <li>• Analytics & Reporting</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-[var(--highlight-yellow)]/5 to-[var(--highlight-yellow)]/20 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-[var(--highlight-yellow)]/20 rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-[var(--highlight-yellow)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2 text-foreground">
              Tools & Execution
            </h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Canva Design Mastery</li>
              <li>• CapCut Video Editing</li>
              <li>• AI Marketing Tools</li>
              <li>• Automation Workflows</li>
            </ul>
          </div>
        </div>

        <div className="bg-background rounded-lg p-8">
          <h3 className="text-2xl font-bold mb-6 text-foreground">
            Detailed Module Breakdown
          </h3>

          <Accordion type="single" collapsible className="w-full">
            {modules.map((module) => (
              <AccordionItem key={module.id} value={module.id}>
                <AccordionTrigger className="font-medium text-foreground hover:text-[var(--primary)]">
                  <div className="flex items-center">
                    <span
                      className={`bg-secondary w-3 h-3 rounded-full mr-3`}></span>
                    {module.title}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {module.description}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
