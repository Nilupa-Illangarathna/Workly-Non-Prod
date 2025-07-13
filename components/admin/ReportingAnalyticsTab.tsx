"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, BookOpen, BarChart, Trash2 } from "lucide-react";

interface Report {
  id: string;
  name: string;
  type: "Analytics" | "Engagement";
  generated: string;
}

interface ReportingAnalyticsTabProps {
  reports: Report[];
  totalStudents: number;
  activeCourses: number;
  completionRate: number;
}

const ReportingAnalyticsTab: React.FC<ReportingAnalyticsTabProps> = ({
  reports,
  totalStudents,
  activeCourses,
  completionRate,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reporting & Analytics</CardTitle>
        <CardDescription>
          Track student progress, course effectiveness, and engagement metrics.
          (Crucial for Digital Marketing!)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Students
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStudents}</div>
              <p className="text-xs text-muted-foreground">
                +10% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Courses
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeCourses}</div>
              <p className="text-xs text-muted-foreground">
                +2 since last week
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Overall Completion Rate
              </CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completionRate}%</div>
              <Progress value={completionRate} className="mt-2 h-2" />
            </CardContent>
          </Card>
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Generated Reports</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Generated On</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{report.type}</Badge>
                  </TableCell>
                  <TableCell>{report.generated}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      View
                    </Button>{" "}
                    {/* Implement actual view/download */}
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportingAnalyticsTab;
