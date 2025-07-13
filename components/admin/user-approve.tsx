// components/user-approve.tsx (Student)
"use client";

import { Button } from "@/components/ui/button";
import { activateStudent } from "@/actions/admin/users";
import { toast } from "react-hot-toast";
import { ReactNode, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getUserById } from "@/data/user";
import { dbUser } from "@/types";

export function StudentApprove({
  userId,
  children,
}: {
  userId: string;
  children: ReactNode;
}) {
  const [student, setStudent] = useState<dbUser | null>(null);

  useEffect(() => {
    const getStudent = async () => {
      const response = await getUserById(userId);
      setStudent(response);
    };

    getStudent();
  }, [userId]);

  const handleApprove = async () => {
    try {
      await activateStudent(userId);
    } catch (error) {
      toast.error("Approval failed: " + error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Student Approval</DialogTitle>
          <DialogDescription>
            This action cannot be undone. Carefully refer this and accept or
            reject the student.
          </DialogDescription>
          <div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {/* loop through student props and display with a title and value inside a div */}
              {student &&
                Object.entries(student).map(([key, value]) => (
                  <div key={key}>
                    <p className="font-semibold">{key}</p>
                    <p>{value}</p>
                  </div>
                ))}
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <Button onClick={handleApprove} variant="default">
                Approve
              </Button>
              <Button variant="destructive">Reject</Button>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
