import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    icon: "💰",
    title: "Cashback Guarantee",
    description: "Full Training Fee Refund After 6 Months of Employment",
    gradient: "bg-white",
  },
  {
    icon: "🚀",
    title: "Job Placement",
    description: "Get Hired in 2.5 Months | Salaries Up to LKR 250,000/month",
    gradient: "bg-white",
  },
  {
    icon: "🛠️",
    title: "Premium Tools Access",
    description: "Canva, CapCut, AI Tools & 15+ Digital Resources",
    gradient: "bg-white",
  },
];

export default function FeatureCards() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-dark-bg">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className={`border-none shadow-lg overflow-hidden transition-transform duration-300 hover:-translate-y-2 ${feature.gradient} text-black`}>
              <CardHeader>
                <div className="text-3xl mb-2 glow-effect">{feature.icon}</div>
                <CardTitle className="text-xl font-bold">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-black/60 font-semibold">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
