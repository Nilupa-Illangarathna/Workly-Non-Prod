"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

export default function JobOpportunities() {
  const [hourlyRate, setHourlyRate] = useState([5]);
  const [hoursPerWeek, setHoursPerWeek] = useState([20]);

  const calculateMonthlyEarning = () => {
    return Math.round((hourlyRate[0] * hoursPerWeek[0] * 4) / 10) * 10;
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-landing-bg">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Digital Marketing Career Opportunities
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose the path that best suits your career goals and lifestyle
            preferences
          </p>
        </div>

        <Tabs defaultValue="salary" className="w-full">
          <TabsList className="w-full h-full flex flex-col md:flex-row mb-8">
            <TabsTrigger className="w-full" value="salary">
              Salary-Based Roles
            </TabsTrigger>
            <TabsTrigger className="w-full" value="hourly">
              Hourly Basis
            </TabsTrigger>
            <TabsTrigger className="w-full" value="revenue">
              Revenue Share Partner
            </TabsTrigger>
          </TabsList>

          <TabsContent value="salary">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="">
                  <CardTitle className="">
                    Digital Marketing Assistant
                  </CardTitle>
                  <CardDescription>Entry-level position</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-2xl font-bold text-primary mb-2">
                    LKR 60,000 - 80,000
                  </p>
                  <p className="text-muted-foreground mb-4">Monthly salary</p>

                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-primary mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Social media management</span>
                    </li>
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-primary mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Basic ad campaigns</span>
                    </li>
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-primary mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Content scheduling</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="">
                  <CardTitle className="">
                    Digital Marketing Specialist
                  </CardTitle>
                  <CardDescription>Mid-level position</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-2xl font-bold text-primary mb-2">
                    LKR 100,000 - 180,000
                  </p>
                  <p className="text-muted-foreground mb-4">Monthly salary</p>

                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-primary mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Campaign optimization</span>
                    </li>
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-primary mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Analytics & reporting</span>
                    </li>
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-primary mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Multi-platform strategy</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="">
                  <CardTitle className="">Digital Marketing Manager</CardTitle>
                  <CardDescription>Senior position</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-2xl font-bold text-primary mb-2">
                    LKR 190,000 - 250,000
                  </p>
                  <p className="text-muted-foreground mb-4">Monthly salary</p>

                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-primary mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Strategic planning</span>
                    </li>
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-primary mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Team management</span>
                    </li>
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-primary mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Budget optimization</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="hourly">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Hourly Tasks & Rates</CardTitle>
                  <CardDescription>Flexible work arrangements</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    <li className="flex justify-between items-center border-b pb-2">
                      <span>Ad posting & monitoring</span>
                      <span className="font-bold">$4-5/hour</span>
                    </li>
                    <li className="flex justify-between items-center border-b pb-2">
                      <span>Content creation & sharing</span>
                      <span className="font-bold">$5-6/hour</span>
                    </li>
                    <li className="flex justify-between items-center border-b pb-2">
                      <span>Basic SEO implementation</span>
                      <span className="font-bold">$5-6/hour</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span>Social media engagement</span>
                      <span className="font-bold">$4-5/hour</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Earnings Calculator</CardTitle>
                  <CardDescription>
                    Estimate your monthly income
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label className="font-medium">Hourly Rate (USD)</label>
                        <span className="font-bold">${hourlyRate[0]}</span>
                      </div>
                      <Slider
                        value={hourlyRate}
                        min={4}
                        max={6}
                        step={0.5}
                        onValueChange={setHourlyRate}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label className="font-medium">Hours per Week</label>
                        <span className="font-bold">
                          {hoursPerWeek[0]} hours
                        </span>
                      </div>
                      <Slider
                        value={hoursPerWeek}
                        min={10}
                        max={40}
                        step={5}
                        onValueChange={setHoursPerWeek}
                      />
                    </div>

                    <div className="bg-primary/10 p-4 rounded-lg text-center">
                      <p className="text-sm text-primary font-medium">
                        Estimated Monthly Earnings
                      </p>
                      <p className="text-3xl font-bold text-primary">
                        ${calculateMonthlyEarning()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Approx. LKR{" "}
                        {(calculateMonthlyEarning() * 320).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="revenue">
            <Card>
              <CardHeader className="">
                <CardTitle>Revenue Share Partnership</CardTitle>
                <CardDescription>Unlimited earning potential</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="md:w-1/2">
                    <h4 className="text-xl font-bold mb-4 text-foreground">
                      How It Works
                    </h4>
                    <p className="text-muted-foreground mb-4">
                      As a Revenue Share Partner, you&apos;ll work directly with
                      clients on a performance basis. You&apos;ll receive 50% of
                      all revenue generated through your digital marketing
                      efforts.
                    </p>

                    <div className="bg-highlight-yellow/10 p-4 rounded-lg mb-4">
                      <p className="font-bold">Example Scenario:</p>
                      <p className="text-muted-foreground">
                        You manage a client&apos;s $2,000 ad budget, generating
                        $6,000 in sales. Your share: $600+ (50% of the $1,200
                        commission).
                      </p>
                    </div>

                    <p className="text-muted-foreground">
                      Top performers consistently earn $600-$2,000+ per month
                      through multiple client relationships.
                    </p>
                  </div>

                  <div className="md:w-1/2 bg-accent p-6 rounded-lg">
                    <h4 className="text-xl font-bold mb-4 text-foreground">
                      Benefits
                    </h4>

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
                        <span>No earnings cap - scale with your skills</span>
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
                        <span>Client acquisition support from Workly</span>
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
                        <span>Advanced tools & resources provided</span>
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
                        <span>Ongoing mentorship & strategy support</span>
                      </li>
                    </ul>

                    <Button className="w-full mt-6 bg-highlight-yellow hover:bg-highlight-yellow/90 text-foreground font-bold">
                      Apply for Partnership →
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
