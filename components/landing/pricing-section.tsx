import { Button } from "@/components/ui/button";

export default function PricingSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-landing-bg">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Pricing & Payment
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Invest in your future with our affordable training program
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-secondary rounded-lg overflow-hidden shadow-xl">
          <div className="bg-foreground/10 p-8 text-center text-foreground">
            <div className="inline-block bg-[var(--highlight-yellow)]/20 rounded-full px-4 py-1 mb-4">
              <span className="text-[var(--highlight-yellow)] font-medium">
                Limited Time Offer
              </span>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Pay{" "}
              <span className="text-[var(--highlight-yellow)]">LKR 17,500</span>{" "}
              Today
            </h3>
            <p className="text-2xl mb-2 text-white">
              Get <span className="line-through opacity-75">LKR 60,000</span>{" "}
              Training FREE
            </p>
            <p className="text-lg opacity-90 mb-6 text-white">
              Complete refund after 6 months of employment
            </p>

            <Button
              size="lg"
              className="bg-[var(--highlight-yellow)] hover:bg-[var(--highlight-yellow)]/90 text-secondary font-semibold">
              Secure Your Spot Now →
            </Button>
          </div>

          <div className="bg-background p-8">
            <h4 className="text-xl font-bold mb-4 text-foreground">
              Cashback Guarantee Terms
            </h4>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-[var(--primary)] mr-2 mt-1"
                  viewBox="0 0 20 20"
                  fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>
                  Your advance payment is fully refundable after 6 months of
                  continuous employment
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-[var(--primary)] mr-2 mt-1"
                  viewBox="0 0 20 20"
                  fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>
                  Employment must be secured through our job placement program
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-[var(--primary)] mr-2 mt-1"
                  viewBox="0 0 20 20"
                  fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>
                  Training completion with minimum 85% attendance is required
                </span>
              </li>
            </ul>

            <div className="bg-landing-bg p-6 rounded-lg">
              <h4 className="text-xl font-bold mb-4 text-foreground">
                Payment Methods
              </h4>

              <div className="space-y-4">
                <div>
                  <p className="font-medium">Bank Transfer</p>
                  <div className="mt-2 flex items-center">
                    <div className="bg-blue-100 rounded p-2 mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-blue-700"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Sampath Bank
                      </p>
                      <p className="font-medium">Account: 0220 1000 1289</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="font-medium">Other Methods</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    We also accept online payments, cash deposits, and mobile
                    transfers. Contact us for details.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
