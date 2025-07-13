"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, BookOpen, MessageSquare, FileText } from "lucide-react";

// Import the new tab components
import CourseManagementTab from "@/components/admin/CourseManagementTab";
import AssessmentGradingTab from "@/components/admin/AssessmentGradingTab";
import CommunicationEngagementTab from "@/components/admin/CommunicationEngagementTab";
import ReportingAnalyticsTab from "@/components/admin/ReportingAnalyticsTab";

const LMSPage = () => {
  const router = useRouter();

  // Placeholder data - replace with actual data fetching and state management
  const courses = [
    {
      id: "1",
      title: "Digital Marketing Fundamentals",
      students: 120,
      status: "Published" as "Published" | "Draft" | "Archived",
    },
    {
      id: "2",
      title: "Advanced SEO Techniques",
      students: 75,
      status: "Draft" as "Published" | "Draft" | "Archived",
    },
    {
      id: "3",
      title: "Social Media Strategy",
      students: 90,
      status: "Published" as "Published" | "Draft" | "Archived",
    },
  ];

  const assessments = [
    {
      id: "A1",
      course: "Digital Marketing Fundamentals",
      title: "Quiz 1",
      type: "Quiz" as "Quiz" | "Assignment" | "Exam",
      dueDate: "2025-06-15",
    },
    {
      id: "A2",
      course: "Advanced SEO Techniques",
      title: "Project Submission",
      type: "Assignment" as "Quiz" | "Assignment" | "Exam",
      dueDate: "2025-07-01",
    },
  ];

  const discussions = [
    {
      id: "D1",
      topic: "Welcome to the Course!",
      course: "Digital Marketing Fundamentals",
      replies: 15,
      lastActivity: "2 hours ago",
    },
    {
      id: "D2",
      topic: "Keyword Research Best Practices",
      course: "Advanced SEO Techniques",
      replies: 8,
      lastActivity: "1 day ago",
    },
  ];

  const reports = [
    {
      id: "R1",
      name: "Course Completion Rates",
      type: "Analytics" as "Analytics" | "Engagement",
      generated: "2025-05-20",
    },
    {
      id: "R2",
      name: "Student Engagement Report",
      type: "Engagement" as "Analytics" | "Engagement",
      generated: "2025-05-22",
    },
  ];

  // Data for ReportingAnalyticsTab
  const totalStudents = 1250;
  const activeCourses = 25;
  const completionRate = 78;

  return (
    <div className="container mx-auto p-6 bg-background text-foreground">
      <header className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-primary">
            LMS Management Dashboard
          </h1>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
        <p className="text-muted-foreground mt-1">
          Manage courses, assessments, communication, and analytics for your
          Digital Marketing LMS.
        </p>
      </header>

      <Tabs defaultValue="course-management" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6">
          <TabsTrigger
            value="course-management"
            className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" /> Course Management
          </TabsTrigger>
          <TabsTrigger
            value="assessment-grading"
            className="flex items-center gap-2">
            <FileText className="h-5 w-5" /> Assessment & Grading
          </TabsTrigger>
          <TabsTrigger
            value="communication-engagement"
            className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" /> Communication
          </TabsTrigger>
          <TabsTrigger
            value="reporting-analytics"
            className="flex items-center gap-2">
            <BarChart className="h-5 w-5" /> Reporting & Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="course-management">
          <CourseManagementTab courses={courses} />
        </TabsContent>

        <TabsContent value="assessment-grading">
          <AssessmentGradingTab assessments={assessments} />
        </TabsContent>

        <TabsContent value="communication-engagement">
          <CommunicationEngagementTab discussions={discussions} />
        </TabsContent>

        <TabsContent value="reporting-analytics">
          <ReportingAnalyticsTab
            reports={reports}
            totalStudents={totalStudents}
            activeCourses={activeCourses}
            completionRate={completionRate}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LMSPage;
