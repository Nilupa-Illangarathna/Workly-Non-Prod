import { Button } from "@/components/ui/button";
import Link from "next/link";

const timelineSteps = [
  {
    title: "Registration",
    description: "Complete application & secure spot with advance payment",
    icon: "📝",
    gradient: "bg-primary",
  },
  {
    title: "Training",
    description: "30 hours intensive learning across 15 specialized modules",
    icon: "📚",
    gradient: "bg-primary",
  },
  {
    title: "Assessment",
    description: "Practical projects & certification evaluation",
    icon: "🧪",
    gradient: "bg-primary",
  },
  {
    title: "Job Placement",
    description: "Dedicated matching with global employers",
    icon: "💼",
    gradient: "bg-primary",
  },
];

export default function CourseOverview() {
  return (
    <section id="course" className="py-20 px-4 sm:px-6 lg:px-8 bg-landing-bg">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row gap-12">
          <div className="md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
              Master Digital Marketing in 2.5 Months
            </h2>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <div className="bg-primary/10 p-2 rounded-full mr-3 mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-primary"
                    viewBox="0 0 20 20"
                    fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-lg">
                    30-hour intensive training
                  </p>
                  <p className="text-muted-foreground">
                    15 comprehensive modules with hands-on practice
                  </p>
                </div>
              </li>
              <li className="flex items-center">
                <div className="bg-primary/10 p-2 rounded-full mr-3 mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-primary"
                    viewBox="0 0 20 20"
                    fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-lg">24/7 mentorship support</p>
                  <p className="text-muted-foreground">
                    Personalized guidance throughout your learning journey
                  </p>
                </div>
              </li>
              <li className="flex items-center">
                <div className="bg-highlight-yellow/20 p-2 rounded-full mr-3 mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-highlight-yellow"
                    viewBox="0 0 20 20"
                    fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M5 2a1 1 0 011 1v1h8V3a1 1 0 112 0v1h1a2 2 0 012 2v10a2 2 0 01-2 2H3a2 2 0 01-2-2V6a2 2 0 012-2h1V3a1 1 0 011-1zm0 5a1 1 0 011 1v1h8V8a1 1 0 112 0v1h1v2H3V9h1V8a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-lg text-highlight-yellow">
                    Free Training Worth LKR 60,000
                  </p>
                  <p className="text-muted-foreground">
                    Limited-time offer for early applicants
                  </p>
                </div>
              </li>
            </ul>

            <div className="bg-gradient-to-r from-secondary/5 to-primary/10 p-6 rounded-lg mb-8">
              <p className="text-lg font-medium mb-2">
                Secure Your Spot with{" "}
                <span className="font-bold text-primary">
                  LKR 17,500 Advance
                </span>
              </p>
              <p className="text-muted-foreground">
                Fully refundable after 6 months of continuous employment
              </p>
            </div>

            <Button
              size="lg"
              className="bg-highlight-yellow hover:bg-highlight-yellow/90 text-dark-bg font-bold"
              asChild>
              <Link href="/register">Start Free Training →</Link>
            </Button>
          </div>

          <div className="md:w-1/2">
            <div className="bg-accent p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-6 text-forground">
                Your Journey to Success
              </h3>

              <div className="space-y-8">
                {timelineSteps.map((step, index) => (
                  <div
                    key={index}
                    className="relative pl-14 timeline-item flex items-center gap-x-5">
                    <div
                      className={`absolute left-0 top-0 ${step.gradient} text-white w-10 h-10 rounded-full flex items-center justify-center`}>
                      {step.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{step.title}</h4>
                      <p className="text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
