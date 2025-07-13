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
import { PlusCircle } from "lucide-react";

interface Discussion {
  id: string;
  topic: string;
  course: string;
  replies: number;
  lastActivity: string;
}

interface CommunicationEngagementTabProps {
  discussions: Discussion[];
}

const CommunicationEngagementTab: React.FC<CommunicationEngagementTabProps> = ({
  discussions,
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Communication & Engagement</CardTitle>
          <Button size="sm" variant="outline">
            <PlusCircle className="h-4 w-4 mr-2" /> New Announcement
          </Button>
        </div>
        <CardDescription>
          Facilitate discussions, announcements, and student interaction.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Announcements</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                No new announcements. Post one to notify all students.
              </p>
              {/* Placeholder for announcements list */}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Discussion Forums</CardTitle>
            </CardHeader>
            <CardContent>
              <Input placeholder="Search discussions..." className="mb-4" />
              {discussions.map((discussion) => (
                <div
                  key={discussion.id}
                  className="mb-3 pb-3 border-b last:border-b-0">
                  <h4 className="font-semibold">{discussion.topic}</h4>
                  <p className="text-xs text-muted-foreground">
                    Course: {discussion.course}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {discussion.replies} replies - Last activity:{" "}
                    {discussion.lastActivity}
                  </p>
                </div>
              ))}
              {/* Placeholder for discussion forums list */}
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommunicationEngagementTab;
