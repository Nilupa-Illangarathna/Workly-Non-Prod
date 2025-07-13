import { cache } from "react";
import { BookOpen, Clock, Trophy, Calendar } from "lucide-react";
import StatsCard from "@/components/partners/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressCard } from "@/components/students/progress-card";
import { RecentCourses } from "@/components/students/recent-course-card";
import { UpcomingEvents } from "@/components/students/upcoming-events-card";
import { auth } from "@/auth";

// Cached data fetching
const getDashboardData = cache(async () => {
  // Simulated API calls - replace with real data fetching
  const [courses, events] = await Promise.all([fetchCourses(), fetchEvents()]);

  return {
    enrolledCourses: 5,
    activeCourses: 1,
    completedCourses: 0,
    courses,
    events,
  };
});

async function fetchCourses() {
  return [
    { name: "Social Media Marketing", progress: 5, status: "active" },
    { name: "SEO", progress: 0, status: "pending" },
    { name: "Google Search & Display Ads", progress: 0, status: "pending" },
  ];
}

async function fetchEvents() {
  return [
    { title: "Live Q&A Session", date: "2025-06-05", time: "14:00 - 15:00" },
    { title: "Final Exam", date: "2024-08-01", time: "10:00 - 12:00" },
  ];
}

export default async function StudentDashboard() {
  const session = await auth();
  const { enrolledCourses, activeCourses, completedCourses, courses, events } =
    await getDashboardData();

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
        <h1 className="text-xl sm:text-2xl font-bold">
          Welcome Back,{" "}
          {session?.user?.firstname + " " + session?.user?.lastname}!
        </h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
        <StatsCard
          title="Enrolled Courses"
          value={enrolledCourses}
          icon={<BookOpen className="h-4 w-4 sm:h-6 sm:w-6" />}
          description="Total courses you are enrolled in"
          color="blue"
        />
        <StatsCard
          title="Active Courses"
          value={activeCourses}
          icon={<Clock className="h-4 w-4 sm:h-6 sm:w-6" />}
          description="Courses you are currently active in"
          color="green"
        />
        <StatsCard
          title="Completed"
          value={completedCourses}
          icon={<Trophy className="h-4 w-4 sm:h-6 sm:w-6" />}
          description="Courses you have completed"
          color="gold"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Progress Section */}
        <Card className="">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">
              Course Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <ProgressCard
              title="Social Media Marketing"
              progress={5}
              modulesCompleted="5/100 modules completed"
            />
            <ProgressCard
              title="SEO"
              progress={0}
              modulesCompleted="0/100 modules completed"
            />
          </CardContent>
        </Card>

        {/* Recent Courses */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">
              Recent Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RecentCourses courses={courses} />
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
            Upcoming Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <UpcomingEvents events={events} />
        </CardContent>
      </Card>
    </div>
  );
}
