"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UsersRound, CreditCard, DollarSign, Briefcase } from "lucide-react";

interface StatCardData {
  title: string;
  totalValue: number | string;
  categorizedValues: Array<{ label: string; value: number | string }>;
}

interface StatCardsProps {
  partnersOverview: StatCardData;
  studentPaymentOverview: StatCardData;
  studentPaymentSummary: StatCardData;
  partnerEarningsWithdrawals: StatCardData;
}

const iconMapping: { [key: string]: React.ElementType } = {
  "Partners Overview": UsersRound,
  "Student Payment Overview": CreditCard,
  "Student Payment Summary": DollarSign,
  "Partner Earnings & Withdrawals": Briefcase,
};

const colorMapping: {
  [key: string]: { light: string; dark: string; icon: string };
} = {
  "Partners Overview": {
    light: "from-purple-600 to-indigo-600",
    dark: "dark:from-purple-700 dark:to-indigo-700",
    icon: "text-purple-200",
  },
  "Student Payment Overview": {
    light: "from-green-500 to-teal-500",
    dark: "dark:from-green-600 dark:to-teal-600",
    icon: "text-green-200",
  },
  "Student Payment Summary": {
    light: "from-yellow-500 to-amber-500",
    dark: "dark:from-yellow-600 dark:to-amber-600",
    icon: "text-yellow-100",
  },
  "Partner Earnings & Withdrawals": {
    light: "from-red-500 to-pink-500",
    dark: "dark:from-red-600 dark:to-pink-600",
    icon: "text-red-200",
  },
};

export function StatCards({
  partnersOverview,
  studentPaymentOverview,
  studentPaymentSummary,
  partnerEarningsWithdrawals,
}: StatCardsProps) {
  const statsData = [
    partnersOverview,
    studentPaymentOverview,
    studentPaymentSummary,
    partnerEarningsWithdrawals,
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat) => {
        const IconComponent = iconMapping[stat.title] || UsersRound; // Default icon
        const colors =
          colorMapping[stat.title] || colorMapping["Partners Overview"]; // Default colors

        return (
          <Card
            key={stat.title}
            className="relative overflow-hidden transition-all duration-300 hover:shadow-xl border-none group rounded-xl text-white">
            <div
              className={`absolute inset-0 bg-gradient-to-br ${colors.light} dark:${colors.dark}`}
            />
            <div className="absolute inset-0 bg-black/10" />{" "}
            {/* Slightly darker overlay for better text contrast */}
            <CardHeader className="relative flex flex-row items-start justify-between space-y-0">
              <CardTitle className="text-base font-semibold opacity-90">
                {stat.title}
              </CardTitle>
              <div className="p-3 rounded-lg bg-white/15 backdrop-blur-sm">
                <IconComponent className={`h-5 w-5 ${colors.icon}`} />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold mb-3">
                {typeof stat.totalValue === "number"
                  ? stat.totalValue.toLocaleString()
                  : stat.totalValue}
              </div>
              <div className="space-y-1.5">
                {stat.categorizedValues.map((item) => (
                  <div
                    key={item.label}
                    className="flex justify-between items-center text-sm opacity-80">
                    <span>{item.label}</span>
                    <span className="font-medium">
                      {typeof item.value === "number"
                        ? item.value.toLocaleString()
                        : item.value}
                    </span>
                  </div>
                ))}
              </div>
              <div className="absolute bottom-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-3xl transform translate-x-10 translate-y-10 group-hover:translate-x-8 group-hover:translate-y-8 transition-transform duration-300" />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
