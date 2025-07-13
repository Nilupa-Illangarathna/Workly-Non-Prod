"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import { Check } from "lucide-react";
import { activateStudent } from "@/actions/admin/users";
import toast from "react-hot-toast";

const ApproveUser = ({ userID, type }: { userID: string; type: string }) => {
  const handleApprove = async () => {
    toast.promise(
      async () => {
        await activateStudent(userID);
      },
      {
        loading: "Loading...",
        success: "User approved successfully",
        error: "Approval failed",
      }
    );
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {type === "icon" ? (
          <Button variant={"default"} size={"icon"}>
            <Check />
          </Button>
        ) : (
          <Button variant={"default"}>Approve</Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Approve User?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. Make sure to check the details and
            approve the user.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => handleApprove()}>
            Approve
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ApproveUser;
