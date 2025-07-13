"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How Soon Can I Start Earning?",
    answer:
      "Most students secure job placements within 2-3 weeks after completing the 2.5 month training program. Our dedicated job placement team works to match you with suitable employers as soon as you complete your certification.",
  },
  {
    question: "Is the Cashback Guarantee Legally Binding?",
    answer:
      "Yes, the cashback guarantee is included in our enrollment agreement and is legally binding. The full training fee (advance payment) is refunded after 6 months of continuous employment through our placement program, providing you've met the minimum attendance requirements.",
  },
  {
    question: "What If I Don't Get a Job?",
    answer:
      "Our placement success rate is over 95%. In the rare event we cannot place you within 3 months of certification, we offer extended training at no cost and continue working to find suitable employment. We're committed to your success.",
  },
  {
    question: "What Skills Do I Need to Start the Training?",
    answer:
      "No prior marketing experience is required. Basic computer literacy and fluency in English are sufficient to begin the program. We've designed our curriculum to take you from beginner to job-ready professional.",
  },
  {
    question: "How Much Time Should I Commit Weekly?",
    answer:
      "The program requires approximately 8-10 hours per week, including online sessions and practical assignments. Classes are scheduled with flexibility to accommodate those who are working or studying.",
  },
  {
    question: "Are There Any Hidden Costs?",
    answer:
      "No, the LKR 17,500 advance payment covers all training materials, software access, and job placement services. There are no additional or hidden fees throughout the program.",
  },
];

export default function FaqSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-landing-bg">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get answers to common questions about our training program
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="font-medium hover:text-primary">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-700">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Still have questions? Contact our support team for more information.
          </p>
          <div className="inline-flex items-center justify-center space-x-2 text-primary font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <span>info@workly.cloud</span>
          </div>
        </div>
      </div>
    </section>
  );
}
