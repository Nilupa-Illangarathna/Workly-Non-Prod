import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Imashi Bandara",
    role: "Digital Marketing Specialist",
    company: "Global Tech Solutions",
    image: "/placeholder.svg?height=100&width=100",
    quote:
      "After completing Workly's program, I secured a remote position paying LKR 200,000 monthly. The practical skills and job placement support made all the difference.",
    salary: "LKR 200,000/m",
  },
  {
    name: "Dimuth Perera",
    role: "Facebook Ads Specialist",
    company: "E-commerce Brand",
    image: "/placeholder.svg?height=100&width=100",
    quote:
      "I started with zero marketing knowledge. Within 3 months after training, I was managing multiple client accounts and earning more than I ever did at my corporate job.",
    salary: "LKR 150,000/m",
  },
  {
    name: "Tharushi Silva",
    role: "Digital Marketing Assistant",
    company: "US Marketing Agency",
    image: "/placeholder.svg?height=100&width=100",
    quote:
      "The training was hands-on and practical. I learned exactly what employers are looking for, and now I work fully remotely for a US-based company.",
    salary: "LKR 85,000/m",
  },
];

export default function CertificationSection() {
  return (
    <section
      id="success-stories"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-landing-bg">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row gap-12">
          <div className="md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
              Certification & Success Stories
            </h2>

            <p className="text-lg text-muted-foreground mb-6">
              Upon successful completion of the program, you&apos;ll receive an
              industry-recognized certification that validates your digital
              marketing expertise.
            </p>

            <div className="bg-background rounded-lg shadow-lg p-6 mb-8 border-t-4 border-highlight-yellow">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold text-foreground">
                    Certificate of Achievement
                  </h3>
                  <p className="text-muted-foreground">
                    Expert Digital Marketing
                  </p>
                </div>
                <div className="bg-highlight-yellow h-16 w-16 rounded-full flex items-center justify-center text-background">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
              </div>

              <div className="border-t border-dashed pt-4">
                <p className="text-sm text-muted-foreground/80">Issued by:</p>
                <p className="font-medium">Gainro Global Group (PVT) Ltd</p>
              </div>
            </div>

            <div className="bg-primary/10 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4 text-foreground">
                Certification Benefits
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-primary mr-2 mt-1"
                    viewBox="0 0 20 20"
                    fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Internationally recognized qualification</span>
                </li>
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-primary mr-2 mt-1"
                    viewBox="0 0 20 20"
                    fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Preferred candidate status with partner companies</span>
                </li>
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-primary mr-2 mt-1"
                    viewBox="0 0 20 20"
                    fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Ongoing professional development opportunities</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="md:w-1/2">
            <h3 className="text-2xl font-bold mb-6 text-foreground">
              Success Stories
            </h3>

            <div className="space-y-6">
              {testimonials.map((testimonial, index) => (
                <Card
                  key={index}
                  className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12 border-2 border-primary">
                        <AvatarImage
                          src={testimonial.image}
                          alt={testimonial.name}
                        />
                        <AvatarFallback>
                          {testimonial.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <p className="font-bold text-foreground">
                        {testimonial.name}
                      </p>
                      <div className="ml-auto text-right">
                        <span className="bg-primary/10 text-primary font-medium px-3 py-1 rounded-full text-sm">
                          {testimonial.salary}
                        </span>
                      </div>
                    </div>
                    <p className="mt-4 text-muted-foreground">
                      {testimonial.quote}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* add a video about lms comment */}
          </div>
        </div>
      </div>
    </section>
  );
}
