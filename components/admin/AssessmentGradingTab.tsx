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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit2, Trash2, FileText } from "lucide-react";

interface Assessment {
  id: string;
  course: string;
  title: string;
  type: "Quiz" | "Assignment" | "Exam";
  dueDate: string;
}

interface AssessmentGradingTabProps {
  assessments: Assessment[];
}

const AssessmentGradingTab: React.FC<AssessmentGradingTabProps> = ({
  assessments,
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Assessment & Grading</CardTitle>
          <Button size="sm" variant="outline">
            <PlusCircle className="h-4 w-4 mr-2" /> Create Assessment
          </Button>
        </div>
        <CardDescription>
          Manage quizzes, assignments, and grading workflows.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center gap-2">
          <Input placeholder="Search assessments..." className="max-w-sm" />
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="quiz">Quiz</SelectItem>
              <SelectItem value="assignment">Assignment</SelectItem>
              <SelectItem value="exam">Exam</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assessments.map((assessment) => (
              <TableRow key={assessment.id}>
                <TableCell className="font-medium">
                  {assessment.title}
                </TableCell>
                <TableCell>{assessment.course}</TableCell>
                <TableCell>
                  <Badge variant="outline">{assessment.type}</Badge>
                </TableCell>
                <TableCell>{assessment.dueDate}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <FileText className="h-4 w-4" />
                  </Button>{" "}
                  {/* View Submissions */}
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default AssessmentGradingTab;
